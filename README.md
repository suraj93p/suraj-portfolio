# Suraj Pasayat | Portfolio

An editorial, responsive portfolio built with React, TypeScript, Vite and SCSS Modules. Includes the supplied career history, two professional projects, expertise, education, personal interests, contact links and production PWA support.

## 1. Open it locally

Install Node.js **22.16.0 or later** and npm. Open a terminal inside the extracted `suraj-portfolio` directory:

```bash
npm install
npm run dev
```

Vite opens the browser at **http://localhost:5173**. The server also accepts http://127.0.0.1:5173. Stop it with **Ctrl+C**. `npm start` is an alias for the same development workflow. Running just `npm run` lists the available commands.

There are no API keys, databases, accounts, environment variables or separate backend services to configure.

A real `package-lock.json` is created by your first successful `npm install`. Commit that file; use `npm ci` for subsequent reproducible installs. This ZIP intentionally does not include a fabricated lockfile or `node_modules`.

## 2. Share a temporary public URL with Cloudflare

Install the official **cloudflared** CLI once. It is an external system tool, not an npm dependency. On macOS with Homebrew:

```bash
brew install cloudflared
cloudflared --version
```

For Windows or Linux, follow [Cloudflare's installation instructions](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/).

### Share the running development server

Keep `npm run dev` running. In a second terminal in the same project:

```bash
npm run tunnel
```

Cloudflared prints a temporary `https://...trycloudflare.com` address. The command forwards to port 5173 and overrides the origin Host header to `localhost:5173`, so Vite does not need an unsafe `allowedHosts: true` setting. Development source is exposed through a development tunnel; use the production workflow below for broader sharing.

### Share the production portfolio, including its PWA

Stop any server already using port 4173, then run:

```bash
npm run share
```

This checks that cloudflared is installed, builds the app, starts a production preview on port 4173, and opens a Cloudflare Quick Tunnel. Ctrl+C stops both processes. Alternatively, run `npm run serve` in one terminal and `npm run tunnel:preview` in another.

The generated address is **public and temporary**, with no application authentication. Quick Tunnels are for testing and sharing, not permanent hosting. Do not publish secrets or confidential employer material. If cloudflared finds an existing configuration that prevents a Quick Tunnel, consult its terminal message and the official [Quick Tunnel documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/). Do not delete unrelated tunnel configuration blindly.

## 3. Run the actual PWA locally

Service workers are intentionally disabled during ordinary Vite development so stale caches do not interfere with editing.

```bash
npm run serve
```

Open **http://localhost:4173**. Wait for the offline-ready notice after the first successful load. Once installed and controlling the page, the service worker can serve the core portfolio offline. Installation UI depends on the browser. A custom install action appears only when the browser supplies a usable install prompt; otherwise the footer provides browser-menu guidance.

The first visit needs a connection. Browser storage can be evicted. LinkedIn, GitHub and email delivery are not made available offline by this website. The production site needs HTTPS; localhost is suitable for local service-worker testing.

Updates are not forced on the visitor. A waiting update offers **Update now** and **Later**. Deferred updates remain accessible in the footer. The content is imported into the versioned bundle, not fetched from a separately cached `config.js`.

## 4. Edit your content

The single editable content source is:

```text
src/config/portfolio.config.ts
```

It contains biography, all seven career entries, project copy, skills, education, interests, contact links, UI messages, SEO metadata, feature flags and manifest settings. No content is scraped at runtime.

Edit the colours and spacing in `src/styles/_tokens.scss`. Each section/component has a separate `.module.scss` file. The site uses system fonts, not remote fonts.

The original resume, phone numbers, unverified numerical achievements and private infrastructure details are not shipped. There is no fake resume download, contact form, project demo link, portrait or testimonial.

See [content maintenance](docs/content-maintenance.md) and [architecture](docs/architecture.md).

## 5. Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Open the local development site on port 5173 |
| `npm start` | Alias for development |
| `npm run assets` | Regenerate the favicon, install icons, social card and robots file |
| `npm run typecheck` | Strict TypeScript application, build and test checks |
| `npm run lint` | ESLint, React Hooks and accessibility rules |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Run unit/component tests once |
| `npm run test:coverage` | Unit/component tests with coverage thresholds |
| `npm run test:core` | 51 dependency-light model/data regression checks |
| `npm run test:pwa-adapter` | 24 native registration-adapter checks with browser fakes |
| `npm run build` | Generate assets, type-check, build and inspect `dist` |
| `npm run preview` | Serve an existing production build on port 4173 |
| `npm run serve` | Build and serve the production site |
| `npm run test:e2e:install` | Install Playwright Chromium for browser tests |
| `npm run test:e2e` | Production-browser interaction and offline tests |
| `npm run check` | Lint, coverage, production build and browser tests |
| `npm run tunnel` | Cloudflared tunnel to a running development server |
| `npm run tunnel:preview` | Cloudflared tunnel to a running production preview |
| `npm run cloudflared` | Alias for `npm run tunnel` |
| `npm run share` | Build, preview and run a production Quick Tunnel together |

Before the first full browser test run:

```bash
npm run test:e2e:install
npm run check
```

`npm run test:e2e` expects a built `dist` directory. The Playwright configuration starts the preview automatically, unless one is already running.

## 6. Deployment

For Netlify, publish the `dist` folder and use `npm run build`; the included `netlify.toml` supplies those settings and production headers. For another static host, serve `dist` over HTTPS with correct JavaScript, PNG and web-manifest MIME types. No backend is needed.

Set `site.canonicalOrigin` in the content config only after choosing your actual domain. Until then, the build omits an invented canonical URL and sitemap URL. A real configured domain generates canonical/social URLs and `sitemap.xml`.

For a subdirectory such as `/portfolio/`, change `site.basePath` in that same config and rebuild. Vite paths, icons, metadata, manifest and service-worker scope derive from it. Configure the actual host to serve files under that prefix and adapt its headers accordingly. Do not add a catch-all rewrite that returns HTML for missing JavaScript.

See [testing and release checks](docs/testing.md) for the offline and two-build update procedure.

## 7. What was verified for this ZIP

The available environment could not reach the npm registry. A normal dependency installation, the actual Vite production build, ESLint, Vitest coverage and real browser PWA installation/offline caching could **not** be run here.

The following checks **were** executed: 51 core model/data checks, 24 native PWA adapter checks using browser fakes, asset generation, strict checking of the non-React model/service modules, syntax checks, and 32 browser-rendered source interaction/layout checks. The browser harness used a locally available React 19.1.1 runtime, rather than this project's pinned React 19.2.8 dependency installation. It is not shipped as a substitute production build.

The complete source, tests and assets are included. [The validation report](docs/validation-report.md) separates executed checks from remaining release checks. A passing source harness is not proof of a successful npm/Vite build or real-device installability.
