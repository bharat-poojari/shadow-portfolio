import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-poojari.vercel.app';
const siteOrigin = new URL(siteUrl).origin;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteOrigin}/`,
      lastModified: '2026-09-24',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}