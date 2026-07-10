import { getCategory } from '../data/categories';
import { getPublishedPosts, readingMinutes, sitePath } from '../lib/posts';

function plainText(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts.map((post) => {
    const category = getCategory(post.data.category);
    const content = plainText(post.body);

    return {
      title: post.data.title,
      description: post.data.description,
      url: sitePath(`posts/${post.slug}/`),
      category: category?.name ?? post.data.category,
      tags: post.data.tags,
      pubDate: post.data.pubDate.toISOString(),
      readingMinutes: readingMinutes(post.body),
      content
    };
  });

  return new Response(JSON.stringify({ items }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
