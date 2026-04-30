// Tiny static-file server + a single POST endpoint for persisting database.json.
// Run with:   node server.js
// Then open:  http://localhost:8000
//
// Without this server the game still works (localStorage), but database.json on
// disk won't update. With it running, every recorded score is written through.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'database.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.wav':  'audio/wav',
  '.mp3':  'audio/mpeg',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // ----- POST /api/save-db : overwrite database.json with the request body -----
  if (req.method === 'POST' && url.pathname === '/api/save-db') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2_000_000) {  // 2 MB cap
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        const userCount = Object.keys((parsed && parsed.users) || {}).length;
        console.log(`[${new Date().toISOString()}] saved database.json (${userCount} user${userCount === 1 ? '' : 's'})`);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // ----- Everything else: static file serving -----
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let pathname = url.pathname;
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(ROOT, decodeURIComponent(pathname));

  // Prevent directory traversal (e.g. /../something)
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🐤  Pluck the Duck`);
  console.log(`    → http://localhost:${PORT}`);
  console.log(`    (POST /api/save-db writes ${DB_PATH})\n`);
});
