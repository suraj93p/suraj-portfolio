import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { UiCopy } from '../models/portfolio.types';
import { isOnline, subscribeConnectivity } from '../services/connectivity.service';
import { connectPwa, initialWorkerSnapshot } from '../services/pwa.service';
import type { PwaConnection } from '../services/pwa.service';
import { chooseNotice } from '../models/pwa.selectors';
import { readPreference, writePreference } from '../services/storage.service';

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaController(enabled: boolean, allowInstall: boolean, ui: UiCopy) {
  const [worker, setWorker] = useState(initialWorkerSnapshot);
  const [deferredInstall, setDeferredInstall] = useState<InstallEvent | null>(null);
  const [standalone, setStandalone] = useState(() => window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
  const [installMessage, setInstallMessage] = useState('');
  const [installing, setInstalling] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [offlineDismissed, setOfflineDismissed] = useState(false);
  const [readyDismissed, setReadyDismissed] = useState(() => readPreference('offline-ready') === 'dismissed');
  const online = useSyncExternalStore(subscribeConnectivity, isOnline, () => true);
  const connection = useRef<PwaConnection | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const client = connectPwa(setWorker, enabled && import.meta.env.PROD, import.meta.env.BASE_URL);
    connection.current = client;
    let lastCheck = Date.now();
    const checkOnResume = () => {
      if (document.visibilityState === 'visible' && navigator.onLine && Date.now() - lastCheck > 60000) {
        lastCheck = Date.now(); void client.check().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', checkOnResume);
    return () => { mounted.current = false; connection.current = null; client.dispose(); document.removeEventListener('visibilitychange', checkOnResume); };
  }, [enabled]);
  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const onMedia = () => setStandalone(media.matches);
    const onPrompt = (event: Event) => { if (!allowInstall) return; event.preventDefault(); setDeferredInstall(event as InstallEvent); };
    const onInstalled = () => { setDeferredInstall(null); setStandalone(true); setInstallMessage(''); };
    media.addEventListener('change', onMedia);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { media.removeEventListener('change', onMedia); window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, [allowInstall]);
  useEffect(() => { if (online) setOfflineDismissed(false); }, [online]);
  const install = useCallback(async () => {
    if (!deferredInstall || standalone || installing) return;
    setInstalling(true); setInstallMessage('');
    try {
      await deferredInstall.prompt();
      const choice = await deferredInstall.userChoice;
      if (mounted.current && choice.outcome === 'dismissed') setInstallMessage(ui.installDismissed);
    } catch { if (mounted.current) setInstallMessage(ui.installFailed); }
    finally { if (mounted.current) { setDeferredInstall(null); setInstalling(false); } }
  }, [deferredInstall, standalone, installing, ui]);
  const update = useCallback(async () => {
    if (updating) return;
    setUpdating(true); setUpdateError(false); setUpdateDismissed(false);
    try {
      if (!connection.current) throw new Error('Update connection unavailable');
      await connection.current.activate();
    } catch { if (mounted.current) setUpdateError(true); }
    finally { if (mounted.current) setUpdating(false); }
  }, [updating]);
  const notice = chooseNotice({ update: worker.needRefresh && !updateDismissed, offline: enabled && !online && !offlineDismissed, ready: worker.offlineReady && !readyDismissed, busy: updating, error: updateError, cached: worker.offlineReady }, ui);
  const dismissNotice = () => {
    if (notice?.kind === 'update') setUpdateDismissed(true);
    if (notice?.kind === 'offline') setOfflineDismissed(true);
    if (notice?.kind === 'ready') { setReadyDismissed(true); writePreference('offline-ready', 'dismissed'); }
  };
  return {
    notice, dismissNotice, update, updating,
    canInstall: enabled && allowInstall && Boolean(deferredInstall) && !standalone,
    installing, install, installMessage,
    showInstallHelp: enabled && allowInstall && !standalone && !deferredInstall,
    updateDeferred: worker.needRefresh && updateDismissed
  };
}
