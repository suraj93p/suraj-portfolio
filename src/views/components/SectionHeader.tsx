import type { SectionCopy } from '../../models/portfolio.types';
import styles from './SectionHeader.module.scss';
export function SectionHeader({ copy, number, compact = false }: { copy: SectionCopy; number: string; compact?: boolean }) {
  return <div className={`${styles.header} ${compact ? styles.compact : ''}`}>
    <div className={styles.eyebrowRow}><p className="eyebrow">{copy.eyebrow}</p><span className="sectionNumber" aria-hidden="true">{number}</span></div>
    <h2 tabIndex={-1}>{copy.heading}</h2>
    {copy.intro && <p className={styles.intro}>{copy.intro}</p>}
  </div>;
}
