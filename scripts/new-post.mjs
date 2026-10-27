import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const rl = createInterface({ input: stdin, output: stdout });
const ask = async (label, fallback = '') => {
  const answer = (await rl.question(
    fallback ? `${label} [${fallback}]: ` : `${label}: `
  )).trim();
  return answer || fallback;
};

const yaml = (value) => JSON.stringify(value);

try {
  console.log('\nCreate a new blog post\n');

  const titleAr = await ask('Article title in Arabic');
  if (!titleAr) throw new Error('An Arabic title is required.');

  const titleEn = await ask('English title (optional)');
  const excerptAr = await ask('Arabic excerpt');
  const excerptEn = await ask('English excerpt (optional)');
  const category = await ask('Category', 'تأملات');
  const rawTags = await ask('Tags, separated by commas');

  const tags = rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const publishNow = (
    await ask('Publish immediately? y/N', 'n')
  ).toLowerCase() === 'y';

  const now = new Date();
  const id = `post_${Date.now()}`;
  const locked = (
    await ask('Password-protect this post? y/N', 'n')
  ).toLowerCase() === 'y';
  const passwordEnv = locked
    ? await ask('Password environment variable name', `POST_PASSWORD_${id.slice(5)}`)
    : undefined;

  if (passwordEnv && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(passwordEnv)) {
    throw new Error('Use a valid environment variable name (letters, numbers, and underscores).');
  }

  const date = now.toISOString().slice(0, 10);

  const slugBase = (titleEn || titleAr)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'article';

  const legacySlug = `${slugBase}-${id}`;
  const status = publishNow ? 'published' : 'draft';

  const frontmatter = [
    '---',
    `id: ${yaml(id)}`,
    `legacySlug: ${yaml(legacySlug)}`,
    `titleEn: ${yaml(titleEn)}`,
    `titleAr: ${yaml(titleAr)}`,
    `excerptEn: ${yaml(excerptEn)}`,
    `excerptAr: ${yaml(excerptAr)}`,
    `contentEn: ${yaml('')}`,
    `date: ${yaml(date)}`,
    `status: ${yaml(status)}`,
    `tags: ${JSON.stringify(tags)}`,
    'readingTimeMin: 5',
    'featured: false',
    `category: ${yaml(category)}`,
    `createdAt: ${yaml(now.toISOString())}`,
    `updatedAt: ${yaml(now.toISOString())}`,
    `locked: ${locked}`,
    ...(passwordEnv ? [`passwordEnv: ${yaml(passwordEnv)}`] : []),
    '---',
    '',
    'اكتب نص المقال هنا.',
    '',
  ].join('\n');

  const directory = resolve('src/content/blog');
  await mkdir(directory, { recursive: true });

  const filePath = resolve(directory, `${id}.md`);

  if (existsSync(filePath)) {
    throw new Error(`Article already exists: ${filePath}`);
  }

  await writeFile(filePath, frontmatter, 'utf8');

  console.log(`\nCreated: ${filePath}`);
  console.log(`Status: ${status}`);
  if (passwordEnv) {
    console.log(`Password protection: enabled (${passwordEnv})`);
    console.log('Set this environment variable in Vercel before building the site.');
  }

  const editor = spawn('code', ['-r', filePath], {
    stdio: 'ignore',
    detached: true,
    windowsHide: true,
  });

  editor.on('error', () => {
    console.log('Open the new Markdown file in VS Code manually.');
  });

  editor.unref();
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
