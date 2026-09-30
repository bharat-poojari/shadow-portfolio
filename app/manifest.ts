import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bharat Chandru Poojari Portfolio',
    short_name: 'Bharat Poojari',
    description:
      'Portfolio of Bharat Chandru Poojari, a BCA graduate and full-stack developer in Sirsi, Karnataka, building with Node.js, Express.js, React.js, MongoDB, MySQL, and LLM integration.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#08070b',
    theme_color: '#08070b',
    lang: 'en-IN',
    icons: [
      {
        src: `${siteUrl}/perfect.png`,
        sizes: '1230x1278',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}