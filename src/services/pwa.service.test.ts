import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WorkerSnapshot } from './pwa.service';

class WorkerStub extends EventTarget {
  state = 'installing'; postMessage = vi.fn();
  setState(value: string) { this.state = value; this.dispatchEvent(new Event('statechange')); }
}
class RegistrationStub extends EventTarget {
  installing: WorkerStub | null = new WorkerStub(); waiting: WorkerStub | null = null; active: WorkerStub | null = null;
  update = vi.fn().mockResolvedValue(undefined);
}
class ContainerStub extends EventTarget {
  controller: WorkerStub | null = null;
  register = vi.fn();
}
let registration: RegistrationStub; let workers: ContainerStub;
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
beforeEach(() => {
  vi.resetModules(); registration = new RegistrationStub(); workers = new ContainerStub();
  workers.register.mockResolvedValue(registration); Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: workers });
});
afterEach(() => { Reflect.deleteProperty(navigator, 'serviceWorker'); });

describe('native PWA registration adapter', () => {
  it('does not register in development or when unavailable', async () => {
    const { connectPwa } = await import('./pwa.service');
    const client = connectPwa(vi.fn(), false, '/'); expect(workers.register).not.toHaveBeenCalled(); await expect(client.activate()).rejects.toThrow(); await client.check(); client.dispose();
    Reflect.deleteProperty(navigator, 'serviceWorker'); const unavailable = connectPwa(vi.fn(), true, '/'); await expect(unavailable.activate()).rejects.toThrow(); unavailable.dispose();
  });
  it('registers once through Strict Mode subscriptions and uses the base scope', async () => {
    const { connectPwa } = await import('./pwa.service'); const a = connectPwa(vi.fn(), true, '/portfolio/'); a.dispose();
    const b = connectPwa(vi.fn(), true, '/portfolio/'); await flush();
    expect(workers.register).toHaveBeenCalledExactlyOnceWith('/portfolio/sw.js', { scope: '/portfolio/', updateViaCache: 'none' });
    await b.check(); expect(registration.update).toHaveBeenCalledOnce(); b.dispose();
  });
  it('does not claim offline readiness until activation', async () => {
    const { connectPwa } = await import('./pwa.service'); const states: WorkerSnapshot[] = [];
    const client = connectPwa((state) => states.push(state), true, '/'); await flush();
    expect(states.at(-1)?.offlineReady).toBe(false); registration.installing?.setState('installed'); expect(states.at(-1)?.offlineReady).toBe(false);
    registration.installing?.setState('activated'); expect(states.at(-1)?.offlineReady).toBe(true); client.dispose();
  });
  it('keeps an update waiting until explicit activation and reports timeouts', async () => {
    vi.useFakeTimers(); workers.controller = new WorkerStub(); registration.waiting = new WorkerStub();
    const { connectPwa } = await import('./pwa.service'); const emit = vi.fn(); const client = connectPwa(emit, true, '/'); await flush();
    expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ needRefresh: true })); expect(registration.waiting.postMessage).not.toHaveBeenCalled();
    const action = client.activate(); const rejection = expect(action).rejects.toThrow('timed out'); await flush();
    expect(registration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' }); await vi.advanceTimersByTimeAsync(15000); await rejection; client.dispose();
  });
  it('responds to another tab with a notice, not a forced reload', async () => {
    workers.controller = new WorkerStub(); const { connectPwa } = await import('./pwa.service'); const emit = vi.fn(); const client = connectPwa(emit, true, '/'); await flush();
    workers.dispatchEvent(new Event('controllerchange')); expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ offlineReady: true, needRefresh: true })); client.dispose();
  });
  it('watches a newly found worker and removes listeners on disposal', async () => {
    workers.controller = new WorkerStub(); const { connectPwa } = await import('./pwa.service'); const emit = vi.fn(); const client = connectPwa(emit, true, '/'); await flush();
    registration.installing = new WorkerStub(); registration.dispatchEvent(new Event('updatefound')); registration.installing.setState('installed');
    expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ needRefresh: true })); client.dispose(); const calls = emit.mock.calls.length;
    registration.installing.setState('activated'); workers.dispatchEvent(new Event('controllerchange')); expect(emit).toHaveBeenCalledTimes(calls);
  });
  it('falls back to an ordinary website after registration failure', async () => {
    workers.register.mockRejectedValueOnce(new Error('Unavailable')); const { connectPwa } = await import('./pwa.service'); const emit = vi.fn(); const client = connectPwa(emit, true, '/'); await flush();
    expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ supported: false, offlineReady: false })); client.dispose();
  });
  it('rejects activation when no update is waiting', async () => {
    const { connectPwa } = await import('./pwa.service'); const client = connectPwa(vi.fn(), true, '/'); await expect(client.activate()).rejects.toThrow('No update'); client.dispose();
  });
});
