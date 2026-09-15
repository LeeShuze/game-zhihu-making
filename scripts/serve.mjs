import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 8765);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
};

function inside(base, file) {
  const resolved = path.resolve(file);
  return resolved === base || resolved.startsWith(base + path.sep);
}

http
  .createServer((req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405).end();
        return;
      }
      const url = new URL(req.url, 'http://localhost');
      let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (!inside(root, file)) {
        res.writeHead(403).end();
        return;
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404).end('Not found');
        return;
      }
      if (fs.statSync(file).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          res.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
          return;
        }
        file = path.join(file, 'index.html');
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404).end('Not found');
        return;
      }
      const stat = fs.statSync(file);
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      res.setHeader(
        'Cache-Control',
        /\.(html|json|js|mjs|css)$/.test(file) ? 'no-cache' : 'public, max-age=3600'
      );
      res.setHeader('Content-Length', stat.size);
      if (req.method === 'HEAD') res.end();
      else fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(400).end('Bad request');
    }
  })
  .listen(port, process.env.HOST || '127.0.0.1', () => {
    console.log(`幸福之家：http://127.0.0.1:${port}/`);
  });
