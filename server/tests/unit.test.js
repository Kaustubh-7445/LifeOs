const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { computeProductivityScore } = require('../services/analyticsService');
const { sanitizeQuery } = require('../middleware/sanitize');

test('Unit Test: Habit Streak Date Normalization Algorithm', () => {
  const normalize = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  assert.equal(normalize(today), normalize(new Date()));
  assert.notEqual(normalize(today), normalize(yesterday));
  assert.equal(normalize(today) - normalize(yesterday), 86400000);
});

test('Unit Test: Productivity Score Computation Helper', () => {
  const score = computeProductivityScore({
    tasksCompleted: 4,
    tasksTotal: 5,
    habitsCompleted: 3,
    habitsTotal: 3,
    goalsProgress: 80,
  });

  // Task: 4/5 * 40 = 32
  // Habit: 3/3 * 30 = 30
  // Goal: 80/100 * 30 = 24
  // Total: 32 + 30 + 24 = 86
  assert.equal(score, 86);
});

test('Unit Test: SHA-256 Token & Password Hashing Verification', () => {
  const rawToken = 'test-refresh-token-12345';
  const hashed1 = crypto.createHash('sha256').update(rawToken).digest('hex');
  const hashed2 = crypto.createHash('sha256').update(rawToken).digest('hex');

  assert.equal(hashed1, hashed2);
  assert.equal(hashed1.length, 64);
  assert.notEqual(rawToken, hashed1);
});

test('Unit Test: NoSQL Injection Query Operator Stripping', () => {
  const mockReq = {
    query: {
      status: { '$ne': null },
      category: 'work',
    },
    body: {
      password: { '$gt': '' },
      email: 'user@example.com',
    },
    params: { id: '123' },
  };

  sanitizeQuery(mockReq, {}, () => {});

  assert.deepEqual(mockReq.query, { category: 'work' });
  assert.deepEqual(mockReq.body, { email: 'user@example.com' });
  assert.deepEqual(mockReq.params, { id: '123' });
});
