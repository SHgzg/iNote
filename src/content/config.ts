import { defineCollection, z } from 'astro:content';

const postCategories = [
  'private-menu',
  'study-notes',
  'reading-notes',
  'essays',
  'thinking',
  'professional-learning',
  'projects',
  'tools',
  'life',
  'media'
] as const;

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(postCategories),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts };
