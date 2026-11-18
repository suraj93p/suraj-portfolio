import type { ExperienceDisplay } from '../../models/portfolio.selectors';
import type { UiCopy } from '../../models/portfolio.types';
import styles from './ExperienceFilter.module.scss';
export function ExperienceFilter({ items, selected, onSelect, countLabel, ui }: { items: readonly ExperienceDisplay[]; selected: string; onSelect: (id: string) => void; countLabel: string; ui: UiCopy }) {
  return <div data-no-print className={styles.wrapper}>
    <div role="group" aria-label={ui.experienceFilterLabel} className={styles.filters}>
      <button type="button" aria-pressed={selected === 'all'} onClick={() => onSelect('all')}>{ui.allExperienceLabel}</button>
      {items.map((item) => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>{item.company}</button>)}
    </div>
    <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">{countLabel}</p>
  </div>;
}
