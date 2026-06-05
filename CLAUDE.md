# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Working agreement

These apply to every task, no exceptions:

- **English only.** All code, comments, commit messages, PR titles/descriptions, branch names, and docs are written in **English** — even when the conversation happens in Spanish. Reply to the user in their language, but everything that lands in the repo is English.
- **Plan first for non-trivial work.** Anything that is 3+ steps or involves an architectural decision: enter plan mode and agree on the approach before writing code.
- **Check existing patterns before implementing.** Read how the codebase already solves a similar problem (primitives, blocks, tokens, motion variants) and follow it. Do **not** introduce a new architectural approach, library, or convention without discussing it first.
- **Surgical changes.** Modify only what the request needs. Match the existing style even if you'd do it differently. Don't "improve" adjacent code, comments, or formatting. Flag unrelated issues instead of fixing them inline. Every changed line should trace directly to the request.
- **Simplicity first.** Write the minimum code that solves the problem — nothing speculative, no features beyond what was asked, no abstractions for single-use code. If it could be half the size, rewrite it.
- **Don't hide confusion.** State assumptions explicitly; if something is unclear, stop, name what's confusing, and ask. Surface tradeoffs rather than choosing silently.
- **Verify before claiming done.** Define success criteria up front and loop until they're met. Report outcomes faithfully — if lint/build fails, say so with the output; if a step was skipped, say that.

## Git workflow

`main` is protected — never commit or push to it directly. All work flows through branches and PRs.

1. **Branch per change.** Create a branch off `main` for every feature/idea/fix. Naming (everyone follows this):
   - `feature/<short-kebab-desc>` — new functionality
   - `fix/<short-kebab-desc>` — bug fixes
   - `chore/<short-kebab-desc>` — tooling, deps, config, housekeeping
   - `docs/<short-kebab-desc>` — documentation only
   - `refactor/<short-kebab-desc>` — internal change, no behavior change
2. **Conventional commits.** `type: summary` (e.g. `feat: add ThemeProvider`, `fix: correct dark stroke color`). Imperative mood, in English.
3. **Open a PR into `main`** to merge — no direct merges. The PR description states what changed and why, and includes verification (lint/build, screenshots for visual changes in both light and dark).
4. **Self code review before pushing** (Pre-PR checklist): read your own diff end-to-end as if a stranger wrote it, and look for:
   - duplication / code that should reuse an existing primitive, block, or token;
   - missing edge cases (empty states, both themes, reduced-motion, all four `ViewMode`s if relevant);
   - dead code or leftovers your change introduced;
   - consistency with existing naming, file structure, and token usage;
   - any hardcoded color/spacing that should be a token.

## Commands

