# Design instructions: Suraj Pasayat's engineering portfolio

Version: 1.0 | Prepared: 6 November 2026 | Target: a responsive, installable portfolio website

## D01. What comes from the reference, and what does not

Reference: https://ashishbusinesshead.netlify.app/ [R01]

**Observed from the accessible page:** a single-page professional portfolio with section navigation, a skip link, a prominent introduction, two contact/work actions, compact career facts, experience entries with company-filter controls, grouped outcome summaries, expertise, education and contact details. A mobile-menu control and copy-email button are present in the accessible markup. Their live behaviour was not tested.

**Not verified:** actual colours, font family, dimensions, CSS breakpoints, shadows, animations, rendered desktop/mobile layouts, or implementation code. Direct source retrieval was unavailable. This document is an exhaustive **derived design system**, not a pixel-measured extraction or a claim of visual identity with the reference.

Everything below is a proposed implementation instruction for Suraj. Preserve the reference's information hierarchy and professional tone, not Ashish's biography, copy, metrics, contact information or brand assets. No reference screenshots are required to implement these instructions.

## D02. Design direction

Create a restrained, editorial engineering portfolio. Its visual hierarchy should feel experienced and confident, not like a beginner's collection of technology logos. Use generous spacing, strong typography, compact supporting facts, a clear career sequence and two substantive project cards.

The key message is: frontend depth, broader full-stack ownership, and an ability to make business and research workflows usable. The primary audience is hiring teams; the secondary audience is professional collaborators. Neither audience should have to install the PWA to use the website.

Use a light neutral canvas, near-black text, a deep teal accent and white surfaces. Emphasise content with spacing and weight before adding decoration. A small dot after the SURAJ wordmark is sufficient branding. Do not add gradients, glass panels, neon code effects, animated backgrounds, terminal simulations, stock photography, decorative 3D elements or skill-percentage charts.

## D03. Page map and order

| Order | Semantic region | ID | Purpose |
| --- | --- | --- | --- |
| 0 | Skip link and header | top | Identity, navigation, contact action |
| 1 | Hero, inside main | hero | Who Suraj is, what he builds, where to go next |
| 2 | About section | about | Engineering focus and working principles |
| 3 | Experience section | experience | Seven chronological engagements, newest first |
| 4 | Selected projects section | projects | Excel add-in and SEC filing data pipeline |
| 5 | Expertise section | expertise | Grouped, readable technical capabilities |
| 6 | Education section | education | NIT Raipur, BTech CSE |
| 7 | Personal section | beyond | Running, fiction and mentorship |
| 8 | Contact section | contact | Email, LinkedIn and GitHub |
| 9 | Footer | footer | Location, copyright, print and optional installation action |

There is no standalone quantitative achievements section in the initial version. Do not replace missing performance figures with invented statistics. Years of experience may be derived from the supplied career dates.

The header links to About, Experience, Projects, Expertise and Contact. Education and personal interests remain easy to find by scrolling without overcrowding navigation. All content remains on one route; use native section anchors, not a router.

## D04. Design tokens

Use these as the default source of truth in SCSS. These values are derived design decisions, not values extracted from the reference.

```scss
:root {
  color-scheme: light;
  --color-canvas: #f7f8f5;
  --color-surface: #ffffff;
  --color-surface-muted: #edf2ee;
  --color-text: #18231f;
  --color-text-secondary: #4b5b52;
  --color-text-muted: #5d6d64;
  --color-accent: #0f5f58;
  --color-accent-hover: #0b4b45;
  --color-accent-soft: #e5f1ed;
  --color-border: #d9e0da;
  --color-control-border: #77867d;
  --color-inverse: #ffffff;
  --color-focus: #176bc0;
  --color-error: #a32424;

  --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Consolas, monospace;
  --font-xs: 0.8125rem;
  --font-sm: 0.875rem;
  --font-base: 1rem;
  --font-lead: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  --font-h3: clamp(1.25rem, 1.05rem + 0.65vw, 1.625rem);
  --font-h2: clamp(1.875rem, 1.3rem + 2.1vw, 3rem);
  --font-hero: clamp(2.375rem, 1.4rem + 3.2vw, 4.5rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.5rem;
  --radius-pill: 999px;
  --shadow-card: 0 4px 20px rgb(24 35 31 / 4%);
  --shadow-raised: 0 10px 30px rgb(24 35 31 / 9%);

  --container: 74rem;
  --page-gutter: clamp(1.25rem, 4vw, 3rem);
  --section-space: clamp(3.5rem, 7vw, 6rem);
  --header-height: 4.5rem;
  --duration-fast: 140ms;
  --duration-normal: 200ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --z-header: 20;
  --z-menu: 30;
  --z-notice: 40;
  --z-skip: 100;
}
```

