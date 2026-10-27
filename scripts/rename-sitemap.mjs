import { rename } from 'node:fs/promises';

await rename(new URL('../dist/sitemap-index.xml', import.meta.url), new URL('../dist/sitemap.xml', import.meta.url));
