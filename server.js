const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https'); // For keep-alive requests
const app = express();

const TARGET_URL = 'https://9000-firebase-studio-1753507758504.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev/?monospaceUid=331419';

app.use('/', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  secure: false,  // Set to false for self-signed certs
  ws: true,
  pathRewrite: (path, req) => path
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// ----------- Keep-Alive Ping -----------
const keepAlive = () => {
  const keepAliveUrl = new URL(TARGET_URL);
  const options = {
    hostname: keepAliveUrl.hostname,
    path: keepAliveUrl.pathname + keepAliveUrl.search,
    method: 'GET',
    headers: {
      'User-Agent': 'KeepAliveBot/1.0'
    },
    rejectUnauthorized: false // Ignore self-signed certs if needed
  };

  const req = https.request(options, res => {
    console.log(`[Keep-Alive] Status: ${res.statusCode}`);
    res.on('data', () => {}); // Drain response
  });

  req.on('error', err => {
    console.error(`[Keep-Alive] Error: ${err.message}`);
  });

  req.end();
};

// Ping every 5 minutes (300,000 ms)
setInterval(keepAlive, 300000);
keepAlive(); // Initial ping on startup
