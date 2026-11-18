import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadConfig } from './load-config.mjs';
const config = await loadConfig();
const root = fileURLToPath(new URL('../public/', import.meta.url));
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
await mkdir(`${root}/icons`, { recursive: true });
await mkdir(`${root}/social`, { recursive: true });
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="${config.site.themeColor}"/><text x="256" y="306" text-anchor="middle" font-family="Arial,sans-serif" font-size="168" font-weight="700" letter-spacing="-10" fill="white">${escape(config.profile.initials)}</text><circle cx="341" cy="326" r="9" fill="#bdddd3"/></svg>`;
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512], ['apple-touch-icon-180.png', 180]]) {
  await sharp(Buffer.from(iconSvg)).resize(size, size).png().toFile(`${root}/icons/${name}`);
}
await writeFile(`${root}/favicon.svg`, iconSvg);
const socialSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${config.site.backgroundColor}"/><rect x="70" y="70" width="1060" height="490" rx="12" fill="white" stroke="#d9e0da"/><rect x="112" y="114" width="42" height="4" fill="${config.site.themeColor}"/><text x="112" y="175" font-family="Arial,sans-serif" font-size="18" fill="${config.site.themeColor}" letter-spacing="3">${escape(config.profile.location.toUpperCase())}</text><text x="108" y="297" font-family="Arial,sans-serif" font-size="83" font-weight="700" fill="#18231f" letter-spacing="-4">${escape(config.profile.name)}</text><text x="112" y="355" font-family="Arial,sans-serif" font-size="27" fill="#4b5b52">${escape(config.profile.roleHeadline)}</text><path d="M112 423H1088" stroke="#d9e0da"/><text x="112" y="484" font-family="Arial,sans-serif" font-size="24" fill="${config.site.themeColor}">${escape(config.hero.heading)}</text></svg>`;
await sharp(Buffer.from(socialSvg)).png().toFile(`${root}/${config.site.socialImage.path}`);
let robots = `User-agent: *\n${config.site.indexable ? 'Allow: /' : 'Disallow: /'}\n`;
if (config.site.canonicalOrigin) {
  const canonical = new URL(config.site.basePath, config.site.canonicalOrigin).href;
  robots += `Sitemap: ${new URL('sitemap.xml', canonical).href}\n`;
  await writeFile(`${root}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(canonical)}</loc><lastmod>${config.contentAsOf}</lastmod></url></urlset>`);
} else { await rm(`${root}/sitemap.xml`, { force: true }); }
await writeFile(`${root}/robots.txt`, robots);
console.log('Generated local portfolio icons, social image and crawler metadata.');
