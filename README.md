# Siem Reap Frontend

A Next.js App Router frontend built with React 19 and Tailwind CSS. This repo is configured with ESLint (flat config), Prettier, Husky, and lint-staged for maintainability and scalable development.

## Installation

```bash
# From project root
npm install
```

- Recommended Node.js: 18.18+ (Node 20+ preferred)
- Package manager: npm (package-lock.json present)

## Development

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Lint (ESLint flat config)
npm run lint

# Lint with fixes
npm run lint:fix

# Check formatting (Prettier)
npm run format

# Write formatting changes
npm run format:fix
```

- On commit: staged files run through ESLint/Prettier via Husky + lint-staged.

## Build & Deployment

```bash
# Production build
npm run build

# Start production server (after build)
npm run start
```

- Deploy anywhere that runs Node (e.g., a VM, container, or PaaS). Serve the build with `npm run start`.
- Vercel is recommended for zero-config Next.js deployments.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- ESLint 9 (flat config) + eslint-config-next + eslint-config-prettier
- Prettier 3
- Husky 9 + lint-staged

## Project Structure

```text
siemreap-frontend/
├─ public/                    # Static assets served at the root
├─ src/
│  └─ app/                    # App Router
│     ├─ favicon.ico
│     ├─ globals.css          # Tailwind + global styles
│     ├─ layout.tsx           # Root layout
│     └─ page.tsx             # Home page
├─ .husky/
│  └─ pre-commit              # Runs lint-staged
├─ .prettierrc.json           # Prettier config
├─ .prettierignore            # Prettier ignore
├─ eslint.config.mjs          # ESLint flat config
├─ next.config.ts             # Next.js config
└─ package.json               # Scripts and dependencies
```

## Linting & Formatting

- ESLint is configured in `eslint.config.mjs` (flat config):
  - Extends `next/core-web-vitals`, `next/typescript`, and `@eslint/js` recommended.
  - `eslint-config-prettier` is applied last to disable conflicting stylistic rules.
  - Ignores: `node_modules/`, `.next/`, `out/`, `build/`, `next-env.d.ts`, `coverage/`, `dist/`.
- Prettier is configured via `/.prettierrc.json` and `/.prettierignore`.
- Husky pre-commit hook runs `lint-staged` to lint/format staged files only.

## First-time Setup (Hooks)

After `npm install`, initialize Husky and ensure hook permissions:

```bash
npx husky init
chmod +x .husky/pre-commit
npx lint-staged --debug   # optional: verify patterns
```

## Notes

- Default dev URL is `http://localhost:3000`. If using an IDE proxy preview, you may see a dev-origin warning from Next.js; you can whitelist the proxy origin via `allowedDevOrigins` in `next.config.ts` when needed.
- Edit `src/app/page.tsx` and `src/app/layout.tsx` to build out pages and layouts.
