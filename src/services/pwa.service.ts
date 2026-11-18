/** Native registration keeps update activation user-controlled, including across tabs. */
export type WorkerSnapshot = { supported: boolean; offlineReady: boolean; needRefresh: boolean };
export type PwaConnection = { activate: () => Promise<void>; check: () => Promise<void>; dispose: () => void };
export const initialWorkerSnapshot: WorkerSnapshot = { supported: false, offlineReady: false, needRefresh: false };
let registrationPromise: Promise<ServiceWorkerRegistration> | undefined;

export function connectPwa(onChange: (state: WorkerSnapshot) => void, enabled: boolean, base: string): PwaConnection {
  if (!enabled || !('serviceWorker' in navigator)) {
    return { activate: async () => { throw new Error('Service workers unavailable'); }, check: async () => {}, dispose: () => {} };
  }
  let disposed = false;
  let registration: ServiceWorkerRegistration | undefined;
  let snapshot: WorkerSnapshot = { ...initialWorkerSnapshot, supported: true };
  let hadController = Boolean(navigator.serviceWorker.controller);
  let reloadRequired = false;
  let activationRequested = false;
  let activationTimer: ReturnType<typeof setTimeout> | undefined;
  let resolveActivation: (() => void) | undefined;
  let rejectActivation: ((error: Error) => void) | undefined;
  const removers: (() => void)[] = [];
  const emit = (patch: Partial<WorkerSnapshot>) => { snapshot = { ...snapshot, ...patch }; if (!disposed) onChange(snapshot); };
  const watchWorker = (worker: ServiceWorker | null) => {
    if (!worker) return;
    const stateChanged = () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) emit({ needRefresh: true });
      }
      if (worker.state === 'activated') emit({ offlineReady: true });
    };
    worker.addEventListener('statechange', stateChanged);
    removers.push(() => worker.removeEventListener('statechange', stateChanged));
    stateChanged();
  };
  const onController = () => {
    emit({ offlineReady: true });
    if (activationRequested) {
      clearTimeout(activationTimer); resolveActivation?.(); window.location.reload();
    } else if (hadController) {
      // Another tab accepted an update. This tab stays usable until its user reloads.
      reloadRequired = true; emit({ needRefresh: true });
    }
    hadController = true;
  };
  navigator.serviceWorker.addEventListener('controllerchange', onController);
  removers.push(() => navigator.serviceWorker.removeEventListener('controllerchange', onController));
  emit({ supported: true });
  registrationPromise ??= navigator.serviceWorker.register(`${base}sw.js`, { scope: base, updateViaCache: 'none' }).catch((error: unknown) => {
    registrationPromise = undefined; throw error;
  });
  const ready = registrationPromise.then((registered) => {
    if (disposed) return registered;
    registration = registered;
    if (registered.active?.state === 'activated') emit({ offlineReady: true });
    if (registered.waiting) emit({ needRefresh: true });
    watchWorker(registered.installing);
    const onUpdateFound = () => watchWorker(registered.installing);
    registered.addEventListener('updatefound', onUpdateFound);
    removers.push(() => registered.removeEventListener('updatefound', onUpdateFound));
    return registered;
  });
  // Installation failure does not make the ordinary website fail or claim offline readiness.
  void ready.catch(() => { if (!disposed) emit({ supported: false }); });
  return {
    activate: async () => {
      if (reloadRequired) { window.location.reload(); return; }
      await ready;
      if (disposed || !registration?.waiting) throw new Error('No update is waiting');
      activationRequested = true;
      return new Promise<void>((resolve, reject) => {
        resolveActivation = resolve; rejectActivation = reject;
        activationTimer = setTimeout(() => { activationRequested = false; reject(new Error('Update activation timed out')); }, 15000);
        registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
    },
    check: async () => { const registered = await ready; if (!disposed && navigator.onLine) await registered.update(); },
    dispose: () => {
      disposed = true; clearTimeout(activationTimer); removers.forEach((remove) => remove());
      if (activationRequested) rejectActivation?.(new Error('PWA connection disposed'));
    }
  };
}
