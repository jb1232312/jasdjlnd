const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const http = require('http'); // For self-pinging (Render ping)
const app = express();

// Target you are proxying to
const TARGET_URL = 'https://9000-firebase-studio-1753507758504.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev';

// Proxy middleware
app.use('/', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  secure: false,
  ws: true,
  pathRewrite: (path, req) => path
}));

// Local keep-alive endpoint for Render self-ping
app.get('/keepalive', (req, res) => {
  res.status(200).send('Render app is awake!');
});

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// ----------- Self-ping to keep Render awake -----------
const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;

const pingSelf = () => {
  const url = new URL('/keepalive', SELF_URL);
  const req = http.request(
    {
      hostname: url.hostname,
      path: url.pathname,
      port: url.port,
      method: 'GET',
    },
    res => {
      console.log(`[Render Keep-Alive] Status: ${res.statusCode}`);
    }
  );

  req.on('error', err => {
    console.error(`[Render Keep-Alive] Error: ${err.message}`);
  });

  req.end();
};

// Ping every 5 minutes
setInterval(pingSelf, 300000);
pingSelf(); // Initial ping
