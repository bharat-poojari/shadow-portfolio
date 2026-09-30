const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-poojari-portfolio.vercel.app';

export const siteUrl = new URL(configuredSiteUrl).origin;