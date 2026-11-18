import type { Education, PortfolioConfig } from '../../models/portfolio.types';
import { SectionHeader } from '../components/SectionHeader';
import { Icon } from '../components/Icon';
import styles from './EducationSection.module.scss';
export function EducationSection({ config, items }: { config: PortfolioConfig; items: readonly (Education & { period: string })[] }) {
  return <section id="education" className="section" aria-label={config.sectionCopy.education.eyebrow}><div className={`container ${styles.layout}`}><SectionHeader copy={config.sectionCopy.education} number="05" compact /><div>{items.map((item) => <article className={styles.card} key={item.id}><span className={styles.icon}><Icon name="education" size={28} /></span><div className={styles.copy}><p className={styles.period}>{item.period}</p><h3>{item.institution}</h3><p className={styles.degree}>{item.qualification}<br />{item.field}</p><p className={styles.summary}>{item.summary}</p></div></article>)}</div></div></section>;
}
