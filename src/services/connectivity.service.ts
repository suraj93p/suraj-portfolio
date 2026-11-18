export function isOnline(): boolean { return typeof navigator === 'undefined' || navigator.onLine; }
export function subscribeConnectivity(listener: () => void): () => void {
  window.addEventListener('online', listener); window.addEventListener('offline', listener);
  return () => { window.removeEventListener('online', listener); window.removeEventListener('offline', listener); };
}
