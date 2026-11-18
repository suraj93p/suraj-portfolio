import type { Project, UiCopy } from '../../models/portfolio.types';
import { Icon } from './Icon';
import styles from './ProjectCard.module.scss';
export function ProjectCard({ project, index, detailsEnabled, ui }: { project: Project; index: number; detailsEnabled: boolean; ui: UiCopy }) {
  return <article data-project-card className={styles.card} aria-labelledby={`project-${project.id}`}>
    <div className={styles.top}><span className={styles.icon}><Icon name={project.id === 'excel-add-in' ? 'grid' : 'database'} size={24} /></span><span className="sectionNumber" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
    <p className={styles.category}>{project.category}</p>
    <h3 id={`project-${project.id}`}>{project.title}</h3>
    <p className={styles.summary}>{project.summary}</p>
    <ul className="tagList">{(project.technologies.length ? project.technologies : project.scopeTags).map((tag) => <li key={tag} className="tag">{tag}</li>)}</ul>
    {detailsEnabled && <details className={`details ${styles.details}`}><summary>{ui.projectDetails}</summary>
      <dl className={styles.detailContent}>
        <dt>{ui.contextLabel}</dt><dd>{project.context}</dd>
        <dt>{ui.contributionLabel}</dt><dd>{project.contribution}</dd>
        <dt>{ui.resultLabel}</dt><dd>{project.result}</dd>
      </dl>
    </details>}
    {project.links.length > 0 && <div className={styles.links}>{project.links.map((link) => <a key={link.id} className="textLink" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Icon name="arrowUpRight" /><span className="srOnly"> ({ui.externalLinkSuffix})</span></a>)}</div>}
  </article>;
}
