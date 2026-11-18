import type { HtmlTagDescriptor, Plugin } from 'vite';
import type { PortfolioConfig } from '../src/models/portfolio.types';
import { validatePortfolio } from '../src/models/portfolio.validation';
import { sortExperience } from '../src/models/portfolio.selectors';
import { assetUrl, canonicalUrl } from '../src/utils/urls';
import { formatPeriod } from '../src/utils/dates';
import { escapeHtml } from '../src/utils/text';

export function createNoScript(config: PortfolioConfig): string {
  const e = escapeHtml;
  const roles = sortExperience(config.experience).map((job) => `<article><h3>${e(job.role)} | ${e(job.company)}</h3><p>${e(formatPeriod(job.startDate, job.endDate, config.ui.present, config.ui.yearSeparator, config.site.locale))}</p>${job.engagement === 'contract' ? `<p>${e(config.ui.contractTemplate.replace('{company}', job.contractingCompany))}</p>` : ''}<p>${e(job.summary)}</p></article>`).join('');
  const links = config.profile.socialLinks.map((link) => `<a href="${e(link.href)}">${e(link.label)}</a>`).join(' | ');
  return `<noscript><main class="noscript"><h1>${e(config.ui.noScriptHeading)}</h1><p>${e(config.ui.noScriptNote)}</p><h2>${e(config.profile.roleHeadline)}</h2><p>${e(config.hero.intro)}</p><h2>${e(config.sectionCopy.experience.eyebrow)}</h2>${roles}<h2>${e(config.contact.eyebrow)}</h2><p><a href="mailto:${e(config.profile.email)}">${e(config.profile.email)}</a></p><p>${links}</p></main></noscript>`;
}
export function htmlMetadata(config: PortfolioConfig): Plugin {
  validatePortfolio(config);
  return {
    name: 'portfolio-metadata',
    transformIndexHtml(html) {
      const base = config.site.basePath;
      const canonical = canonicalUrl(config.site.canonicalOrigin, base);
      const tags: HtmlTagDescriptor[] = [
        { tag: 'title', children: escapeHtml(config.site.title) },
        { tag: 'meta', attrs: { name: 'description', content: config.site.description } },
        { tag: 'meta', attrs: { name: 'theme-color', content: config.site.themeColor } },
        { tag: 'meta', attrs: { name: 'color-scheme', content: 'light' } },
        { tag: 'meta', attrs: { name: 'robots', content: config.site.indexable ? 'index, follow' : 'noindex, nofollow' } },
        { tag: 'meta', attrs: { property: 'og:title', content: config.site.title } },
        { tag: 'meta', attrs: { property: 'og:description', content: config.site.description } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:locale', content: config.site.locale.replace('-', '_') } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: config.site.title } },
        { tag: 'meta', attrs: { name: 'twitter:description', content: config.site.description } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: config.site.shortName } },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: assetUrl('favicon.svg', base) } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: assetUrl(config.pwa.appleTouchIcon, base) } }
      ];
      if (canonical) {
        const image = new URL(config.site.socialImage.path, canonical).href;
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: canonical } },
          { tag: 'meta', attrs: { property: 'og:url', content: canonical } },
          { tag: 'meta', attrs: { property: 'og:image', content: image } },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: config.site.socialImage.alt } },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
          { tag: 'meta', attrs: { name: 'twitter:image', content: image } }
        );
      }
      return { html: html.replace('<html lang="en">', `<html lang="${escapeHtml(config.site.language)}">`).replace('<!-- portfolio:noscript -->', createNoScript(config)), tags };
    }
  };
}
