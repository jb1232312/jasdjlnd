// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const TARGET_URL = 'https://9000-firebase-studio-1753507758504.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev/?monospaceUid=331419';

app.use('/', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  secure: false,  // Set to false if self-signed certs
  ws: true,
  pathRewrite: (path, req) => {
    return path; // Keep path as-is
  }
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
