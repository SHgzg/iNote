import rss from '@astrojs/rss';
import { getPublishedPosts, sitePath } from '../lib/posts';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'iNote',
    description: '一个面向生活、学习、阅读与专业成长的个人博客。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: sitePath(`posts/${post.slug}/`)
    }))
  });
}
