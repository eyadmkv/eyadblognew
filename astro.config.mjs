// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://eyadblog.vercel.app',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
