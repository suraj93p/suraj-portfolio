# Architecture

## MVC-inspired separation

| Layer | Files | Responsibility |
| --- | --- | --- |
| Model | `src/config`, `src/models`, `src/utils` | Typed immutable content, validation, sorting, projections, dates and safe URLs |
| Controller | `src/controllers` | React hooks for navigation, filters, clipboard feedback, print, PWA state and notice placement |
| View | `src/views` | Semantic TSX and SCSS Modules, receiving content and callbacks through props |
| Browser adapters | `src/services` | Clipboard, connectivity, optional session storage and native service-worker registration |
| Composition | `src/app/App.tsx` | Connect the controller outputs to section/layout components |
| Build tools | `build`, `scripts` | HTML metadata, no-JavaScript profile, manifest, image assets and build inspection |

Data flows from the config through the repository and selectors to controllers and views. User actions travel back through callbacks. Views do not import the raw configuration. No global state library, router, backend, API client or CSS-in-JS is needed.

## Content and dates

`portfolio.config.ts` uses `as const satisfies PortfolioConfig`. Runtime model validation complements compile-time types. Month-only dates use UTC. Career duration is calculated against the explicit editorial `contentAsOf` date, not silently treated as reverified every year. The current company is resolved through `currentExperienceId`. Contract roles retain the contracting organisation.

All career articles stay mounted so printing can include every role after a screen filter. CSS hides the non-selected entries on screen. `beforeprint` opens details disclosures; `afterprint` restores them. Print CSS restores the full career independently of the filter state.

## Navigation and accessibility

Section links are native hash links. The mobile menu is a non-modal disclosure with ordinary document-order focus, Escape and outside-click handling. Keyboard section navigation transfers focus after the browser's default anchor action. Active-section observation does not continually alter browser history.

A skip link, one h1, labelled landmarks, pressed filter buttons, polite result messages, native details elements and visible focus rings are included. The app respects reduced motion. Floating PWA notices move between top and bottom placement when they would overlap keyboard focus. These are implementation features, not a formal WCAG compliance certification.

## PWA lifecycle

`vite-plugin-pwa` generates the revisioned Workbox worker and manifest. The application uses a small native registration adapter instead of an injected registration script or a second React PWA helper. `injectRegister: null` prevents duplicate registration. `registerType: 'prompt'` and `skipWaiting: false` keep updates user-controlled.

The adapter shares registration across React Strict Mode subscriptions, while each subscriber cleans up its native listeners. A waiting worker is activated only after explicit acceptance using Workbox's `SKIP_WAITING` message. If another tab activates the worker, the older tab offers its own refresh action rather than silently reloading. Registration failure leaves the ordinary site operational.

The first successful cache installation is distinct from mere browser support. Install-prompt availability, apparent connectivity, offline readiness and update readiness are different states. Only one notice is shown at a time. `navigator.onLine` is not treated as a definitive Internet reachability test.

The worker precaches core local assets and bundled public content. It does not cache external profile destinations, private APIs, raw resume files or documentation. Navigation fallback is restricted to the portfolio root and its index.html equivalent. There is no generic routing layer.

## Dependency choices

Runtime UI dependencies are React and ReactDOM. Vite, TypeScript, Sass, ESLint, Vitest, Testing Library, Playwright, the PWA build plugin and Sharp are development tools. The generated worker still has runtime byte cost. Sharp regenerates original monogram install icons and a social card; no font files or external images are bundled.

The selected Vite 7.3 line is a supported maintenance line rather than an automatic migration to Vite 8. Exact direct dependencies are pinned. A real first installation produces a lockfile for transitive reproducibility. Do not pretend a hand-written dependency list is a generated package lock.
