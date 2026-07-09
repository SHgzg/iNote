import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function readingMinutes(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .trim().length;

  return Math.max(1, Math.ceil(words / 500));
}

export function slugifyTag(tag: string) {
  return tag
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tag';
}

export function sitePath(path = '') {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}

export function assetPath(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return sitePath(path);
}
