---
trigger: manual
---

# Engineering Conventions

This document defines coding standards, naming conventions, folder structure rules, and testing requirements for the Siem Reap Frontend.

- Tech baseline: Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4.
- Linting/formatting: ESLint (flat config) + Prettier. See `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`.

## Coding Standards

- **TypeScript first**
  - Use `ts/tsx` everywhere. Avoid `any`; prefer explicit types and generics.
  - Enable strictness in components and utilities. Prefer inference but annotate public APIs.
- **React + Next.js**
  - Use **server components by default** in `app/`. Mark client components with `"use client"` only when needed (state, effects, event handlers, browser-only APIs).
  - Prefer **async server functions** for data fetching in route segments/layouts.
  - Co-locate component styles (CSS Modules) when not using Tailwind utilities exclusively.
  - Avoid global side effects in components; keep components pure and deterministic.
- **State & data**
  - Keep state minimal and localized. Lift state only when necessary.
  - Derive values instead of storing duplicates.
  - Prefer Next.js fetch with caching options over client-side fetching when possible.
- **Accessibility (a11y)**
  - Use semantic HTML. Provide `aria-*` attributes and alt text for images.
  - Ensure sufficient color contrast. Keyboard navigability is required.
- **Error handling**
  - Handle errors at boundaries (error routes in `app/` or error components) and at API boundaries.
  - Never swallow errors; attach context and rethrow or log appropriately (only `console.warn`/`console.error` allowed, as per ESLint).
- **Imports & style**
  - Absolute imports via `@/` alias if configured in `tsconfig` (add later). Otherwise, prefer short relative paths.
  - Keep imports ordered: React/Next, libs, components, hooks, utils, styles.
  - Follow Prettier formatting and ESLint rules (`eslint-config-prettier` last to avoid conflicts).

## Naming Conventions

- **Files & folders**
  - Route segments under `src/app/` follow Next.js rules (`page.tsx`, `layout.tsx`, etc.).
  - Components in `src/components/` use `PascalCase` filenames: `UserCard.tsx`.
  - Hooks in `src/hooks/` use `camelCase` filenames starting with `use`: `useUser.ts`.
  - Utilities in `src/lib/` or `src/utils/` use `camelCase`: `formatDate.ts`.
  - Types in `src/types/` use `PascalCase` type names and `camelCase` filenames: `user.ts` with `User`, `UserId`.
- **Symbols**
  - Components: `PascalCase` exports, default export for the primary component in a file.
  - Hooks: start with `use`, `camelCase` (e.g., `useFeatureFlag`).
  - Functions & variables: `camelCase`. Constants: `UPPER_SNAKE_CASE` only if truly constant.
  - Enums and types/interfaces: `PascalCase`.
- **CSS/Tailwind**
  - Prefer Tailwind utility classes. For complex styles, use CSS Modules with `PascalCase.module.css` adjacent to the component.

## Folder Structure Rules

Proposed structure for scalability (adopt incrementally):

```
src/
  app/                 # App Router entries (routes, layouts, metadata)
  components/          # Reusable UI components
  hooks/               # Reusable React hooks
  lib/                 # Framework-agnostic domain logic and API clients
  utils/               # Small helpers (formatters, guards)
  styles/              # Global styles (if not only Tailwind)
  types/               # Shared TypeScript types
public/                # Static assets
```

Rules:
- Prefer **feature-first grouping** when a feature grows:
  - Example: `src/features/users/components/`, `src/features/users/lib/`, etc.
- Keep `src/app/` lean: route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) and tiny adapters to feature modules.
- Co-locate tests next to implementations (e.g., `UserCard.test.tsx`), or place under `tests/` mirroring structure.
- Avoid deep nested directories beyond 4 levels; refactor into feature modules.

## Testing Requirements

The project does not include a test runner yet. Requirements and recommendations:

- **Unit & integration tests** (choose one stack)
  - Option A (recommended): **Vitest** + **Testing Library** for React
    - Packages: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
  - Option B: **Jest** + Testing Library
    - Packages: `jest`, `ts-jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`.
- **E2E tests**
  - **Playwright** recommended for Next.js apps.
- **Coverage**
  - Target: 80% lines/branches for critical modules. Exclude `src/app/**` route shells and generated files.
- **Locations & naming**
  - Co-located: `*.test.ts(x)` or `*.spec.ts(x)` next to source files.
  - Or centralized: `tests/**` mirroring `src/**` with same naming.
- **CI**
  - Add a workflow to run `npm run lint`, `npm run build`, and `npm test` on PRs.

Suggested scripts (once tests are added):

```jsonc
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

## ESLint & Prettier Alignment

- ESLint base rules are defined in `eslint.config.mjs` (extends `next/core-web-vitals`, `next/typescript`, `@eslint/js`), with `eslint-config-prettier` last.
- Treat warnings seriously (`no-console` restricted to `warn`/`error`, `no-debugger`, `no-unused-vars` with `_` ignore pattern).
- Format with Prettier; do not override formatting rules in ESLint.

## Commit Quality

- Pre-commit hook runs lint-staged to keep code clean. Do not bypass unless necessary.
- Keep commits small, scoped, and include a clear description of changes.
- Prefer Conventional Commits style if/when we add automated releases.
