import type { RefObject } from 'react';
import type { NoticeState } from '../../models/pwa.selectors';
import type { UiCopy } from '../../models/portfolio.types';
import { Button } from './Button';
import { Icon } from './Icon';
import styles from './Notice.module.scss';
export function Notice({ notice, ui, onUpdate, onDismiss, noticeRef, placement = 'bottom' }: { noticeRef?: RefObject<HTMLElement | null>; placement?: 'bottom' | 'top'; notice: NoticeState; ui: UiCopy; onUpdate: () => void; onDismiss: () => void }) {
  if (!notice) return null;
  return <aside ref={noticeRef} data-pwa-notice data-placement={placement} className={styles.notice} aria-label={ui.pwaStatusLabel}>
    <div className={styles.message}><Icon name={notice.kind === 'update' ? 'refresh' : notice.kind === 'offline' ? 'offline' : 'check'} size={18} /><p role="status" aria-live="polite">{notice.message}</p></div>
    {notice.kind === 'update' ? <div className={styles.actions}><Button onClick={onUpdate} disabled={notice.busy}>{notice.busy ? ui.updating : ui.updateAction}</Button><Button variant="secondary" onClick={onDismiss} disabled={notice.busy}>{ui.updateLater}</Button></div> : <button type="button" className={styles.dismiss} aria-label={ui.dismissNotice} onClick={onDismiss}><Icon name="close" size={16} /></button>}
  </aside>;
}
