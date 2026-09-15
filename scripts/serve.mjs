import http from 'node:http';
import os from 'node:os';
import { createAuth } from '../server/auth.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 8765);
const origin = process.env.APP_ORIGIN || `http://127.0.0.1:${port}`;
const dbPath = path.resolve(process.env.DATABASE_PATH || path.join(os.homedir(), '.local/share/happiness-home/auth.db'));
if (inside(root, dbPath)) throw Error('DATABASE_PATH must be outside the public repository');
const auth = createAuth({dbPath, origin, appId:process.env.ZHIHU_OAUTH_APP_ID, appKey:process.env.ZHIHU_OAUTH_APP_KEY, redirectUri:process.env.ZHIHU_OAUTH_REDIRECT_URI});
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
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, origin);
      if (await auth.handle(req, res, url)) return;
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405).end();
        return;
      }
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes('\\') || decoded.includes('\0')) {res.writeHead(400).end();return;}
      const pathname = path.posix.normalize(decoded);
      const allowed = pathname === '/' || /^\/(index\.html|avg-enter\.js|flow\.js|prefetch-(duty|elevator)\.json)$/.test(pathname) || /^\/(assets|mobile|auth|avg|duty|elevator)\//.test(pathname);
      if (!allowed || pathname.split('/').some(part => part.startsWith('.')) || /\.(db|sqlite|env|mjs)(-|$)/i.test(pathname)) {res.writeHead(404).end();return;}
      if (/^\/(avg|duty|elevator)(\/|$)/.test(pathname) && !auth.user(req)) {
        res.writeHead(303, {Location:'/?login=required', 'Cache-Control':'no-store'}).end();return;
      }
      if (/^\/(avg|duty|elevator)\//.test(pathname)) res.setHeader('Cache-Control','private, no-store');
      let file = path.resolve(root, '.' + pathname);
      if (!inside(root, file) || (fs.existsSync(file) && !inside(root, fs.realpathSync(file)))) {
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
      const realFile = fs.realpathSync(file);
      if (!inside(root, realFile)) {res.writeHead(403).end();return;}
      const relative = '/' + path.relative(root, realFile).split(path.sep).join('/');
      if (relative !== pathname && relative !== pathname.replace(/\/$/, '') + '/index.html') {res.writeHead(403).end();return;}
      const stat = fs.statSync(file);
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      if (!res.hasHeader('Cache-Control')) res.setHeader(
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
