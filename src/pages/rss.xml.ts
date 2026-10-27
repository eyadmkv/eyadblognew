import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => data.status === 'published' && !data.locked))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  return rss({
    title: 'إياد اللامع، وقد انطفأ',
    description: 'أرشيف كتابي ومدونة تأملية فلسفية مخصصة للكاتب إياد محمد حلمي.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.titleAr || post.data.titleEn,
      description: post.data.excerptAr || post.data.excerptEn,
      link: `/post/${post.data.id}`,
      pubDate: new Date(`${post.data.date}T00:00:00Z`),
    })),
    customData: '<language>ar</language>',
  });
}
