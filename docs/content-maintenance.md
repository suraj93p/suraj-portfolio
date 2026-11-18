# Content maintenance

## One source of truth

Edit `src/config/portfolio.config.ts`. Do not maintain another JSON copy or hard-code biography text in components. The build consumes the same config for metadata, manifest, image assets and the no-JavaScript profile.

The `sourceIds` values are internal provenance identifiers carried over from the agreed content specification. They are not hyperlinks or public claims of external verification. The underlying resume and conversation evidence are not included in the site.

## Career updates

Add a unique, readable ID to each experience item. Use real `YYYY-MM` months, `null` for a current role's end date, and a nonempty contracting company for contract engagements. Preserve the Google/Virtusa qualification. Update `profile.currentExperienceId` and the editorial `contentAsOf` date when actually reviewing the content.

Do not manufacture percentages, client counts, user counts or leadership responsibilities. Current copy deliberately omits unverified resume metrics. The June 2018 transition between Amadeus and Flipkart retains the supplied month-level dates.

## Projects

The initial public portfolio includes exactly two supplied projects. The Excel add-in has the confirmed React, Fluent UI and Excel JS API stack. The SEC pipeline uses workflow labels because its exact implementation stack was not confirmed. Its employer relationship remains null rather than being inferred.

A project needs a title, category, summary, context, contribution, outcome and unique ID. Set `featured` and `visible` deliberately. Empty link arrays render no fake buttons. Only add real approved public destinations. Employer code and screenshots require appropriate permission.

Portraits, screenshot rendering and resume downloads are intentionally not implemented in this first version. Their config slots remain null and their feature flags false as extension points. Turning on an unimplemented extension flag is not sufficient to add a feature. There is no need to supply those assets to run the site.

## Headings, labels and layout

All display copy, including notices and accessible labels, lives in the config. If changing the hero heading, keep `hero.headingAccent` as an exact substring of `hero.heading`. The model validator catches a mismatch.

`ui.yearSeparator` controls readable career ranges. `ui.contractTemplate` contains `{company}`. The count messages use `{count}` and have separate singular/plural versions.

Design tokens are in `src/styles/_tokens.scss`. Component files use SCSS Modules. Avoid inline styles, remote fonts, a framework substitution or a large component library.

## Domain and icons

Set `site.canonicalOrigin` to a real HTTPS origin such as `https://your-real-domain.tld`, without a path, only once that domain is yours. Keep it null for localhost and temporary tunnels. Set `site.basePath` separately for a deployment subdirectory. Run `npm run build` after changes.

Changing the display name, initials or theme colours regenerates the favicon, PNG install icons and social card through `npm run assets`. Stable icon URLs revalidate on the host; do not give them immutable year-long cache headers.

## Privacy

Public data should remain suitable for unrestricted distribution. Do not add phone numbers, family details, immigration plans, compensation, infrastructure IPs, credentials, private source code or confidential research material. All `VITE_*` variables are public build inputs, not secrets.

Contact is a mailto link with honest clipboard fallback. There is no server-side inbox, form, tracking pixel, analytics service or cookie banner because none is required by the current implementation.
