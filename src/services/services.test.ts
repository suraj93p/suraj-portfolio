import { describe, expect, it, vi } from 'vitest';
import { writeClipboard } from './clipboard.service';
import { readPreference, writePreference } from './storage.service';
import { isOnline, subscribeConnectivity } from './connectivity.service';

describe('browser adapters', () => {
  it('writes clipboard text and propagates failure', async () => {
    await writeClipboard('hello'); expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Denied')); await expect(writeClipboard('hello')).rejects.toThrow('Denied');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); await expect(writeClipboard('hello')).rejects.toThrow();
  });
  it('handles storage denial without breaking the application', () => {
    writePreference('example', 'yes'); expect(readPreference('example')).toBe('yes');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Denied'); }); expect(readPreference('example')).toBeNull();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full'); }); expect(() => writePreference('example', 'no')).not.toThrow();
  });
  it('subscribes and unsubscribes connectivity events', () => {
    const callback = vi.fn(); const dispose = subscribeConnectivity(callback); expect(isOnline()).toBe(true);
    window.dispatchEvent(new Event('offline')); expect(callback).toHaveBeenCalledOnce(); dispose();
    window.dispatchEvent(new Event('online')); expect(callback).toHaveBeenCalledOnce();
  });
});
