import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-poojari.vercel.app';
const siteName = 'Bharat Chandru Poojari Portfolio';
const iconPath = '/perfect.png';
const faviconPath = '/favicon.png';

// Fonts are loaded via standard <link> tags in the <head> below rather than
// next/font/google. next/font fetches font files at *build time*, which
// fails in network-restricted build environments (CI runners, sandboxes
// without access to fonts.googleapis.com). Runtime <link> loading works
// everywhere and is simple to swap for next/font later if desired.

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'Bharat Chandru Poojari | Full Stack Developer',
    template: '%s | Bharat Chandru Poojari',
  },
  description:
    'Bharat Chandru Poojari is a Full Stack Developer from Sirsi, Karnataka, specializing in Node.js, React.js, MongoDB, and AI integration.',
  keywords: [
    'Bharat Chandru Poojari',
    'Bharat Poojari',
    'Full Stack Developer',
    'Node.js Developer',
    'React.js Developer',
    'AI Integration',
    'Web Developer in Karnataka',
    'Furniqo',
    'OffyAI',
  ],
  authors: [{ name: 'Bharat Chandru Poojari', url: 'https://github.com/bharat-poojari' }],
  creator: 'Bharat Chandru Poojari',
  publisher: 'Bharat Chandru Poojari',
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName,
    title: 'Bharat Chandru Poojari | Full Stack Developer',
    description:
      'Explore the work, skills, projects, education, and certifications of Full Stack Developer Bharat Chandru Poojari.',
    images: [{ url: iconPath, width: 1230, height: 1278, alt: 'Bharat Chandru Poojari' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bharat Chandru Poojari | Full Stack Developer',
    description:
      'Full Stack Developer specializing in Node.js, React.js, and AI integration.',
    images: [iconPath],
  },
  icons: {
    icon: [{ url: faviconPath, type: 'image/png', sizes: '256x256' }],
    apple: [{ url: faviconPath, type: 'image/png', sizes: '256x256' }],
    shortcut: [{ url: faviconPath, type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: '8IsUEadK0DA_EArkB89dOJkUj0MMbVKmujCqq_FVUeE',
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Bharat Chandru Poojari',
      jobTitle: 'Full Stack Developer',
      description: metadata.description,
      url: siteUrl,
      email: 'mailto:bharatp0316@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sirsi',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://github.com/bharat-poojari',
        'https://www.linkedin.com/in/bharat-poojari-397618359',
        'https://www.instagram.com/bharat_x_16',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Bharat Chandru Poojari Portfolio',
      url: siteUrl,
      description: metadata.description,
      author: { '@id': `${siteUrl}/#person` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'ItemList',
      name: 'Portfolio sections',
      itemListElement: [
        'about',
        'skills',
        'projects',
        'fun-zone',
        'education',
        'certifications',
        'contact',
      ].map((id, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: id === 'fun-zone' ? 'Fun Zone' : id.charAt(0).toUpperCase() + id.slice(1),
        url: `${siteUrl}/#${id}`,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="icon" href={faviconPath} type="image/png" sizes="256x256" />
        <link rel="apple-touch-icon" href={faviconPath} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
