import type { PortfolioConfig } from '../../models/portfolio.types';
import { SectionHeader } from '../components/SectionHeader';
import styles from './AboutSection.module.scss';
export function AboutSection({ about }: { about: PortfolioConfig['about'] }) {
  return <section id="about" className="section" aria-label={about.eyebrow}><div className="container">
    <div className={styles.introduction}><SectionHeader copy={about} number="01" compact /><div className={styles.body}>{about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
    <div className={styles.principles}>{about.principles.map((principle, index) => <article key={principle.id}><span className="sectionNumber" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{principle.title}</h3><p>{principle.body}</p></article>)}</div>
  </div></section>;
}
