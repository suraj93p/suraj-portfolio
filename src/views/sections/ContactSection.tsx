import type { PortfolioConfig } from '../../models/portfolio.types';
import { Button, LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import styles from './ContactSection.module.scss';
type Props = { config: PortfolioConfig; copyStatus: 'idle' | 'copying' | 'success' | 'error'; onCopy: () => void };
export function ContactSection({ config, copyStatus, onCopy }: Props) {
  const { contact, profile, ui } = config;
  return <section id="contact" className={styles.section} aria-label={contact.eyebrow}><div className="container"><div data-contact className={styles.panel}>
    <div className={styles.intro}><p className={`eyebrow ${styles.eyebrow}`}>{contact.eyebrow}</p><h2 tabIndex={-1}>{contact.heading}</h2><p className={styles.body}>{contact.body}</p></div>
    <div className={styles.actions}>
      <a className={styles.email} href={`mailto:${profile.email}`}>{profile.email}<Icon name="arrowUpRight" size={22} /></a>
      <div className={styles.buttons} data-no-print><LinkButton variant="light" href={`mailto:${profile.email}`}><Icon name="mail" size={17} />{contact.emailActionLabel}</LinkButton><Button variant="ghost" onClick={onCopy} disabled={copyStatus === 'copying'}><Icon name={copyStatus === 'success' ? 'check' : 'copy'} size={16} />{copyStatus === 'copying' ? ui.copyingEmail : copyStatus === 'success' ? ui.copiedButton : contact.copyActionLabel}</Button></div>
      <p className={styles.copyStatus} role="status" aria-live="polite" aria-atomic="true">{copyStatus === 'success' ? ui.emailCopied : copyStatus === 'error' ? ui.emailCopyFailed : ''}</p>
      <nav aria-label={ui.contactLinkLabel} className={styles.socials}>{profile.socialLinks.map((link) => <a href={link.href} key={link.id} target="_blank" rel="noopener noreferrer">{link.label}<Icon name="arrowUpRight" size={15} /><span className="srOnly"> ({ui.externalLinkSuffix})</span></a>)}</nav>
    </div>
  </div></div></section>;
}
