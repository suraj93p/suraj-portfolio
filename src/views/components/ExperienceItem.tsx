import type { ExperienceDisplay } from '../../models/portfolio.selectors';
import type { UiCopy } from '../../models/portfolio.types';
import { Icon } from './Icon';
import styles from './ExperienceItem.module.scss';
export function ExperienceItem({ item, hidden, ui }: { item: ExperienceDisplay; hidden: boolean; ui: UiCopy }) {
  return <article data-experience-item={item.id} className={`${styles.item} ${item.current ? styles.current : ''} ${hidden ? styles.hidden : ''}`} aria-labelledby={`role-${item.id}`}>
    <div className={styles.meta}>
      <p className={styles.period}>{item.period}</p>
      <p className={styles.location}><Icon name="location" size={13} />{item.location}</p>
      {item.current && <span className={styles.present}>{ui.currentRoleLabel}</span>}
    </div>
    <div className={styles.body}>
      <p className={styles.company}>{item.company}</p>
      <h3 id={`role-${item.id}`}>{item.role}</h3>
      {item.qualifier && <p className={styles.qualifier}>{item.qualifier}</p>}
      <p className={styles.summary}>{item.summary}</p>
      <ul className={styles.contributions}>{item.contributions.map((text) => <li key={text}>{text}</li>)}</ul>
      <ul className="tagList" aria-label={ui.toolkitLabel}>{item.technologies.map((technology) => <li className="tag" key={technology}>{technology}</li>)}</ul>
      {item.transitionNote && <p className={styles.note}>{item.transitionNote}</p>}
    </div>
  </article>;
}
