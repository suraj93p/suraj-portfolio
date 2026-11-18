import { useMemo } from 'react';
import { getPortfolio } from '../models/portfolio.repository';
import { experienceDisplay, getFeaturedProjects, getHeroFacts, sortExperience } from '../models/portfolio.selectors';
import { formatPeriod } from '../utils/dates';

export function usePortfolioController() {
  return useMemo(() => {
    const config = getPortfolio();
    return {
      config,
      facts: getHeroFacts(config),
      experience: sortExperience(config.experience).map((item) => experienceDisplay(item, config)),
      projects: getFeaturedProjects(config),
      education: config.education.map((item) => ({ ...item, period: formatPeriod(item.startDate, item.endDate, config.ui.present, config.ui.yearSeparator, config.site.locale) })),
      year: new Date().getFullYear()
    };
  }, []);
}
