/** Build + preview + Cloudflare Quick Tunnel, without a process-management dependency. */
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import { loadConfig } from './load-config.mjs';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const cloudflared = process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared';
const check = spawnSync(cloudflared, ['--version'], { stdio: 'ignore' });
if (check.error || check.status !== 0) {
  console.error('cloudflared is not installed or is not on PATH. On macOS: brew install cloudflared. See README.md for other platforms.');
  process.exit(1);
}
console.log('This shares the production portfolio at a public temporary URL. Stop with Ctrl+C.');
const build = spawnSync(npm, ['run', 'build'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (build.status !== 0) process.exit(build.status ?? 1);
const config = await loadConfig();
const viteBin = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const preview = spawn(process.execPath, [fileURLToPath(viteBin), 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'inherit' });
let tunnel;
let stopping = false;
const stop = (code = 0) => {
  if (stopping) return; stopping = true;
  tunnel?.kill('SIGTERM'); preview.kill('SIGTERM');
  process.exitCode = code;
};
process.on('SIGINT', () => stop()); process.on('SIGTERM', () => stop());
preview.on('error', (error) => { console.error(error.message); stop(1); });
preview.on('exit', (code) => { if (!stopping) stop(code ?? 1); });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (stopping) break;
    try { const response = await fetch(`http://127.0.0.1:4173${config.site.basePath}`); if (response.ok) { ready = true; break; } } catch { /* Preview may still be starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('The local production preview did not start on port 4173.');
  tunnel = spawn(cloudflared, ['tunnel', '--url', 'http://127.0.0.1:4173', '--http-host-header', 'localhost:4173'], { stdio: 'inherit' });
  tunnel.on('error', (error) => { console.error(error.message); stop(1); });
  tunnel.on('exit', (code) => { if (!stopping) stop(code ?? 0); });
} catch (error) { console.error(error instanceof Error ? error.message : error); stop(1); }