Use the light border for non-interactive separators. Use the stronger control border or filled accent for interactive boundaries. Verify final foreground/background pairs for accessibility; a token's existence does not make every combination safe.

No downloaded or remotely hosted font is required. Do not request font files from the user. Use the specified system stack, accepting small platform-specific glyph differences. Keep the theme light in version one, including when the device prefers dark mode.

## D05. Layout and responsive behaviour

The main container is `min(calc(100% - 2 * var(--page-gutter)), var(--container))`, centred. Use `min-width: 0` on grid/flex children. Use intrinsic heights, not fixed card heights or viewport-height sections.

| Width | Layout instructions |
| --- | --- |
| 320-639px | One-column sections; mobile navigation; stacked project cards; small gaps; two hero fact columns only when they fit |
| 640-959px | Two-column project/principle grids where readable; mobile navigation remains; hero may stay stacked |
| 960-1279px | Desktop navigation; two-column hero; date-and-content timeline; two featured project columns |
| 1280px and above | Same structure with capped container; do not stretch paragraphs across the full display |

SCSS breakpoint constants are 40rem, 60rem and 80rem. Use content-driven adjustment only when required to prevent collisions. At widths below 60rem, set `--header-height: 4rem`.

Paragraphs normally stay within 60-68 characters per line. Hero copy can use 54-60 characters. Keep one spacing rhythm between eyebrow, title, description and section content. Do not centre all sections: most text is left-aligned, including on mobile.

There must be no horizontal page scrolling at 320px, 200% text size or equivalent zoom. Long email addresses and URLs must wrap gracefully using `overflow-wrap: anywhere` in their containers, not by breaking every word across the whole page.

## D06. Header and navigation

Use a sticky full-width header with a solid or nearly opaque canvas background and a subtle bottom border. Blur is optional and must have a solid fallback. Its inner container aligns with the page grid. It must not visibly cover content or keyboard focus.

Desktop composition is wordmark on the left, five navigation links toward the right, and a compact contact CTA. The wordmark links to `#top`. Avoid an extra row of social icons in the header.

Normal navigation text is secondary ink. Hover uses the accent. The active section uses an underline plus colour, with `aria-current="location"` on exactly one link. Underline placement must not change row height. Scroll observation must not constantly push browser-history entries.

Mobile uses the wordmark and a labelled menu button. The menu is a **non-modal disclosure**, positioned below the header, with a white background, border and generous link targets. Use `aria-expanded` and `aria-controls`, not ARIA menu/menuitem roles. Keep focus in ordinary document order. Close on Escape, outside click or a selected navigation link. Restore focus to the toggle on Escape. Do not trap focus, apply `inert` to the page or lock body scrolling for this non-modal design.

After choosing a section, close the disclosure, bring the target heading into view and place focus there when navigation came from keyboard activation. Allow native hash navigation to work. The target can have `tabindex="-1"`; the focus style must remain visible where appropriate.

The skip link is the first focusable element. It becomes fully visible on keyboard focus and targets `main#main-content`. Respect reduced motion for scrolling.

## D07. Hero

Use a spacious opening rather than a full-height splash screen. At desktop sizes, use approximately a 1.45:1 split between the main text and a supporting facts panel, with a 3-4rem gap. Both columns align near the top; the panel can sit slightly lower than the eyebrow, but not via absolute positioning.

Content sequence is identity/location eyebrow, one h1, a concise introduction and two actions. Use the exact copy from the content model. Suggested desktop heading width is 11-14ch so it breaks into two or three purposeful lines. Do not add hard-coded `<br>` tags that break mobile layouts. Allow the layout to wrap naturally.

The primary action is filled teal. The secondary action is outlined or underlined, never equally visually dominant. Each is at least 44px tall. On narrow screens, wrap or stack actions without stretching unnecessarily at tablet widths.

