import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPortfolio } from '../models/portfolio.repository';
import { experienceDisplay } from '../models/portfolio.selectors';
import { useContactController } from './useContactController';
import { useExperienceController } from './useExperienceController';
import { usePwaController } from './usePwaController';
import { usePrintController } from './usePrintController';
import type { WorkerSnapshot } from '../services/pwa.service';
const fake = vi.hoisted(() => ({ emit: null as ((value: WorkerSnapshot) => void) | null, activate: vi.fn(), check: vi.fn(), dispose: vi.fn() }));
vi.mock('../services/pwa.service', () => ({
  initialWorkerSnapshot: { supported: false, offlineReady: false, needRefresh: false },
  connectPwa: (emit: (state: WorkerSnapshot) => void) => { fake.emit = emit; return { activate: fake.activate, check: fake.check, dispose: fake.dispose }; }
}));
const data = getPortfolio();
beforeEach(() => { fake.activate.mockReset().mockResolvedValue(undefined); fake.check.mockReset().mockResolvedValue(undefined); fake.dispose.mockReset(); });

describe('small controllers', () => {
  it('selects an unknown role then resets', () => {
    const { result } = renderHook(() => useExperienceController(data.experience.map((item) => experienceDisplay(item, data))));
    act(() => result.current.selectCompany('missing')); expect(result.current.visibleExperience).toEqual([]);
    act(() => result.current.reset()); expect(result.current.visibleExperience).toHaveLength(7);
  });
  it('resets clipboard feedback and cancels its timer on unmount', async () => {
    vi.useFakeTimers(); const { result, unmount } = renderHook(() => useContactController(data.profile.email));
    await act(() => result.current.copyEmail()); expect(result.current.copyStatus).toBe('success');
    act(() => vi.advanceTimersByTime(6000)); expect(result.current.copyStatus).toBe('idle');
    await act(() => result.current.copyEmail()); unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it('does not update a disposed clipboard operation', async () => {
    let resolve!: () => void; vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => new Promise<void>((done) => { resolve = done; }));
    const { result, unmount } = renderHook(() => useContactController(data.profile.email));
    let action!: Promise<void>; act(() => { action = result.current.copyEmail(); }); unmount(); await act(async () => { resolve(); await action; });
  });
  it('restores native details when print listeners are disposed', () => {
    const main = document.createElement('main'); main.innerHTML = '<details><summary>Example</summary>Body</details>'; document.body.append(main);
    const { result, unmount } = renderHook(usePrintController); act(() => result.current()); expect(main.querySelector('details')?.open).toBe(true);
    unmount(); expect(main.querySelector('details')?.open).toBe(false); main.remove();
  });
});

describe('PWA controller', () => {
  it('omits unsupported prompts and cleans up its adapter', () => {
    const { result, unmount } = renderHook(() => usePwaController(true, true, data.ui));
    expect(result.current.canInstall).toBe(false); expect(result.current.notice).toBeNull(); unmount(); expect(fake.dispose).toHaveBeenCalledOnce();
  });
  it('shows ready only after the adapter reports actual readiness', () => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui));
    act(() => fake.emit?.({ supported: true, offlineReady: true, needRefresh: false })); expect(result.current.notice?.kind).toBe('ready');
    act(() => result.current.dismissNotice()); expect(result.current.notice).toBeNull();
  });
  it('reports uncached connectivity honestly and lets the user dismiss it', () => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui));
    act(() => { Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false }); window.dispatchEvent(new Event('offline')); });
    expect(result.current.notice?.message).toBe(data.ui.offlineUncached); act(() => result.current.dismissNotice()); expect(result.current.notice).toBeNull();
    act(() => { Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true }); window.dispatchEvent(new Event('online')); });
    expect(result.current.notice).toBeNull();
  });
  it('can defer an update and later retry a failed activation', async () => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui));
    act(() => fake.emit?.({ supported: true, offlineReady: true, needRefresh: true }));
    expect(result.current.notice?.kind).toBe('update'); act(() => result.current.dismissNotice()); expect(result.current.updateDeferred).toBe(true);
    fake.activate.mockRejectedValueOnce(new Error('Offline')); await act(() => result.current.update());
    expect(result.current.notice?.message).toBe(data.ui.updateFailed); expect(result.current.updating).toBe(false);
    await act(() => result.current.update()); expect(fake.activate).toHaveBeenCalledTimes(2);
  });
  it.each(['accepted', 'dismissed'] as const)('uses an actual deferred prompt: %s', async (outcome) => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui));
    const prompt = vi.fn().mockResolvedValue(undefined); const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome, platform: 'web' }) });
    act(() => window.dispatchEvent(event)); expect(result.current.canInstall).toBe(true); expect(event.defaultPrevented).toBe(true);
    await act(() => result.current.install()); expect(prompt).toHaveBeenCalledOnce(); expect(result.current.canInstall).toBe(false);
    expect(result.current.installMessage).toBe(outcome === 'dismissed' ? data.ui.installDismissed : '');
  });
  it('handles a rejected prompt without a fake success', async () => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui));
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, { prompt: vi.fn().mockRejectedValue(new Error('Denied')), userChoice: Promise.resolve({ outcome: 'accepted' }) });
    act(() => window.dispatchEvent(event)); await act(() => result.current.install()); expect(result.current.installMessage).toBe(data.ui.installFailed);
  });
  it('clears the prompt when the browser reports installation', () => {
    const { result } = renderHook(() => usePwaController(true, true, data.ui)); act(() => window.dispatchEvent(new Event('appinstalled')));
    expect(result.current.canInstall).toBe(false); expect(result.current.showInstallHelp).toBe(false);
  });
  it('does not intercept prompts when installation is disabled', () => {
    const { result } = renderHook(() => usePwaController(true, false, data.ui)); const event = new Event('beforeinstallprompt', { cancelable: true });
    act(() => window.dispatchEvent(event)); expect(event.defaultPrevented).toBe(false); expect(result.current.canInstall).toBe(false);
  });
});
