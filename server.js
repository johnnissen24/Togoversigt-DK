'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const username = process.env.LOGIN_USER;
const password = process.env.LOGIN_PASSWORD;
const port = Number(process.env.PORT || 10000);
if (!username || !password) {
  console.error('LOGIN_USER og LOGIN_PASSWORD skal indstilles som environment variables på Render.');
  process.exit(1);
}
const html = fs.readFileSync(path.join(__dirname, 'index.html'));
function equal(a, b) {
  const x = crypto.createHash('sha256').update(a).digest();
  const y = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(x, y);
}
function authorized(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  try {
    const raw = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const colon = raw.indexOf(':');
    if (colon < 0) return false;
    return equal(raw.slice(0, colon), username) && equal(raw.slice(colon + 1), password);
  } catch { return false; }
}
const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (!authorized(req)) {
    res.writeHead(401, {'WWW-Authenticate': 'Basic realm="Togoversigt Danmark", charset="UTF-8"', 'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Login påkrævet.');
    return;
  }
  if ((req.url === '/' || req.url === '/index.html') && (req.method === 'GET' || req.method === 'HEAD')) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Content-Length': html.length});
    if (req.method === 'HEAD') res.end(); else res.end(html);
    return;
  }
  res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('Siden findes ikke.');
});
server.listen(port, '0.0.0.0', () => console.log(`Togoversigt lytter på port ${port}`));
