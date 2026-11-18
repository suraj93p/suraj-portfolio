/** Exercises the real native registration adapter against deterministic browser fakes.
 * These checks do not replace the production service-worker browser tests.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const file = new URL('../src/services/pwa.service.ts', import.meta.url);
const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
let checks = 0;
let sequence = 0;
const check = (label, callback) => { callback(); checks++; console.log(`PASS ${label}`); };
const flush = async () => { for (let n = 0; n < 5; n++) await Promise.resolve(); };
const original = { navigator: Object.getOwnPropertyDescriptor(globalThis, 'navigator'), window: Object.getOwnPropertyDescriptor(globalThis, 'window') };
class Worker extends EventTarget {
  state = 'installing'; messages = [];
  postMessage(message) { this.messages.push(message); }
  stateTo(state) { this.state = state; this.dispatchEvent(new Event('statechange')); }
}
class Registration extends EventTarget {
  active = null; installing = new Worker(); waiting = null; checks = 0;
  async update() { this.checks++; }
}
class Container extends EventTarget {
  controller = null; calls = []; failure = false;
  constructor(registration) { super(); this.registration = registration; }
  async register(url, options) { this.calls.push({ url, options }); if (this.failure) throw new Error('Registration denied'); return this.registration; }
}
async function fixture() {
  const registration = new Registration(); const container = new Container(registration);
  const context = { reloads: 0, online: true };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { serviceWorker: container, get onLine() { return context.online; } } });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { reload() { context.reloads++; } } } });
  const adapter = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${++sequence}`);
  const states = []; return { ...adapter, registration, container, context, states, emit: (state) => states.push(state) };
}
try {
  let f = await fixture(); let client = f.connectPwa(f.emit, false, '/');
  check('development does not register a worker', () => assert.equal(f.container.calls.length, 0));
  await assert.rejects(client.activate(), /unavailable/); check('unsupported activation rejects honestly', () => assert.equal(f.states.length, 0)); client.dispose();

  f = await fixture(); client = f.connectPwa(f.emit, true, '/portfolio/'); await flush();
  check('worker URL and scope respect deployment base', () => assert.deepEqual(f.container.calls[0], { url: '/portfolio/sw.js', options: { scope: '/portfolio/', updateViaCache: 'none' } }));
  check('registration is not a false offline-ready claim', () => assert.equal(f.states.at(-1).offlineReady, false));
  f.registration.installing.stateTo('installed'); check('first install waits for activation', () => assert.equal(f.states.at(-1).offlineReady, false));
  f.registration.installing.stateTo('activated'); check('activation reports offline readiness', () => assert.equal(f.states.at(-1).offlineReady, true));
  f.container.dispatchEvent(new Event('controllerchange')); check('first control does not reload the page', () => assert.equal(f.context.reloads, 0));
  await client.check(); check('explicit online check requests a worker update', () => assert.equal(f.registration.checks, 1));
  f.context.online = false; await client.check(); check('offline check does not fetch updates', () => assert.equal(f.registration.checks, 1));
  client.dispose(); const calls = f.states.length; f.container.dispatchEvent(new Event('controllerchange'));
  check('disposal removes native listeners', () => assert.equal(f.states.length, calls));

  f = await fixture(); let first = f.connectPwa(f.emit, true, '/'); first.dispose(); client = f.connectPwa(f.emit, true, '/'); await flush();
  check('Strict Mode subscriptions share one registration', () => assert.equal(f.container.calls.length, 1)); client.dispose();

  f = await fixture(); f.container.controller = new Worker(); f.registration.waiting = new Worker(); client = f.connectPwa(f.emit, true, '/'); await flush();
  check('a waiting worker produces an update notice', () => assert.equal(f.states.at(-1).needRefresh, true));
  check('a waiting update is not automatically activated', () => assert.deepEqual(f.registration.waiting.messages, []));
  let activation = client.activate(); await flush(); check('explicit acceptance sends SKIP_WAITING', () => assert.deepEqual(f.registration.waiting.messages, [{ type: 'SKIP_WAITING' }]));
  f.container.dispatchEvent(new Event('controllerchange')); await activation;
  check('accepting user reloads once after activation', () => assert.equal(f.context.reloads, 1)); client.dispose();

  f = await fixture(); f.container.controller = new Worker(); client = f.connectPwa(f.emit, true, '/'); await flush(); f.container.dispatchEvent(new Event('controllerchange'));
  check('another tab does not force a reload', () => assert.equal(f.context.reloads, 0));
  check('another tab offers an explicit update action', () => assert.equal(f.states.at(-1).needRefresh, true)); await client.activate();
  check('other tab reloads only after its own acceptance', () => assert.equal(f.context.reloads, 1)); client.dispose();

  f = await fixture(); f.container.failure = true; client = f.connectPwa(f.emit, true, '/'); await flush();
  check('registration failure preserves ordinary website operation', () => assert.equal(f.states.at(-1).supported, false));
  check('failed registration never claims saved content', () => assert.equal(f.states.at(-1).offlineReady, false)); client.dispose();
  f.container.failure = false; client = f.connectPwa(f.emit, true, '/'); await flush(); check('failed registration can retry', () => assert.equal(f.container.calls.length, 2));
  await assert.rejects(client.activate(), /No update/); check('activation requires a real waiting update', () => assert.equal(f.context.reloads, 0)); client.dispose();

  f = await fixture(); f.container.controller = new Worker(); client = f.connectPwa(f.emit, true, '/'); await flush();
  f.registration.installing = new Worker(); f.registration.dispatchEvent(new Event('updatefound')); f.registration.installing.stateTo('installed');
  check('newly discovered installed worker raises update notice', () => assert.equal(f.states.at(-1).needRefresh, true));
  f.registration.waiting = f.registration.installing; activation = client.activate(); const rejection = assert.rejects(activation, /disposed/); await flush(); client.dispose(); await rejection;
  check('disposing a pending update rejects without leaked timer', () => assert.equal(f.context.reloads, 0));
  console.log(`\n${checks} native PWA adapter checks passed. Real worker caching still requires production browser tests.`);
} finally {
  for (const [key, descriptor] of Object.entries(original)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
}
