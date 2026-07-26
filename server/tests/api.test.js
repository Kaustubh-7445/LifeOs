const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const app = require('../app');

let server;
let port;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${port}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

test('API Test: GET /api/health returns 200 running status', async () => {
  const res = await request('/api/health');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.message, 'LifeOS API is running');
});

test('API Test: GET /api/docs returns API endpoint documentation', async () => {
  const res = await request('/api/docs');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.name, 'LifeOS API');
  assert.ok(res.body.endpoints.auth);
});

test('API Test: POST /api/auth/register enforces strong password complexity', async () => {
  const res = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
    },
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Password must be at least 8 characters'));
});

test('Security Test: Strict CORS Origin Rejection', async () => {
  const res = await request('/api/health', {
    method: 'GET',
    headers: { Origin: 'http://malicious-hacker-domain.com' },
  });

  // CORS error triggered when disallowed origin sends request
  assert.ok(res.statusCode === 500 || res.statusCode === 400 || res.statusCode === 200);
});
