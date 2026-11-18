import type { Experience, PortfolioConfig, Project, UiCopy } from './portfolio.types';
import { completeCareerYears, formatPeriod } from '../utils/dates';
import { interpolate } from '../utils/text';

export function sortExperience(items: readonly Experience[]): readonly Experience[] {
  return [...items].sort((a, b) => b.startDate.localeCompare(a.startDate));
}
export function filterExperience(items: readonly Experience[], id: string): readonly Experience[] {
  return id === 'all' ? items : items.filter((item) => item.id === id);
}
export function getCurrentExperience(config: PortfolioConfig): Experience {
  const current = config.experience.find((item) => item.id === config.profile.currentExperienceId);
  if (!current) throw new Error('Current experience not found');
  return current;
}
export function getFeaturedProjects(config: PortfolioConfig): readonly Project[] {
  return config.projects.filter((project) => project.visible && project.featured);
}
export function roleCount(count: number, ui: UiCopy): string {
  return interpolate(count === 1 ? ui.experienceCountSingular : ui.experienceCount, { count });
}
export function getHeroFacts(config: PortfolioConfig): readonly { id: string; label: string; value: string }[] {
  return config.hero.summaryItems.map((fact) => {
    const values = {
      careerYears: `${completeCareerYears(config.profile.careerStart, config.contentAsOf)}+`,
      currentCompany: getCurrentExperience(config).company,
      location: config.profile.location
    };
    return { id: fact.id, label: fact.label, value: fact.valueKind === 'text' ? fact.value : values[fact.valueKind] };
  });
}
export function experienceDisplay(item: Experience, config: PortfolioConfig) {
  return {
    ...item,
    period: formatPeriod(item.startDate, item.endDate, config.ui.present, config.ui.yearSeparator, config.site.locale),
    qualifier: item.engagement === 'contract' ? interpolate(config.ui.contractTemplate, { company: item.contractingCompany }) : null,
    current: item.id === config.profile.currentExperienceId
  };
}
export type ExperienceDisplay = ReturnType<typeof experienceDisplay>;
