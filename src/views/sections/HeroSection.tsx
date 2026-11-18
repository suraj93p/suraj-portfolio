import type { MouseEvent } from 'react';
import type { PortfolioConfig } from '../../models/portfolio.types';
import { LinkButton } from '../components/Button';
import { Icon } from '../components/Icon';
import styles from './HeroSection.module.scss';
type Props = { config: PortfolioConfig; facts: readonly { id: string; label: string; value: string }[]; onNavigate: (event: MouseEvent<HTMLAnchorElement>, target: string) => void };
export function HeroSection({ config, facts, onNavigate }: Props) {
  const { hero, profile, ui } = config;
  const accentIndex = hero.heading.indexOf(hero.headingAccent);
  return <section id="hero" className={styles.hero} aria-labelledby="hero-title">
    <div className={`container ${styles.grid}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span aria-hidden="true" />{hero.eyebrow}</p>
        <h1 id="hero-title" tabIndex={-1}>{hero.heading.slice(0, accentIndex)}<span>{hero.headingAccent}</span>{hero.heading.slice(accentIndex + hero.headingAccent.length)}</h1>
        <p className={styles.intro}>{hero.intro}</p>
        <div className={styles.actions} data-no-print>
          <LinkButton href={`#${hero.primaryAction.target}`} onClick={(event) => onNavigate(event, hero.primaryAction.target)}>{hero.primaryAction.label}<Icon name="arrow" size={18} /></LinkButton>
          <LinkButton variant="secondary" href={`#${hero.secondaryAction.target}`} onClick={(event) => onNavigate(event, hero.secondaryAction.target)}>{hero.secondaryAction.label}<Icon name="arrowUpRight" size={17} /></LinkButton>
        </div>
      </div>
      <aside className={styles.profile} aria-label={ui.profileCardTitle}>
        <div className={styles.profileTop}><span className={styles.monogram} aria-hidden="true">{profile.initials}</span><div><p className={styles.profileLabel}>{ui.profileCardLabel}</p><p className={styles.profileName}>{profile.name}</p></div></div>
        <dl className={styles.facts}>{facts.map((fact, index) => <div className={styles.fact} key={fact.id}><dt>{fact.label}</dt><dd className={index === 0 ? styles.number : ''}>{fact.value}</dd></div>)}</dl>
        <p className={styles.role}>{profile.roleHeadline}</p>
        <a href="#experience" className={styles.journey} onClick={(event) => onNavigate(event, 'experience')}>{ui.viewExperience}<Icon name="arrow" size={17} /></a>
      </aside>
    </div>
  </section>;
}
