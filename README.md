# The Continental

A premium hotel landing experience built with modern React and Next.js. The Continental showcases luxurious suites, dining, spa treatments, curated experiences, testimonials, and a booking section with elegant motion and smooth scrolling.

## Project overview

The Continental is a hospitality-style landing page designed to feel immersive and refined. It includes:

- Animated hero and page transitions
- Smooth scrolling and scroll-linked progress
- Responsive rooms section with pinned horizontal scroll on desktop
- Dedicated suites route for full accommodation details
- Sections for dining, spa treatments, experiences, testimonials, partners, and reservations
- Tailwind-powered styling with custom fonts and dark, editorial design

## Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4 via `@tailwindcss/postcss`
- GSAP for animated entrances and scroll-driven transitions
- Lenis for smooth scroll behavior
- `next/image` for optimized image rendering
- `@tailwindcss/postcss` for Tailwind integration in PostCSS

## Key app structure

- `app/`
  - `layout.js` — root layout and metadata
  - `page.js` — home page entry point
  - `suites/page.js` — suites listing route
- `components/` — reusable page sections and UI components
- `lib/` — shared data and state helpers
- `public/` — static assets and icons

## Features

- Fully responsive landing experience for desktop and mobile
- Animated preloader and reveal animations using GSAP
- Horizontal room carousel with pinning on larger screens
- Smooth nested scrolling via a custom `SmoothScroll` wrapper
- Remote image support for Unsplash content via Next.js remote patterns

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the site.

## Build and production

Build the application for production:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Deployment

This project is optimized for Vercel, but it can be deployed on any platform that supports Next.js 16.

## Notes

- The project uses the Next.js App Router and client components for animation-heavy sections.
- Fonts are loaded with `next/font` and exposed via CSS variables in `app/layout.js`.
- Remote image loading is configured in `next.config.mjs` for `images.unsplash.com`.
- Tailwind v4 is enabled through `postcss.config.mjs` with `@tailwindcss/postcss`.
