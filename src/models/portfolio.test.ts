import { describe, expect, it } from 'vitest';
import { getPortfolio } from './portfolio.repository';
import { validatePortfolio } from './portfolio.validation';
import { experienceDisplay, filterExperience, getCurrentExperience, getFeaturedProjects, getHeroFacts, roleCount, sortExperience } from './portfolio.selectors';
import { chooseNotice } from './pwa.selectors';
import type { PortfolioConfig } from './portfolio.types';
const data = getPortfolio();

describe('canonical portfolio model', () => {
  it('validates the complete public profile', () => {
    expect(() => validatePortfolio(data)).not.toThrow();
    expect(data.experience).toHaveLength(7); expect(getFeaturedProjects(data)).toHaveLength(2);
    expect(getCurrentExperience(data).id).toBe('edhec');
    expect(getHeroFacts(data).map((fact) => fact.value)).toEqual(['11+', data.experience[0].company, 'Singapore', 'Frontend + full stack']);
  });
  it('sorts without mutating and filters by stable IDs', () => {
    const source = [...data.experience].reverse(); const original = source.map((item) => item.id);
    expect(sortExperience(source)[0].id).toBe('edhec'); expect(source.map((item) => item.id)).toEqual(original);
    expect(filterExperience(source, 'all')).toBe(source); expect(filterExperience(source, 'google-gfiber')).toHaveLength(1);
    expect(filterExperience(source, 'unknown')).toEqual([]);
    expect(roleCount(1, data.ui)).toBe('1 role shown'); expect(roleCount(0, data.ui)).toBe('0 roles shown');
  });
  it('preserves the contractor qualifier and source dates', () => {
    expect(experienceDisplay(data.experience[2], data).qualifier).toBe('Contract through Virtusa');
    expect(experienceDisplay(data.experience[0], data)).toMatchObject({ current: true, qualifier: null, period: 'Apr 2026 to Present' });
    expect(data.experience[4].startDate).toBe(data.experience[5].endDate);
  });
  it('never invents private project links or pipeline technologies', () => {
    expect(data.projects[1].technologies).toEqual([]); expect(data.projects.every((project) => project.links.length === 0)).toBe(true);
    expect(data.profile.resume).toBeNull(); expect(data.profile.portrait).toBeNull();
    expect(data.profile).not.toHaveProperty('phone');
  });
  it('only returns visible featured work', () => {
    const changed = { ...data, projects: data.projects.map((project) => ({ ...project, visible: false })) };
    expect(getFeaturedProjects(changed)).toEqual([]);
  });
  it.each([
    ['duplicate IDs', (value: PortfolioConfig): PortfolioConfig => ({ ...value, experience: [...value.experience, value.experience[0]] })],
    ['missing current role', (value: PortfolioConfig): PortfolioConfig => ({ ...value, profile: { ...value.profile, currentExperienceId: 'missing' } })],
    ['invalid base', (value: PortfolioConfig): PortfolioConfig => ({ ...value, site: { ...value.site, basePath: '/missing-slash' } })],
    ['bad career date', (value: PortfolioConfig): PortfolioConfig => ({ ...value, profile: { ...value.profile, careerStart: '2026-15' } })],
    ['bad project relationship', (value: PortfolioConfig): PortfolioConfig => ({ ...value, projects: value.projects.map((project) => ({ ...project, experienceId: 'missing' })) })],
    ['unsafe external URL', (value: PortfolioConfig): PortfolioConfig => ({ ...value, profile: { ...value.profile, socialLinks: value.profile.socialLinks.map((link) => ({ ...link, href: 'javascript:alert(1)' })) } })],
    ['wrong hero accent', (value: PortfolioConfig): PortfolioConfig => ({ ...value, hero: { ...value.hero, headingAccent: 'not in the heading' } })]
  ] as const)('rejects %s', (_label, mutate) => { expect(() => validatePortfolio(mutate(data))).toThrow(); });
  it('throws on a missing current employer instead of showing undefined', () => {
    expect(() => getCurrentExperience({ ...data, experience: [] })).toThrow();
  });
});

describe('notice priority', () => {
  const idle = { update: false, offline: false, ready: false, busy: false, error: false, cached: false };
  it('is quiet when no state needs attention', () => expect(chooseNotice(idle, data.ui)).toBeNull());
  it('prioritises updates over connectivity and installation', () => expect(chooseNotice({ ...idle, update: true, offline: true, ready: true }, data.ui)?.kind).toBe('update'));
  it('distinguishes cached and uncached offline use', () => {
    expect(chooseNotice({ ...idle, offline: true }, data.ui)?.message).toBe(data.ui.offlineUncached);
    expect(chooseNotice({ ...idle, offline: true, cached: true }, data.ui)?.message).toBe(data.ui.offlineNotice);
  });
  it('reports ready and failed updates honestly', () => {
    expect(chooseNotice({ ...idle, ready: true }, data.ui)?.message).toBe(data.ui.offlineReady);
    expect(chooseNotice({ ...idle, update: true, error: true }, data.ui)?.message).toBe(data.ui.updateFailed);
  });
});
