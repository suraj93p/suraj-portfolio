import type { ManifestOptions } from 'vite-plugin-pwa';
import type { PortfolioConfig } from '../src/models/portfolio.types';
export function createManifest(config: PortfolioConfig): Partial<ManifestOptions> {
  const { pwa, site } = config;
  return {
    name: pwa.name, short_name: pwa.shortName, description: pwa.description,
    id: pwa.id, start_url: pwa.startUrl, scope: pwa.scope, display: pwa.display,
    orientation: pwa.orientation, lang: pwa.lang, dir: pwa.dir,
    theme_color: site.themeColor, background_color: site.backgroundColor,
    icons: pwa.icons.map((icon) => ({ ...icon })),
    shortcuts: pwa.shortcuts.map((shortcut) => ({ name: shortcut.name, short_name: shortcut.shortName, url: shortcut.url }))
  };
}
