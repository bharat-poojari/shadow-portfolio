# Bharat Chandru Poojari - Portfolio

An immersive, performance-focused developer portfolio for **Bharat Chandru Poojari**, a Full Stack Developer from Sirsi, Karnataka, India.

The site presents professional experience, skills, projects, education, certifications, and interactive experiments through a dark, atmospheric interface inspired by a living system archive.

## Live Links

- **Portfolio:** [bharat-poojari.vercel.app](https://bharat-poojari.vercel.app)
- **GitHub:** [github.com/bharat-poojari](https://github.com/bharat-poojari)
- **LinkedIn:** [linkedin.com/in/bharat-poojari-397618359](https://www.linkedin.com/in/bharat-poojari-397618359)
- **Instagram:** [instagram.com/bharat_x_16](https://www.instagram.com/bharat_x_16)
- **Email:** [bharatp0316@gmail.com](mailto:bharatp0316@gmail.com)
- **Resume:** [Download resume](public/resume.pdf)

## Highlights

- Immersive responsive portfolio experience with a cinematic visual system
- Hero interaction with pointer parallax and an interactive cannon sequence
- Dedicated project showcase with filtering and project links
- Interactive Fun Zone with browser games loaded on demand
- Smooth scrolling with Lenis and motion effects with Framer Motion
- Structured content driven from `lib/content.ts`
- Search-engine metadata, JSON-LD structured data, sitemap, robots rules, favicon, and social preview image
- Performance-conscious rendering with dynamic imports and below-the-fold content containment
- Reduced-motion support for users who prefer less animation
- Responsive layouts for desktop, tablet, and mobile screens

## Technology

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS
- **Motion:** Framer Motion, GSAP
- **Scrolling:** Lenis
- **3D and graphics:** Three.js, React Three Fiber, React Three Drei, Canvas APIs
- **Icons:** Lucide React, Iconify
- **Deployment:** Vercel

## Project Structure

```text
app/
  layout.tsx              Global metadata, JSON-LD, fonts, and document shell
  page.tsx                Main portfolio page and first-visit portal
  globals.css             Tailwind layers and global performance styles
  manifest.ts             Web app manifest
  robots.ts               Robots rules and sitemap declaration
  sitemap.ts              XML sitemap
  icon.tsx                Generated 48x48 crawler-friendly icon
  opengraph-image.tsx     Generated 1200x630 social preview image
  api/visitor-node/       Visitor metadata endpoint

components/
  game/                   Interactive canvas games
  hero/                   Hero visual artifacts
  scene/                  Hero interaction and smooth-scroll infrastructure
  sections/               Portfolio sections and Fun Zone
  ui/                     Navigation and footer components

lib/
  content.ts              Profile, skills, projects, and resume content
  useCanvasVisibility.ts  IntersectionObserver visibility helper
  useReducedMotion.ts     Reduced-motion preference hook

public/
  favicon.png             Static favicon and Apple touch icon
  perfect.png             Existing portfolio artwork
  resume.pdf              Downloadable resume
  google*.html            Google Search Console verification file
```

## Getting Started

### Requirements

- Node.js 18.17 or newer
- npm 9 or newer

### Installation

```bash
git clone https://github.com/bharat-poojari/shadow-portfolio.git
cd shadow-portfolio
npm install
```

### Environment variables

Create `.env.local` when using a custom domain or Bing verification:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
BING_SITE_VERIFICATION=your-bing-verification-token
```

`NEXT_PUBLIC_SITE_URL` is used by the canonical URL, Open Graph metadata, JSON-LD, sitemap, robots file, and manifest. The application falls back to `https://bharat-poojari.vercel.app` when it is not set.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create and validate the production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run the Next.js lint command |

## SEO and Social Preview

The site includes:

- Canonical URL and `en-IN` language metadata
- Google verification support
- Optional Bing Webmaster verification through `BING_SITE_VERIFICATION`
- `robots.txt` with sitemap location
- XML sitemap at `/sitemap.xml`
- Generated favicon at `/icon`
- Generated Open Graph image at `/opengraph-image`
- Twitter large-image card metadata
- Person, WebSite, and portfolio section JSON-LD schema

After deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to the exact public domain in Vercel.
2. Deploy the production build.
3. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
4. Use URL inspection to request indexing for the homepage.
5. Validate the preview with the social platform debugging tools.

Search engines control the final timing of favicon and preview updates. A successful deployment does not guarantee an immediate change in cached search results.

## Performance Notes

- Games are loaded with client-only dynamic imports so they do not block the initial page bundle.
- The first-visit progress bar updates its DOM style directly instead of re-rendering React at animation-frame frequency.
- Hero pointer parallax caches layout measurements with `ResizeObserver`.
- Below-the-fold sections use `content-visibility: auto` to defer expensive rendering until needed.
- The hero uses a static background instead of continuous video decoding.
- Reduced-motion preferences disable continuous interactive animation where appropriate.
- Production verification is performed with `npm run build`.

## Content Updates

Most portfolio content is centralized in [lib/content.ts](lib/content.ts). Update that file when changing:

- Profile details
- Skills and technology groups
- Featured projects and live links
- Other project links
- Education and certification records
- Contact information

Keep project links and personal details accurate before deploying.

## Deployment

The project is configured for Vercel and can be deployed with the Vercel dashboard or CLI:

```bash
npm install -g vercel
vercel
```

For production deployment:

```bash
vercel --prod
```

Configure the environment variables in the Vercel project settings before the production deployment. Verify these endpoints after deployment:

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- `/icon`
- `/opengraph-image`

## Contact

For collaboration, project opportunities, or technical discussions:

- Email: [bharatp0316@gmail.com](mailto:bharatp0316@gmail.com)
- GitHub: [bharat-poojari](https://github.com/bharat-poojari)
- LinkedIn: [Bharat Chandru Poojari](https://www.linkedin.com/in/bharat-poojari-397618359)

## License

This repository does not currently declare a separate open-source license. Contact the author before reusing personal branding, portfolio content, artwork, or resume material.
