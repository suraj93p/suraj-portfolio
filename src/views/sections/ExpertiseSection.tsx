import type { PortfolioConfig } from '../../models/portfolio.types';
import { SectionHeader } from '../components/SectionHeader';
import { SkillGroup } from '../components/SkillGroup';
import styles from './ExpertiseSection.module.scss';
export function ExpertiseSection({ config }: { config: PortfolioConfig }) {
  return <section id="expertise" className="section" aria-label={config.sectionCopy.expertise.eyebrow}><div className="container"><SectionHeader copy={config.sectionCopy.expertise} number="04" /><div className={styles.grid}>{config.expertise.map((group) => <SkillGroup key={group.id} group={group} ui={config.ui} />)}</div></div></section>;
}