The supporting panel contains four facts in a two-by-two grid: years of experience, current organisation, location and core focus. Give the number or value more weight than its label. The current employer can wrap; it is not a one-line ticker. On very narrow screens the panel may use a single column.

Do not add a portrait placeholder, fabricated portrait, fake dashboard screenshot, client logos or animated counters. The title and facts provide enough visual interest.

## D08. About and working principles

Place the about text in a generous reading column. At desktop width, the heading can occupy a narrower left column and the body a wider right column. On small screens, stack them in semantic order.

Below the paragraphs, show three concise principle cards. These are statements of engineering approach, not testimonials, certifications or measurable results. Use light surfaces and small labels; avoid turning each into a large promotional tile.

Each card has a short title and one sentence. The underlying text comes from the model. No percentages, proficiency meters or invented managerial claims belong here.

## D09. Experience timeline

Render the seven entries in descending start-date order. Keep month-level source dates intact, including the shared June 2018 transition month between Amadeus and Flipkart. Do not invent exact dates or modify a month to remove an apparent overlap.

At desktop width, use a left date/location rail of about 11rem and a flexible right content column. Use a fine vertical rule and small accent dot as decoration. At mobile width, move dates and location above each role and remove any rail that makes text cramped.

Entry hierarchy is role title, organisation and engagement qualifier, summary, contribution list and a compact technology list. The current role may use a soft background and a small `Present` label, not an availability badge.

The Google entry must visibly say **Contract through Virtusa**, adjacent to the organisation or role. Do not relegate the qualification to hidden details or a tooltip.

Company filters sit below the section introduction. Use native buttons with `aria-pressed`, wrapping rows and at least 44px target height. The selected filter has a filled accent or clear border plus label treatment. These are filters, not tabs: do not use tablist/tab semantics.

Filtering must not move keyboard focus into the results or scroll to the top. A polite live region reports the result count. Include a recovery action for an empty state even though initial filters all have content. Render every career entry when `All` is selected.

Avoid excessive nested boxes. A timeline with separators is preferable to seven heavy shadowed cards. Keep all career summaries available without opening accordions; detailed contribution lists may be condensed only if meaning is preserved.

## D10. Featured projects

Feature exactly two professional projects initially: the Excel add-in and SEC filing pipeline. Use equal-width cards at 640px and above when there is enough room; otherwise stack. Cards align at the top and grow with their content.

Card anatomy is category eyebrow, h3 title, short summary, compact tags and a native `<details>` disclosure. The disclosure contains three labelled text blocks: context, contribution and outcome. Use the model's cautious wording. The SEC project has no confirmed technology stack: display its workflow tags, not invented language/database badges.

Do not make the entire card a button. Do not add dead `View live` or `GitHub` links for employer projects. Omit link rows when `links` is empty and image regions when `image` is null. Empty space is not a reason to create a screenshot or dummy device mockup.

Use a subtle border and shadow. Hover effects are only appropriate on actual controls; avoid lifting a non-clickable card as though it is an interactive button. Open details should not animate their height with brittle measurements.

Simple conceptual diagrams may be added later only as explicitly labelled illustrations, not actual system architecture. They are not required in version one.

## D11. Expertise

Use six thematic groups from the model: frontend engineering, UI systems/styling, full-stack/data, testing/quality, delivery/operations and collaboration. At desktop sizes use a three-column grid; at tablet use two; at mobile use one.

Each group has a title, one-line description and a small set of primary skills. Secondary tools may appear in a native details disclosure labelled from the model. Do not render a huge logo wall or duplicate every skill inside every project.

Tags use a quiet background and readable text. They are not buttons and must not receive tab stops. Do not use colour to imply expertise levels. Do not assign years of experience or percentages per technology.

## D12. Education and personal interests

Education is a compact block, not a full-width academic transcript. Show institution, degree, field and supplied dates. Omit school marks, CPI and invented campus leadership positions in the initial public site.

The personal section has three small cards: running, fiction and mentorship. Use small original line icons or no icons at all. Do not infer race results, mileage, favourite authors, books read, student counts or named mentoring organisations.

The writing should add warmth without becoming a lifestyle biography. Do not include private family, financial, medical or immigration information from other conversations.

## D13. Contact and footer

Use a distinct dark-teal contact block with white text, generous padding and a clear heading. Keep the email readable and selectable, with an email link and a separate copy button. LinkedIn and GitHub are text-labelled links, not unexplained icons.

