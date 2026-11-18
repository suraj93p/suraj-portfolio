import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { portfolioConfig } from './src/config/portfolio.config';
import { htmlMetadata } from './build/html-metadata.plugin';
import { createManifest } from './build/create-manifest';
import { normaliseBase } from './src/utils/urls';

const base = normaliseBase(portfolioConfig.site.basePath);
const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export default defineConfig({
  base,
  appType: 'mpa',
  plugins: [
    react(),
    htmlMetadata(portfolioConfig),
    VitePWA({
      disable: !portfolioConfig.features.pwa,
      strategies: 'generateSW', registerType: 'prompt', injectRegister: null,
      filename: 'sw.js', scope: base, manifest: createManifest(portfolioConfig),
      includeAssets: ['favicon.svg', 'icons/*.png'],
      devOptions: { enabled: false },
      workbox: {
        cacheId: `suraj-portfolio-${base.replace(/\//g, '-')}`,
        globPatterns: ['**/*.{html,js,css,png,svg,webmanifest}'],
        globIgnores: ['**/social/**', '**/*.map'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        cleanupOutdatedCaches: true, skipWaiting: false, clientsClaim: true,
        inlineWorkboxRuntime: true,
        navigateFallback: `${base}index.html`,
        navigateFallbackAllowlist: [new RegExp(`^${escapedBase}(?:index\\.html)?(?:\\?.*)?$`)]
      }
    })
  ],
  server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    // Cloudflared uses --http-host-header localhost:5173. Never allow every host.
    allowedHosts: ['localhost'],
    fs: { strict: true }
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true, allowedHosts: ['localhost'] },
  build: { target: 'es2022', sourcemap: false, cssCodeSplit: false, reportCompressedSize: true }
});
