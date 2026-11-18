import { describe, expect, it } from 'vitest';
import { completeCareerYears, formatMonth, formatPeriod, parseDateOnly, parseYearMonth } from './dates';
import { assetUrl, canonicalUrl, isHttpsUrl, normaliseBase } from './urls';
import { escapeHtml, interpolate } from './text';

describe('dates', () => {
  it('constructs source months in UTC', () => expect(parseYearMonth('2015-06').toISOString()).toBe('2015-06-01T00:00:00.000Z'));
  it.each(['2026-13', '2026-00', '2026-1', '1800-01', '2300-01'])('rejects invalid month %s', (value) => expect(() => parseYearMonth(value)).toThrow());
  it.each(['2026-02-30', '2026-02-29', 'invalid', '2026-1-2'])('rejects invalid date %s', (value) => expect(() => parseDateOnly(value)).toThrow());
  it('accepts a real leap day', () => expect(parseDateOnly('2024-02-29').getUTCDate()).toBe(29));
  it('formats dates and periods', () => {
    expect(formatMonth('2026-04')).toBe('Apr 2026'); expect(formatPeriod('2026-04', null, 'Present')).toBe('Apr 2026 to Present');
    expect(formatPeriod('2015-06', '2015-12', 'Present')).toBe('Jun 2015 to Dec 2015');
  });
  it('uses complete years rather than rounding up', () => {
    expect(completeCareerYears('2015-06', '2026-05-31')).toBe(10); expect(completeCareerYears('2015-06', '2026-06-01')).toBe(11);
    expect(() => completeCareerYears('2027-01', '2026-11-06')).toThrow();
  });
});
describe('safe URLs and text', () => {
  it('supports root and subdirectory deployments', () => {
    expect(normaliseBase('/')).toBe('/'); expect(normaliseBase('/portfolio/')).toBe('/portfolio/');
    expect(assetUrl('icons/icon-192.png', '/portfolio/')).toBe('/portfolio/icons/icon-192.png');
    expect(() => normaliseBase('portfolio')).toThrow();
  });
  it.each(['../secret', '/absolute.png', 'https://bad.test', 'file?query', 'a#hash', 'a\\b', ''])('rejects asset %s', (path) => expect(() => assetUrl(path, '/')).toThrow());
  it('accepts HTTPS profiles, not executable or credential-bearing URLs', () => {
    expect(isHttpsUrl('https://github.com/suraj93p')).toBe(true);
    for (const url of ['javascript:alert(1)', 'http://example.test', 'https://a:b@example.test', 'not-a-url']) expect(isHttpsUrl(url)).toBe(false);
  });
  it('omits unknown canonical domains and validates configured ones', () => {
    expect(canonicalUrl(null, '/')).toBeNull(); expect(canonicalUrl('https://portfolio.test', '/portfolio/')).toBe('https://portfolio.test/portfolio/');
    expect(() => canonicalUrl('https://portfolio.test/wrong', '/')).toThrow(); expect(() => canonicalUrl('http://portfolio.test', '/')).toThrow();
  });
  it('escapes HTML and interpolates only explicit own-property values', () => {
    expect(escapeHtml('<script>"&\'')).toBe('&lt;script&gt;&quot;&amp;&#39;');
    expect(interpolate('{count} roles {unknown}', { count: 7 })).toBe('7 roles {unknown}');
    expect(interpolate('{toString}', {})).toBe('{toString}');
  });
});
