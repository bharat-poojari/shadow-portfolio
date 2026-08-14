import type { Metadata } from 'next';
import './globals.css';

// Fonts are loaded via standard <link> tags in the <head> below rather than
// next/font/google. next/font fetches font files at *build time*, which
// fails in network-restricted build environments (CI runners, sandboxes
// without access to fonts.googleapis.com). Runtime <link> loading works
// everywhere and is simple to swap for next/font later if desired.

export const metadata: Metadata = {
  title: 'Bharat Chandru Poojari — Full Stack Developer',
  description:
    'Full Stack Developer specializing in Node.js, React.js, and AI Integration. Portfolio: Furniqo, OffyAI, PrimeNews, CodePolish and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
