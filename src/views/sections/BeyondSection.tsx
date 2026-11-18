import type { PortfolioConfig } from '../../models/portfolio.types';
import { SectionHeader } from '../components/SectionHeader';
import { Icon } from '../components/Icon';
import styles from './BeyondSection.module.scss';
export function BeyondSection({ config }: { config: PortfolioConfig }) {
  return <section id="beyond" className="section" aria-label={config.sectionCopy.beyond.eyebrow}><div className="container"><SectionHeader copy={config.sectionCopy.beyond} number="06" /><div className={styles.grid}>{config.interests.map((interest) => <article data-interest-card className={styles.interest} key={interest.id}><span className={styles.icon}><Icon name={interest.icon} size={23} /></span><h3>{interest.title}</h3><p>{interest.body}</p></article>)}</div></div></section>;
}
