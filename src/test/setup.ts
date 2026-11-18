import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: vi.fn((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn()
  })) });
  class Observer {
    observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn(); takeRecords = vi.fn(() => []);
    root = null; rootMargin = ''; thresholds = [0];
  }
  vi.stubGlobal('IntersectionObserver', Observer);
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  vi.spyOn(window, 'print').mockImplementation(() => {});
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
