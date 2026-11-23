/**
 * Renders /cv and /en/cv from the built site into real PDF files.
 *
 *   npm run cv:pdf
 *
 * Requires Chrome/Chromium. Set CHROME_PATH if it is not in a known location.
 * The PDFs land in public/cv/ so they ship with the next build; regenerate them
 * whenever cv.json / cv.es.json changes.
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = resolve('dist');
const OUT = resolve('public/cv');
const PORT = 4327;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/home/yeyo/.hermes/tools/chromium-1248/chrome-linux64/chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/opt/brave-bin/brave',
].filter(Boolean);

async function findChrome() {
  for (const candidate of CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  throw new Error('Chrome/Chromium not found. Set CHROME_PATH.');
}

function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = join(DIST, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) path = join(path, 'index.html');
    try {
      const body = await readFile(path);
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
      return;
    } catch {
      /* maybe it is a directory */
    }
    try {
      const body = await readFile(join(path, 'index.html'));
      res.writeHead(200, { 'content-type': MIME['.html'] });
      res.end(body);
      return;
    } catch {
      try {
        const body = await readFile(join(DIST, 'index.html'));
        res.writeHead(200, { 'content-type': MIME['.html'] });
        res.end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    }
  });
  return new Promise((resolveServer) => server.listen(PORT, '127.0.0.1', () => resolveServer(server)));
}

function print(chrome, url, target) {
  return new Promise((resolvePrint, reject) => {
    const child = spawn(chrome, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-pdf-header-footer',
      '--virtual-time-budget=8000',
      `--print-to-pdf=${target}`,
      url,
    ], { stdio: 'ignore' });
    child.on('exit', (code) => (code === 0 ? resolvePrint() : reject(new Error(`chrome exited ${code}`))));
  });
}

const chrome = await findChrome();
await mkdir(OUT, { recursive: true });
const server = await serve();

const jobs = [
  { route: '/cv', file: 'diego-quinones-cv-es.pdf' },
  { route: '/en/cv', file: 'diego-quinones-cv-en.pdf' },
];

for (const job of jobs) {
  const tmp = join(tmpdir(), job.file);
  await rm(tmp, { force: true });
  await print(chrome, `http://127.0.0.1:${PORT}${job.route}`, tmp);
  await copyFile(tmp, join(OUT, job.file));
  console.log(`[cv] ${job.route} -> public/cv/${job.file}`);
  await rm(tmp, { force: true });
}

server.close();
