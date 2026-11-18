import type { PortfolioConfig } from './portfolio.types';
import { completeCareerYears, parseDateOnly, parseYearMonth } from '../utils/dates';
import { assetUrl, canonicalUrl, isHttpsUrl, normaliseBase } from '../utils/urls';

export function validatePortfolio(config: PortfolioConfig): void {
  const requireValue = (condition: unknown, message: string): void => { if (!condition) throw new Error(`Portfolio: ${message}`); };
  const ids = (items: readonly { id: string }[], field: string): void => {
    const found = new Set<string>();
    items.forEach((item) => {
      requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id), `${field}: invalid ID ${item.id}`);
      requireValue(!found.has(item.id), `${field}: duplicate ID ${item.id}`); found.add(item.id);
    });
  };
  normaliseBase(config.site.basePath);
  canonicalUrl(config.site.canonicalOrigin, config.site.basePath);
  parseDateOnly(config.contentAsOf);
  completeCareerYears(config.profile.careerStart, config.contentAsOf);
  requireValue(config.profile.name.trim(), 'profile.name is required');
  requireValue(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.profile.email), 'profile.email is invalid');
  [config.experience, config.projects, config.expertise, config.education, config.interests, config.navigation, config.profile.socialLinks, config.about.principles, config.hero.summaryItems].forEach((items, index) => ids(items, `collection ${index}`));
  const validSections = new Set(['about', 'experience', 'projects', 'expertise', 'education', 'beyond', 'contact']);
  config.navigation.forEach((link) => requireValue(validSections.has(link.sectionId), `navigation section ${link.sectionId} is missing`));
  [config.hero.primaryAction, config.hero.secondaryAction].forEach((action) => requireValue(validSections.has(action.target), `hero target ${action.target} is missing`));
  requireValue(config.experience.some((job) => job.id === config.profile.currentExperienceId && job.endDate === null), 'currentExperienceId must reference a present role');
  config.experience.forEach((job) => {
    requireValue(parseYearMonth(job.startDate) <= parseDateOnly(config.contentAsOf), `${job.id}: future start date`);
    if (job.endDate) requireValue(parseYearMonth(job.startDate) <= parseYearMonth(job.endDate), `${job.id}: start after end`);
    requireValue(job.engagement === 'contract' ? Boolean(job.contractingCompany?.trim()) : job.contractingCompany === null, `${job.id}: invalid contracting company`);
    requireValue(job.company.trim() && job.role.trim(), `${job.id}: company and role are required`);
  });
  config.education.forEach((item) => requireValue(parseYearMonth(item.startDate) <= parseYearMonth(item.endDate), `${item.id}: invalid education dates`));
  config.projects.forEach((project) => {
    requireValue(project.experienceId === null || config.experience.some((job) => job.id === project.experienceId), `${project.id}: unknown experienceId`);
    project.links.forEach((link) => requireValue(isHttpsUrl(link.href), `${project.id}: invalid HTTPS link`));
    if (project.image) assetUrl(project.image.path, config.site.basePath);
  });
  config.profile.socialLinks.forEach((link) => requireValue(isHttpsUrl(link.href), `${link.id}: invalid HTTPS link`));
  config.pwa.icons.forEach((icon) => assetUrl(icon.src, config.site.basePath));
  assetUrl(config.pwa.appleTouchIcon, config.site.basePath);
  assetUrl(config.site.socialImage.path, config.site.basePath);
  if (config.profile.resume) assetUrl(config.profile.resume.path, config.site.basePath);
  if (config.profile.portrait) assetUrl(config.profile.portrait.path, config.site.basePath);
  Object.entries(config.ui).forEach(([key, value]) => requireValue(value.trim(), `ui.${key} must not be empty`));
  requireValue(config.hero.heading.includes(config.hero.headingAccent), 'hero.headingAccent must be part of heading');
}
