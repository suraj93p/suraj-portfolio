import { portfolioConfig } from '../config/portfolio.config';
import type { PortfolioConfig } from './portfolio.types';
import { validatePortfolio } from './portfolio.validation';

/** The only application module allowed to import the editable content configuration. */
export function getPortfolio(): PortfolioConfig {
  validatePortfolio(portfolioConfig);
  return portfolioConfig;
}
