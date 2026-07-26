const User = require('../models/User');

let clients = [];

const fetchSocialAccounts = async () => {
  // Public broadcasting of all database user accounts is disabled for privacy & security
  return [];
};

const addClient = async (res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Keep-alive heartbeat every 15 seconds
  const heartbeat = setInterval(() => {
    res.write(':\n\n');
  }, 15000);

  clients.push(res);

  // Send initial data immediately
  try {
    const accounts = await fetchSocialAccounts();
    res.write(`data: ${JSON.stringify(accounts)}\n\n`);
  } catch (err) {
    console.error('Error fetching initial social accounts:', err);
  }

  res.on('close', () => {
    clearInterval(heartbeat);
    clients = clients.filter(c => c !== res);
  });
};

const broadcastSocialAccounts = async () => {
  if (clients.length === 0) return;
  try {
    const accounts = await fetchSocialAccounts();
    const data = `data: ${JSON.stringify(accounts)}\n\n`;
    clients.forEach(client => {
      try {
        client.write(data);
      } catch (err) {
        console.error('Failed to write to client, connection may be broken', err);
      }
    });
  } catch (err) {
    console.error('Error broadcasting social accounts:', err);
  }
};

module.exports = {
  addClient,
  broadcastSocialAccounts,
};
