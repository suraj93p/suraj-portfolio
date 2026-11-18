import type { ExpertiseGroup, UiCopy } from '../../models/portfolio.types';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import styles from './SkillGroup.module.scss';
const icons: Record<string, IconName> = { frontend: 'code', 'interface-systems': 'layers', 'full-stack-data': 'database', quality: 'quality', delivery: 'delivery', collaboration: 'collaboration' };
export function SkillGroup({ group, ui }: { group: ExpertiseGroup; ui: UiCopy }) {
  return <article className={styles.group} aria-labelledby={`skill-${group.id}`}>
    <span className={styles.icon}><Icon name={icons[group.id] ?? 'code'} size={22} /></span>
    <h3 id={`skill-${group.id}`}>{group.title}</h3>
    <p>{group.description}</p>
    <ul className="tagList">{group.primary.map((skill) => <li key={skill} className="tag">{skill}</li>)}</ul>
    {group.secondary.length > 0 && <details className={`details ${styles.details}`}><summary>{ui.moreTools}</summary><ul className="tagList">{group.secondary.map((skill) => <li key={skill} className="tag">{skill}</li>)}</ul></details>}
  </article>;
}
