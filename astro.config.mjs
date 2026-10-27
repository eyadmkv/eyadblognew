// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

const lockedPostIds = readdirSync(new URL('./src/content/blog/', import.meta.url))
  .filter((file) => file.endsWith('.md'))
  .flatMap((file) => {
    const source = readFileSync(new URL(`./src/content/blog/${file}`, import.meta.url), 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    if (!/^locked:\s*true\s*$/m.test(frontmatter)) return [];
    const id = frontmatter.match(/^id:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
    return id ? [id] : [];
  });

export default defineConfig({
  site: 'https://eyadblog.vercel.app',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !lockedPostIds.some((id) => page.endsWith(`/post/${id}`)),
    }),
  ],
});
