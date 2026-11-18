/** Dependency-light model regression suite. Runs with Node + TypeScript only. */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = mkdtempSync(path.join(tmpdir(), 'portfolio-core-'));
const require = createRequire(import.meta.url);
let checks = 0;
const check = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`); };
try {
  const files = ['config/portfolio.config.ts', 'models/portfolio.repository.ts', 'models/portfolio.selectors.ts', 'models/portfolio.validation.ts', 'models/pwa.selectors.ts'];
  const program = ts.createProgram(files.map((file) => path.join(root, 'src', file)), {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], types: [],
    rootDir: path.join(root, 'src'), outDir: out, strict: true,
    skipLibCheck: true, noEmitOnError: true
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  program.emit(); writeFileSync(path.join(out, 'package.json'), '{"type":"commonjs"}');
  const { getPortfolio } = require(path.join(out, 'models/portfolio.repository.js'));
  const selectors = require(path.join(out, 'models/portfolio.selectors.js'));
  const { validatePortfolio } = require(path.join(out, 'models/portfolio.validation.js'));
  const { chooseNotice } = require(path.join(out, 'models/pwa.selectors.js'));
  const dates = require(path.join(out, 'utils/dates.js'));
  const urls = require(path.join(out, 'utils/urls.js'));
  const text = require(path.join(out, 'utils/text.js'));
  const config = getPortfolio();
  check('complete content validates', () => validatePortfolio(config));
  check('seven supplied career engagements', () => assert.equal(config.experience.length, 7));
  check('exactly two featured projects', () => assert.equal(selectors.getFeaturedProjects(config).length, 2));
  check('current role resolves to EDHEC', () => assert.equal(selectors.getCurrentExperience(config).id, 'edhec'));
  check('eleven complete years as of editorial date', () => assert.equal(dates.completeCareerYears('2015-06', '2026-11-06'), 11));
  check('anniversary has not passed', () => assert.equal(dates.completeCareerYears('2015-06', '2026-05-31'), 10));
  check('anniversary month has passed', () => assert.equal(dates.completeCareerYears('2015-06', '2026-06-01'), 11));
  check('future career start fails', () => assert.throws(() => dates.completeCareerYears('2027-01', config.contentAsOf)));
  check('invalid month fails', () => assert.throws(() => dates.parseYearMonth('2026-13')));
  check('un-padded month fails', () => assert.throws(() => dates.parseYearMonth('2026-1')));
  check('month constructed in UTC', () => assert.equal(dates.parseYearMonth('2015-06').toISOString(), '2015-06-01T00:00:00.000Z'));
  check('invalid calendar date fails', () => assert.throws(() => dates.parseDateOnly('2026-02-30')));
  check('real leap day is valid', () => assert.equal(dates.parseDateOnly('2024-02-29').getUTCDate(), 29));
  check('period uses source dates and Present', () => assert.equal(dates.formatPeriod('2026-04', null, 'Present'), 'Apr 2026 to Present'));
  check('sort does not mutate input', () => { const items = [...config.experience].reverse(); const original = items.map((item) => item.id); assert.equal(selectors.sortExperience(items)[0].id, 'edhec'); assert.deepEqual(items.map((item) => item.id), original); });
  check('All filter returns all roles', () => assert.equal(selectors.filterExperience(config.experience, 'all').length, 7));
  check('stable ID filter selects one role', () => assert.equal(selectors.filterExperience(config.experience, 'sipa')[0].id, 'sipa'));
  check('unknown filter gives an empty result', () => assert.deepEqual(selectors.filterExperience(config.experience, 'missing'), []));
  check('count uses singular grammar', () => assert.equal(selectors.roleCount(1, config.ui), '1 role shown'));
  check('count uses plural grammar', () => assert.equal(selectors.roleCount(7, config.ui), '7 roles shown'));
  check('contract qualifier is visible-ready', () => assert.equal(selectors.experienceDisplay(config.experience[2], config).qualifier, 'Contract through Virtusa'));
  check('ordinary employment has no qualifier', () => assert.equal(selectors.experienceDisplay(config.experience[0], config).qualifier, null));
  check('hero facts are derived', () => assert.equal(selectors.getHeroFacts(config)[0].value, '11+'));
  check('SEC pipeline has no inferred stack', () => assert.equal(config.projects[1].technologies.length, 0));
  check('no project demo links fabricated', () => assert(config.projects.every((item) => item.links.length === 0)));
  check('no public phone field', () => assert(!('phone' in config.profile)));
  check('root asset URL', () => assert.equal(urls.assetUrl('icons/icon-192.png', '/'), '/icons/icon-192.png'));
  check('subdirectory asset URL', () => assert.equal(urls.assetUrl('icons/icon-192.png', '/portfolio/'), '/portfolio/icons/icon-192.png'));
  check('invalid base rejected', () => assert.throws(() => urls.normaliseBase('/portfolio')));
  check('traversal path rejected', () => assert.throws(() => urls.assetUrl('../private.txt', '/')));
  check('root-relative asset rejected', () => assert.throws(() => urls.assetUrl('/icons/a.png', '/portfolio/')));
  check('HTTPS profile link accepted', () => assert(urls.isHttpsUrl(config.profile.socialLinks[0].href)));
  check('javascript URL rejected', () => assert(!urls.isHttpsUrl('javascript:alert(1)')));
  check('credential-bearing URL rejected', () => assert(!urls.isHttpsUrl('https://person:secret@example.org')));
  check('unknown canonical origin omitted', () => assert.equal(urls.canonicalUrl(null, '/'), null));
  check('valid canonical applies base', () => assert.equal(urls.canonicalUrl('https://portfolio.test', '/portfolio/'), 'https://portfolio.test/portfolio/'));
  check('canonical rejects path', () => assert.throws(() => urls.canonicalUrl('https://portfolio.test/bad', '/')));
  check('HTML text escaping', () => assert.equal(text.escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;'));
  check('named substitutions only', () => assert.equal(text.interpolate('{count} / {missing}', { count: 7 }), '7 / {missing}'));
  check('duplicate IDs rejected', () => { const next = structuredClone(config); next.experience.push(next.experience[0]); assert.throws(() => validatePortfolio(next), /duplicate ID/); });
  check('invalid current role rejected', () => { const next = structuredClone(config); next.profile.currentExperienceId = 'missing'; assert.throws(() => validatePortfolio(next), /currentExperienceId/); });
  check('invalid project relationship rejected', () => { const next = structuredClone(config); next.projects[0].experienceId = 'missing'; assert.throws(() => validatePortfolio(next), /experienceId/); });
  check('invalid contract employer rejected', () => { const next = structuredClone(config); next.experience[2].contractingCompany = ''; assert.throws(() => validatePortfolio(next), /contracting company/); });
  check('reversed career dates rejected', () => { const next = structuredClone(config); next.experience[1].endDate = '2020-01'; assert.throws(() => validatePortfolio(next), /start after end/); });
  check('unapproved hero accent rejected', () => { const next = structuredClone(config); next.hero.headingAccent = 'Other'; assert.throws(() => validatePortfolio(next), /headingAccent/); });
  const state = { update: false, offline: false, ready: false, busy: false, error: false, cached: true };
  check('no notice is the idle state', () => assert.equal(chooseNotice(state, config.ui), null));
  check('update has highest priority', () => assert.equal(chooseNotice({ ...state, update: true, offline: true, ready: true }, config.ui).kind, 'update'));
  check('offline has priority over saved notice', () => assert.equal(chooseNotice({ ...state, offline: true, ready: true }, config.ui).kind, 'offline'));
  check('ready is a separate notice', () => assert.equal(chooseNotice({ ...state, ready: true }, config.ui).kind, 'ready'));
  check('uncached offline message is honest', () => assert.equal(chooseNotice({ ...state, offline: true, cached: false }, config.ui).message, config.ui.offlineUncached));
  check('update failure is recoverable copy', () => assert.equal(chooseNotice({ ...state, update: true, error: true }, config.ui).message, config.ui.updateFailed));
  console.log(`\n${checks} core checks passed. This does not test the Vite build or generated service worker.`);
} finally { rmSync(out, { recursive: true, force: true }); }