```bash
npm run dev      # Next.js dev server (Turbopack) → http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

There is no test suite. After changes, verify with `npm run lint` and a `npm run build`.

> Per `AGENTS.md`, this is Next.js **16.2.7** — APIs differ from older versions. Consult `node_modules/next/dist/docs/` before writing Next-specific code.

## What this project is

A single-page **design-system showcase**, not a real product. Its thesis: *one shared library of blocks composes multiple products*. There is no backend, auth, routing, or data fetching — all content is static fixture data (`src/lib/fixtures.ts`). The full intent lives in [docs/plans/2026-06-03-xe-bento-design.md](docs/plans/2026-06-03-xe-bento-design.md) (note: the PRD's planned file layout differs from what was actually built — trust the code below).

### The design system is the product

This repo is the **source of truth for XE's look and feel** across products — Consumer and Corporate, on both mobile and desktop. The tokens and the shared block library are the deliverable; the four views just prove they compose. When working here, weigh changes by their impact on the system, not just the view in front of you:

- A change to a **token** or a **primitive** ripples through every block and every view — treat it as an API change. Verify it in all four `ViewMode`s and in **both light and dark**.
- New visual values belong in tokens (`@theme` in `globals.css`), not in components. If you reach for a raw hex/px, that's a signal a token is missing — add it to the system instead.
- **Theming is a first-class, growing concern.** The current light/dark split is the foundation; expect more themes/brands. Keep theme-specific values behind tokens (`:root` / `.dark` and any future theme scopes) so components stay theme-agnostic and never branch on the active theme. Larger theming work may land on its own branch — design changes so they don't paint the system into a corner.

## Architecture

Everything mounts from [src/app/page.tsx](src/app/page.tsx) → [`BentoStage`](src/components/bento/BentoStage.tsx), the single stateful component. It holds one piece of state — the current `ViewMode` (`bento | mobile | consumer | corporate`, see [ViewToggle.tsx](src/components/bento/ViewToggle.tsx)) — and renders one of four arrangements of the **same block components**:

- **bento** — the cinematic masonry; cards draw their border on entrance (see "Stroke draw" below).
- **mobile** — a curated subset inside [`MobileFrame`](src/components/bento/MobileFrame.tsx) (phone chrome).
- **consumer** / **corporate** — web-app shells ([ConsumerView](src/components/bento/ConsumerView.tsx), [CorporateView](src/components/bento/CorporateView.tsx)): a [`Sidebar`](src/components/Sidebar.tsx) + main column assembled from the same blocks.

Each view is a *configuration* (which blocks, what order/size) over the shared library — adding a new arrangement means composing existing blocks, not building new ones.

### Three layers of components

- **`src/components/primitives/`** — token-styled building blocks (`Card`, `Button`, `Pill`, `Figure`, `Eyebrow`, `CurrencyRow`, `RollingNumber`, `Icon`, `RateAreaChart`, …). `Card` is the base surface for every block.
- **`src/components/bento/blocks/`** — the ~13 self-contained product blocks (`TotalBalanceCard`, `RateChartCard`, `TransactionsTableCard`, …). Each reads its data from `fixtures.ts` and takes optional props (`amount`, `align`, `showActions`, `count`, `className`, …) so the **same block renders compactly or expanded** across views.
- **`src/components/bento/`** — the stage, views, frame, and toggles that compose blocks.

### `src/lib/`

- `fixtures.ts` — all demo data. Change content here, not in components.
- `motion.ts` — shared Motion variants/springs (`containerVariants`/`groupVariants` orchestrate the staggered entrance; `cardVariants`, `strokeDrawVariants`, `spring`, `snappy`). Reuse these rather than inlining transitions.
- `cn.ts` — the className joiner (no `clsx`/`tailwind-merge` dependency).
- `assets.ts` — single swap point for flags/illustrations/logos (resolves codes → `/public/assets/*`).
- `currency.ts` / `rate-series.ts` — demo FX helpers. Rates anchor to a single `CAD_USD = 0.7249` so numbers stay consistent across blocks; `rate-series.ts` is **deterministic (seeded LCG, no `Date`/`Math.random`)** so server and client render identical chart paths — keep it that way to avoid hydration mismatches.

## Extending the system

This is a living showcase — new blocks, views, and (later) themes will keep landing. Follow the existing mold so additions stay reusable; if your case doesn't fit the mold, that's a discussion before code, not a new pattern invented inline.

> **Building a widget?** Read [design.md](design.md) — the canonical authoring guide (content vs `WidgetShell` container, `FlagStack`/`AssetIcon`, tokens, motion, the pre-delivery QA checklist).

### Add a block

Blocks are the unit of reuse — build them to compose into any view, not for one screen.

1. Create `src/components/bento/blocks/<Name>Card.tsx`. Use `Card` as the root surface and compose existing primitives — only build a new primitive if it's genuinely reusable.
2. Style with **tokens only** (`bg-surface`, `text-content`, `border-stroke`, `rounded-card`, …) — no raw hex/px. Verify in light **and** dark.
3. Source content from `fixtures.ts` (add a fixture there, not literals in the component). Expose optional props with defaults (`amount`, `align`, `showActions`, `count`, `className`, …) so the same block renders compact or expanded.
4. Give it a stable `layoutId` so it can morph across views via `LayoutGroup`.
5. Don't add entrance transitions inline — being a child of a `motion` group makes it inherit `cardVariants`. Honor `prefers-reduced-motion`.
6. Need an icon? Add it to the `PATHS`/`IconName` registry in [Icon.tsx](src/components/primitives/Icon.tsx); don't inline one-off SVGs.
7. Drop it into the views that should show it (see below).

### Add a view / product

A view is a **configuration over existing blocks**, not new UI. To add one:

1. Add the mode to `ViewMode` and the `OPTIONS` list in [ViewToggle.tsx](src/components/bento/ViewToggle.tsx).
2. Create the view component (compose blocks; reuse `Sidebar`/`MobileFrame` shells where they fit) and branch to it in [BentoStage.tsx](src/components/bento/BentoStage.tsx).
3. If you find yourself wanting a block that doesn't exist, add the **block** first (above) so it's reusable — don't bake bespoke markup into the view.

### Add / change a token or theme

Tokens are an API — a change ripples through every block and view. Edit the `@theme` block and the `:root` / `.dark` (and any future theme scope) declarations in [globals.css](src/app/globals.css); never branch on the active theme inside a component. Verify the change across all four views in both light and dark.

## Conventions that matter

- **Tokens only — never hardcode colors.** All color/type/radius/spacing flow from the `@theme` block in [src/app/globals.css](src/app/globals.css), with light values on `:root` and dark overrides on `.dark`. Use the generated utilities (`bg-surface`, `text-content`, `border-stroke`, `bg-action`, `rounded-card`, etc.). Tailwind **v4** (CSS-first config; there is no `tailwind.config.js`).

  Tokens are **two-tier**: primitive **foundations** (`size-*`, `leading-*`, `tracking-*`, `weight-*`) and **semantic** tokens that reference them. A typeset (`text-h1`…`text-caption`) bundles size+line-height+weight+letter-spacing and aliases foundations via a `ref` — editing a foundation cascades to every typeset. The brand/CTA colour is the **`action`** set: `bg-action` + `hover:bg-action-hover` / `active:bg-action-pressed` (light `#0533FF` / dark `#385DFF`); solid status fills (`surface-success/warning/danger`) carry the same `-hover`/`-pressed` states.
- **Dark mode is class-based**, not OS-driven: `@custom-variant dark` follows `.dark` on `<html>`, toggled by [ThemeToggle](src/components/bento/ThemeToggle.tsx) and persisted to `localStorage` (`xe-theme`). An inline script in [layout.tsx](src/app/layout.tsx) sets the class before paint to avoid a theme flash.
- **Fonts** are wired in `layout.tsx` via `next/font`. A digits-only IBM Plex Sans face (`unicode-range: U+0030-0039`) leads every font stack so **all numerals render in IBM Plex automatically** while text falls through to the body face (Zalando Sans) — no per-element markup. Don't reorder the stacks. Typesets carry tight tracking (`tracking-tight`, `-0.025em`); `font-serif` (Instrument Serif) resets to normal tracking.
- **Animation:** `motion/react`. The entrance stagger is orchestrated parent→child via variants — a block animates in simply by being a child of a `motion` group that inherits `cardVariants`. Always honor `prefers-reduced-motion` (`useReducedMotion`), as existing components do.
- **Stroke draw:** in bento view only, `Card` reads `DrawStrokeContext` and renders an SVG `<rect>` that traces its own grey border on entrance (instead of a static CSS border). Other views use a plain border.
- Blocks carry a stable `layoutId` (e.g. `total-balance`) for shared-element morph continuity via `LayoutGroup`.
- Path alias: `@/*` → `src/*`.
