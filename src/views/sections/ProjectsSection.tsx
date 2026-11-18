import type { PortfolioConfig, Project } from '../../models/portfolio.types';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import styles from './ProjectsSection.module.scss';
export function ProjectsSection({ config, projects }: { config: PortfolioConfig; projects: readonly Project[] }) {
  return <section id="projects" className="section" aria-label={config.sectionCopy.projects.eyebrow}><div className="container"><SectionHeader copy={config.sectionCopy.projects} number="03" /><div className={styles.grid}>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} detailsEnabled={config.features.projectDetails} ui={config.ui} />)}</div></div></section>;
}
