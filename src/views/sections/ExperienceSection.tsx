import type { PortfolioConfig } from '../../models/portfolio.types';
import type { ExperienceDisplay } from '../../models/portfolio.selectors';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceFilter } from '../components/ExperienceFilter';
import { ExperienceItem } from '../components/ExperienceItem';
import { Button } from '../components/Button';
import styles from './ExperienceSection.module.scss';
type Props = { config: PortfolioConfig; items: readonly ExperienceDisplay[]; selected: string; countLabel: string; empty: boolean; onSelect: (id: string) => void; onReset: () => void };
export function ExperienceSection({ config, items, selected, countLabel, empty, onSelect, onReset }: Props) {
  return <section id="experience" className="section" aria-label={config.sectionCopy.experience.eyebrow}><div className="container">
    <SectionHeader copy={config.sectionCopy.experience} number="02" />
    {config.features.experienceFilters && <ExperienceFilter items={items} selected={selected} onSelect={onSelect} countLabel={countLabel} ui={config.ui} />}
    <div className={styles.timeline}>{items.map((item) => <ExperienceItem key={item.id} item={item} hidden={config.features.experienceFilters && selected !== 'all' && item.id !== selected} ui={config.ui} />)}</div>
    {empty && <div className={styles.empty} data-no-print><p>{config.ui.noExperience}</p><Button variant="secondary" onClick={onReset}>{config.ui.resetFilters}</Button></div>}
  </div></section>;
}
