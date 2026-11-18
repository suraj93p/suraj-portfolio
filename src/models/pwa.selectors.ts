import type { UiCopy } from './portfolio.types';

export type NoticeState = { kind: 'update' | 'offline' | 'ready'; message: string; busy: boolean } | null;
export function chooseNotice(state: { update: boolean; offline: boolean; ready: boolean; busy: boolean; error: boolean; cached: boolean }, ui: UiCopy): NoticeState {
  if (state.update) return { kind: 'update', message: state.error ? ui.updateFailed : ui.updateAvailable, busy: state.busy };
  if (state.offline) return { kind: 'offline', message: state.cached ? ui.offlineNotice : ui.offlineUncached, busy: false };
  if (state.ready) return { kind: 'ready', message: ui.offlineReady, busy: false };
  return null;
}

