import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-poojari.vercel.app';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bharat Chandru Poojari Portfolio',
    short_name: 'Bharat Poojari',
    description:
      'Portfolio of Bharat Chandru Poojari, a Full Stack Developer specializing in Node.js, React.js, MongoDB, and AI integration.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#08070b',
    theme_color: '#08070b',
    lang: 'en-IN',
    icons: [
      {
        src: `${new URL(siteUrl).origin}/favicon.png`,
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}