import type { MouseEvent, RefObject } from 'react';
import type { PortfolioConfig } from '../../models/portfolio.types';
import { Icon } from '../components/Icon';
import { LinkButton } from '../components/Button';
import styles from './SiteHeader.module.scss';
type Props = {
  config: PortfolioConfig;
  isMenuOpen: boolean;
  activeSectionId: string;
  headerRef: RefObject<HTMLElement | null>;
  toggleRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, target: string) => void;
};
export function SiteHeader({ config, isMenuOpen, activeSectionId, headerRef, toggleRef, onToggle, onNavigate }: Props) {
  return <>
    <a className="skipLink" href="#main-content" onClick={(event) => onNavigate(event, 'main-content')}>{config.ui.skipToContent}</a>
    <header ref={headerRef} className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.wordmark} href="#top" aria-label={config.ui.profileHomeLabel} onClick={(event) => onNavigate(event, 'top')}>{config.site.brandText.slice(0, -1)}<span>{config.site.brandText.slice(-1)}</span></a>
        <button className={styles.toggle} type="button" ref={toggleRef} aria-label={isMenuOpen ? config.ui.closeMenu : config.ui.openMenu} aria-expanded={isMenuOpen} aria-controls="primary-navigation" onClick={onToggle}><Icon name={isMenuOpen ? 'close' : 'menu'} size={22} /></button>
        <nav id="primary-navigation" className={`${styles.navigation} ${isMenuOpen ? styles.open : ''}`} aria-label={config.ui.primaryNavigationLabel}>
          <ul>{config.navigation.map((item) => <li key={item.id}><a href={`#${item.sectionId}`} aria-current={activeSectionId === item.sectionId ? 'location' : undefined} onClick={(event) => onNavigate(event, item.sectionId)}>{item.label}</a></li>)}</ul>
        </nav>
        <LinkButton className={styles.contact} href="#contact" onClick={(event) => onNavigate(event, 'contact')}>{config.ui.navContactLabel}<Icon name="arrowUpRight" size={16} /></LinkButton>
      </div>
    </header>
  </>;
}
