# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Development: `npm run dev` (Vite dev server)
- Build: `npm run build` (production) or `npm run build:dev` (development)
- Preview: `npm run preview` (preview production build)

## Lint and Format Commands
- Lint: `npm run lint` (ESLint)

## Code Style Guidelines
- TypeScript with React functional components
- Use path aliases: `@/components`, `@/lib`, `@/hooks` etc.
- Follow ShadCN UI component patterns
- Use Tailwind CSS for styling
- Use named exports for components
- PascalCase for component files and functions
- camelCase for non-component functions and variables
- Use TypeScript types for props and state
- Handle errors with try/catch and appropriate user feedback
- Import order: React, external libs, internal components, styles

## File Structure
- Pages in `src/pages/`
- UI components in `src/components/`
- Utility functions in `src/lib/`
- Hooks in `src/hooks/`
- Services in `src/services/`

## PWA (Progressive Web App) Support
- Service worker configuration in `/public/sw.js`
- Service worker registration in `src/serviceWorkerRegistration.ts`
- Web app manifest in `/public/manifest.json` 
- PWA meta tags in `index.html`
- PWA assets in `/public/icons/`
- Keep service worker updated when making changes to cached assets