Copy success is announced politely. When clipboard access fails, preserve the visible address and show a manual-copy message. Do not pretend the operation succeeded. Avoid alert dialogs.

There is no contact form or backend in version one. The email action uses `mailto:`. There is no public phone number. There is no resume download button until an approved, privacy-reviewed file actually exists.

The footer is simple: name, location, calculated current year, back-to-top action and a print action. The install action is secondary and capability-aware. Do not place a large install banner over the hero.

## D14. PWA notices and exceptional states

PWA notices are compact, dismissible and non-modal. Use a bottom-corner stack on desktop, at most 24rem wide. On mobile use the page gutters and safe-area insets. Never cover the focused element, essential contact actions or the entire viewport.

Priority is update available, offline warning, offline-ready confirmation. Show one primary notice at a time; do not stack three banners with competing actions. A true update notice has `Update now` and `Later`. Installing the app and updating its service worker are different actions and must not share misleading labels.

The offline-ready notice appears only after successful service worker installation/precache, not merely because the browser supports service workers. An offline warning describes apparent network state, not a guaranteed connectivity diagnosis. The page remains usable after notices are dismissed.

Unsupported install-prompt APIs must not produce a broken install button. Offer neutral browser-menu help through a secondary disclosure, or omit that control. Use feature detection, not an unconditional Android-style prompt on every device.

## D15. Accessibility, motion and print

Target WCAG 2.2 AA, with actual testing rather than a compliance claim. Use semantic landmarks, one h1, ordered headings, real buttons and real links. Maintain 4.5:1 normal text contrast, 3:1 large text and relevant UI contrast. Use a minimum 44px target as this project's usability standard, not a claim that every WCAG AA target rule requires 44px. [T09]

Use a 3px focus-visible outline with a 3px offset. On dark surfaces use a contrasting light ring or equivalent two-tone treatment. Hover states must have keyboard equivalents. Never remove outlines without replacing them.

Content is visible by default. Optional opacity/translate transitions are limited to small, nonessential enhancements, around 140-200ms. No scroll hijacking, parallax, typewriter effects, autoplay, infinite motion or required entrance animation. `prefers-reduced-motion: reduce` disables decorative movement and smooth scrolling.

Print styles remove navigation, filters, install/update notices and decorative shadows. Print all experience entries regardless of the active on-screen filter, expand project details and use dark text on white. Do not attempt to force the entire career onto one page. Prevent headings from becoming orphaned where possible and allow long content to break naturally.

## D16. Component visual contracts

| Component | Required treatment | Prohibited shortcut |
| --- | --- | --- |
| SectionHeader | Eyebrow, h2, optional description, consistent spacing | Hard-coded titles inside every section view |
| Button / LinkButton | Variants, focus, disabled/loading where relevant | Button-looking divs or nested interactive elements |
| ExperienceFilter | Wrapping, pressed state, accessible group label | Tabs without tab keyboard behaviour |
| ExperienceItem | Dates, qualifier, role, summary, contributions | Hiding contractor status |
| ProjectCard | Text-first, details, optional links only when real | Placeholder screenshots and dead links |
| SkillGroup | Grouped skills, noninteractive tags | Arbitrary proficiency bars |
| Notice | Live-region announcement, dismissal, stable layout | Browser alerts or blocking splash screens |
| ContactLink | Descriptive name, wrapping, meaningful destination | Icons without accessible text |

## D17. Visual acceptance checklist

Review rendered pages at 320, 390, 768, 1024 and 1440px, plus a large desktop. Inspect the full page, not only the hero. Test long company names and content-expanded cards.

The result passes design review only when navigation does not collide; the hero reads well without a photograph; every timeline entry is legible; filters and project details work with keyboard; contact actions remain reachable; notices do not obscure controls; there is no unwanted horizontal scroll; and the print view includes the complete career.

These are proposed quality gates. Do not claim the original reference passes them or that the future implementation has passed them before testing.


## Implementation note

This is the agreed derived visual brief, not a pixel-extracted stylesheet. The implementation preserves its structure and tokens. Technical delivery status is recorded separately in `validation-report.md`; desired acceptance criteria in this brief are not claims that all production checks have run. The original reference and private source evidence are not bundled.
