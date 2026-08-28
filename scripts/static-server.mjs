import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const knownRoutes = new Set(['/', '/demo', '/privacy', '/terms']);
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8' };

function send(file, response, status = 200) {
  response.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
  createReadStream(file).pipe(response);
}

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', `http://${request.headers.host}`).pathname);
  const file = normalize(join(root, pathname));
  if (!file.startsWith(root)) { send(join(root, '404.html'), response, 404); return; }
  if (knownRoutes.has(pathname)) { send(join(root, 'index.html'), response); return; }
  if (existsSync(file) && !pathname.endsWith('/')) { send(file, response); return; }
  send(join(root, '404.html'), response, 404);
}).listen(port, '127.0.0.1');
