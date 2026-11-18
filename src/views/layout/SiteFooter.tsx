import type { MouseEvent } from 'react';
import type { PortfolioConfig } from '../../models/portfolio.types';
import { Icon } from '../components/Icon';
import styles from './SiteFooter.module.scss';
type Props = { config: PortfolioConfig; year: number; onPrint: () => void; onNavigate: (event: MouseEvent<HTMLAnchorElement>, target: string) => void; canInstall: boolean; onInstall: () => void; installing: boolean; installMessage: string; showInstallHelp: boolean; updateDeferred: boolean; onUpdate: () => void; updating: boolean };
export function SiteFooter({ config, year, onPrint, onNavigate, canInstall, onInstall, installing, installMessage, showInstallHelp, updateDeferred, onUpdate, updating }: Props) {
  const { footer, ui } = config;
  return <footer className={styles.footer}><div className={`container ${styles.inner}`}>
    <div className={styles.identity}><p>{footer.name}<span aria-hidden="true"> / </span><span>{footer.location}</span></p><p className={styles.copyright}>{footer.copyrightPrefix} {year}. {ui.footerNote}</p></div>
    <div className={styles.controls}>
      {config.features.printProfile && <button type="button" onClick={onPrint}><Icon name="print" size={15} />{footer.printLabel}</button>}
      {canInstall && <button type="button" onClick={onInstall} disabled={installing}><Icon name="download" size={15} />{installing ? ui.installing : ui.installLabel}</button>}
      {updateDeferred && <button type="button" onClick={onUpdate} disabled={updating}><Icon name="refresh" size={15} />{updating ? ui.updating : ui.updateAction}</button>}
      <a href="#top" onClick={(event) => onNavigate(event, 'top')}>{footer.backToTopLabel}<Icon name="arrowUp" size={15} /></a>
    </div>
    {showInstallHelp && <details className={styles.installHelp}><summary>{ui.installHelpLabel}</summary><p>{ui.installHelpText}</p></details>}
    {installMessage && <p className={styles.installStatus} role="status">{installMessage}</p>}
  </div></footer>;
}
