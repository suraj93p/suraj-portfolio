# Testing and release procedure

## Automated commands

After `npm install`, run:

```bash
npm run test:core
npm run test:pwa-adapter
npm run test:e2e:install
npm run check
```

The two dependency-light suites use Node and TypeScript only. Their browser fakes do not establish real caching or installability. Vitest covers model invariants, dates/URLs, views, controllers, adapters and exceptional states. Coverage targets are 80% statements/lines/functions and 75% branches; the actual coverage result is not known until that suite runs. Do not suppress modules simply to meet a percentage.

Playwright runs against the production output, not the development server. It covers content, viewport overflow, filters, keyboard navigation, details, clipboard failure, reduced motion, printing, no-JavaScript content, manifest/icon URLs, missing assets and an actual offline reload after service-worker control.

The included browser project is Chromium. Firefox, Safari/WebKit, iOS installation, Android installation, real assistive technologies and real-host response headers require additional release checks. The included GitHub workflow installs Chromium and runs the check command on a clean checkout. After committing a real package lock, CI uses `npm ci`.

## Real-device installation check

Build and serve with `npm run serve`, or share that build with `npm run share`. Open the production URL online, let the worker install, then use the browser's installation interface where supported. Confirm name, icon, start URL and standalone appearance. Do not treat a mocked `beforeinstallprompt` event as a genuine installation test.

After a successful first visit, disable the network and reload. The core content, filters and details should still work. External profiles and mail delivery remain external. A never-visited origin and an evicted cache have different limitations.

## Repeatable two-build update check

Use the same origin and browser storage for both versions. A different tunnel URL is a different origin and is not an update test.

1. Run `npm run serve`, open http://localhost:4173, wait for worker control, and keep two tabs open.
2. In DevTools, confirm an active worker controlling both tabs. Avoid DevTools options that bypass the worker or force updates on reload, because those override the intended lifecycle.
3. Change one visible phrase in `src/config/portfolio.config.ts`, for example the About introduction, without changing the origin or app base.
4. In a second terminal run `npm run build`. The preview server serves the new `dist` files without changing the URL. Keep the first tab open on the old version.
5. Trigger a worker update from the browser's Application/Service Workers panel, or run `navigator.serviceWorker.getRegistration().then(r => r?.update())` in the console. The app also checks on returning to a visible tab after at least a minute.
6. Confirm an update notice appears. Choose Later. The page should remain usable with the older content; the footer should retain Update now.
7. Accept Update now. Confirm the accepting tab reloads once and displays the changed phrase. It must not mix an independently cached old config with the new bundle.
8. In the second tab, confirm that it has not unexpectedly reloaded or entered a reload loop. It should offer its own update action. Accept it and confirm the new phrase.
9. Repeat with a temporarily unavailable connection. A failed activation must preserve browsing and show recoverable feedback. Restore the connection and retry.
10. After acceptance, disable the network and reload to confirm the new version is available offline.

Restore the real editorial phrase after testing and make one final build. Document the actual outcomes. A passing first-install offline check does not cover the two-build lifecycle.

## Subdirectory deployment check

Change only `site.basePath` to `/portfolio/`, rebuild, and start preview. Open http://localhost:4173/portfolio/ and run the browser tests. Check manifest start URL/scope, icons, worker scope and offline reload. Then test your actual hosting configuration, because a local preview cannot establish the host's rewrite and MIME rules.

## Visual and accessibility checks

Review full pages at 320, 390, 768, 1024, 1440 and 1920px. Try 200% text size and browser zoom. Confirm content does not overflow or hide controls, including when projects and tools are expanded. Navigate using only the keyboard. Check the skip link, focus indicators, disclosure Escape behavior, current-section state, filter focus, copy feedback and install/update controls.

Print with a single company selected and confirm that all seven roles and expanded project details appear, then that the screen filter and disclosure states are restored. Validate colour contrast and screen-reader behavior on representative platforms. Source lint rules alone do not establish accessibility compliance.

## Performance and real hosting

Measure the production site on a stated device/network profile. Target initial application JavaScript below 180KB gzip and CSS below 30KB gzip where feasible. No bundle-size or Lighthouse score is claimed for the delivered source package because the production build could not run in the preparation environment.

On actual hosting, inspect HTTPS, JavaScript and web-manifest MIME types, HTML/manifest/worker revalidation, immutable headers only for hashed assets, CSP behavior and absence of third-party runtime requests. A Cloudflare Quick Tunnel is not the final production deployment.

## Recovery

A normal update should not require visitors to clear caches. To recover a bad release, fix the source or restore a known-good commit, create a new build and deploy it as a new version. Test its worker update lifecycle at the same origin. An emergency worker/cache reset in browser DevTools affects that browser only; never add application code that indiscriminately deletes every cache on the origin.
