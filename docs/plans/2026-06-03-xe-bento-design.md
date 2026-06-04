# XE Brand Bento — Product Requirements & Design

- **Date:** 2026-06-03
- **Owner:** Nicolas Baldovino (nbaldovino@riamoneytransfer.com)
- **Status:** Design approved — ready for implementation handoff
- **Stack:** Next.js 16.2.7 · React 19 · Tailwind CSS v4 · Motion (Framer Motion)
- **Figma source:** [Brand bento](https://www.figma.com/design/TEDuyTkrM8rQWswGR9R3uE/Brand-bento) — light `236-8092`, dark `265-3542`

---

## 1. Summary

A single-page, dual-mode **showcase** of the new XE design system. It is *more presentation than website*: a cinematic bento of cards that demonstrates the new XE look — new color tokens, new typography, light & dark modes — and proves that **one shared library of blocks composes three different products**: the XE App, the Consumer desktop web, and the Corporate desktop web.

The signature moment: the same blocks **physically rearrange** (shared-element morph) to reconfigure from one product into another, driven by manual controls.

## 2. Goals

- Present the new XE visual language (tokens, color, type) in a polished, high-craft surface.
- Prove the "one system, many products" thesis through a live morph between 3 product layouts.
- Ship a real, token-driven component library — not throwaway mockups — so blocks are reusable.
- Support light & dark mode end-to-end.

### Non-goals (YAGNI)

- No real backend, auth, live FX rates, or data fetching — all content is static fixture data.
- No mobile-responsive breakpoints beyond what the presentation needs (desktop-first; the "XE App" layout simulates a phone frame, it is not a responsive mobile site).
- No routing/multi-page site — one page, two modes.
- No CMS, no i18n (copy is English, hardcoded).

## 3. The two modes × three products model

A single global toggle switches between two **modes**. Within each mode, manual tabs switch between three **products**.

| | **Presentation mode** | **Web mode** |
|---|---|---|
| Feel | Cinematic animated bento | Real, static, scrollable product page |
| Entrance | Staggered block reveal | Standard page load |
| Product switch | Shared-element **morph** (blocks fly/resize/reflow) | Layout swap, normal scroll |
| Controls | Tabs: *XE App · Consumer · Corporate* | Same tabs |
| Use case | Pitch / design showcase | "What it looks like as a real product" |

**Key architectural principle:** Each product layout is a *configuration* (which blocks appear, and their grid position/size) over the **same** block components. This is what makes both the reuse story and the morph possible. A block keeps a stable identity (`layoutId`) across products so Motion can interpolate its position/size when the product changes.

### The three products

1. **XE App** — mobile/phone composition. A tall, single-column stack of blocks inside a phone frame.
2. **Consumer desktop** — the wide bento dashboard seen in the reference screenshots (multi-column masonry of cards).
3. **Corporate desktop** — denser, more data-forward arrangement of the same blocks (e.g. transactions table and accounts list lead; promo/marketing blocks recede).

## 4. The shared block library

One source of truth, reused across all products and both modes. Derived from the reference screenshots:

| # | Block | Notes |
|---|---|---|
| 1 | **Total Balance** | `$88.56`, stacked currency flags, Create account / Send money buttons |
| 2 | **Account Balance** | Single currency (e.g. US Account `$100.00`) with flag emblem |
| 3 | **Send Again** | Recipient chips (avatar + name + "Xe account") |
| 4 | **Transactions Table** | Details / Status / Recipient gets / You sell; status pills (Action required, Completed) |
| 5 | **Rate Chart** | Currency pair selector, rate + delta, sparkline, range tabs (1D…5Y) |
| 6 | **Activity / Empty State** | "No activity yet" clock illustration |
| 7 | **Action Bar** | Send · Convert · Deposit · Schedule a payment · Forwards |
| 8 | **Rate Watch** | List of pairs (CAD, MXN, EUR) with rates |
| 9 | **Send Internationally** | Amount converter (send/receive), inline rate badge, Send money CTA |
| 10 | **Verify ID** | Illustrated prompt card |
| 11 | **Travel Promo** | "Travel without *Limits*" — image card (Big Ben / London Eye), serif accent on "Limits" |
| 12 | **Accounts List** | Multi-currency balances (CAD, AED, USD, GBP) |
| 13 | **Recent Activities** | Activity rows (To Matias, China Cafe) with amounts |

Each block is a self-contained, token-styled React component that:
- reads only from design tokens (no hardcoded colors),
- accepts a `size`/`variant` prop so it can render compactly (app) or expanded (desktop),
- carries a stable `layoutId` for morph continuity.

## 5. Design tokens (extracted from Figma)

Pulled live via Figma MCP from the light (`236-8092`) and dark (`265-3542`) frames. These map into Tailwind v4 via a CSS-first `@theme` block in `globals.css`, with light values on `:root` and dark overrides on `.dark` (class-based toggle, so we can switch independent of OS preference).

### Color — semantic (light → dark)

| Token | Tailwind utility | Light | Dark |
|---|---|---|---|
| content-base | `text-content` | `#0a0a0a` | `#ffffff` |
| content-secondary | `text-content-secondary` | `#737373` | `#a3a3a3` |
| content-tertiary | `text-content-tertiary` | `#a3a3a3` | `#a3a3a3` |
| content-base-reverse | `text-content-reverse` | `#ffffff` | `#0a0a0a` |
| content-stays-white | `text-content-white` | `#ffffff` | `#ffffff` |
| content-brand-logo | `text-brand-logo` | `#ff6e14` | `#ffffff` |
| content-info-on-muted | — | `#1d4ed8` | `#bfdbfe` |
| content-success-on-muted | — | `#16a34a`* | `#86efac` |
| surface-base | `bg-surface` | `#ffffff` | `#0a0a0a` |
| surface-level-01 | `bg-surface-1` | `#f5f5f5` | `#171717` |
| surface-adaptive-gray | `bg-surface-adaptive` | `#0a0a0a0d` (5%) | `#ffffff1a` (10%) |
| surface-info-muted | `bg-info-muted` | `#dbeafe` | `#1e3a8a` |
| surface-success-muted | `bg-success-muted` | `#dcfce7`* | `#14532d` |
| surface-warning-muted | `bg-warning-muted` | `#fef3c7`* | `#78350f` |
| stroke-base | `border-stroke` | `#e5e5e5` | `#262626` |
| stroke-brand-default | `border-brand` | `#2563eb` | `#2563eb` |
| text-success-on-muted | — | `#16a34a`* | `#86efac` |
| text-warning-on-muted | — | `#a16207`* | `#fde047` |

### Color — brand / fixed

| Token | Value |
|---|---|
| Main Blue (primary action) | `#002beb` |
| Brand orange (logo, light) | `#ff6e14` |
| Fuchsia 600 / 50 / 950 (accent marker "N") | `#c026d3` / `#fdf4ff` / `#4a044e` |

\* Values marked with `*` were not present in the two frames' variable dump (those tokens only appear on certain states/elements). They are filled with the standard Tailwind light-mode counterpart of the dark value Figma provided, and are flagged here to **confirm against Figma** during build. Everything unmarked is verbatim from Figma.

### Typography — NEW (overrides Figma's `font-sans: Inter`)

> Figma's current `font-sans` token still resolves to **Inter** (the old type). Per this project the type system is replaced with three Google fonts, loaded via `next/font/google` and exposed as CSS variables.

| Role | Family | next/font | Weights | Tailwind |
|---|---|---|---|---|
| UI / body | **Instrument Sans** | variable | 400–700 (wght), 75–100 (wdth) | `font-sans` (default) |
| Editorial accent (e.g. "*Limits*") | **Instrument Serif** | 400, normal + **italic** | 400 | `font-serif` |
| Display / large headings | **Zalando Sans** | variable | 200–900 | `font-display` |

### Type scale (from Figma base sizes, px / line-height)

`xs 12/16` · `sm 14/20` · `base 16/24` · `lg 18/28` · `xl 20/28` · `2xl 24/—` · `4xl 36/36`
Weights: normal 400 · medium 500 · semibold 600.

### Spacing / radius / size (from Figma `value/*` scale)

- Spacing: `0, 4, 8, 12, 16, 20, 24` (Tailwind `0,1,2,3,4,5,6`).
- Radius: `rounded-xl = 12`, `rounded-full = 9999`, badge = pill.
- Widths/heights: `w/h-4=16, -5=20, -6=24, -10=40, -12=48`.
- Border width: `border-2 = 2`.
- Backdrop blur: `md = 16`, `2xl = 42`.

## 6. Animation design (Motion / Framer Motion)

- **Library:** `motion` (Framer Motion v11+), `LayoutGroup` + `layoutId` for shared-element morph; spring transitions.
- **Entrance (presentation mode):** blocks animate in with a staggered spring (opacity + y + scale), orchestrated via a parent `staggerChildren`. Respects `prefers-reduced-motion`.
- **Product morph:** switching the active product changes each block's grid slot. Because blocks share a `layoutId`, Motion interpolates position + size; blocks that don't exist in the target product animate out (scale/opacity), new ones animate in. Spring config tuned for a "settling" feel (moderate stiffness, low-ish damping).
- **Mode switch (presentation ↔ web):** cross-fade + layout settle; web mode disables the entrance choreography.
- **Micro-interactions:** hover lift on cards, button press scale, range-tab and value-converter transitions, animated sparkline draw on the Rate Chart.
- **Theme switch:** smooth color transition via CSS `transition` on token variables (guarded for reduced motion).

## 7. Architecture

```
src/
  app/
    layout.tsx            # fonts (next/font/google) → CSS vars; <html class="dark"?>
    page.tsx              # mounts <BentoShowcase/>
    globals.css           # @theme tokens (light + .dark), base styles
  components/
    showcase/
      BentoShowcase.tsx   # top-level: mode + product + theme state, controls
      ModeToggle.tsx      # Presentation ↔ Web
      ProductTabs.tsx     # XE App · Consumer · Corporate
      ThemeToggle.tsx     # light ↔ dark
      stage/              # layout engines per (mode × product)
    blocks/               # the 13 shared block components
      TotalBalance.tsx, RateChart.tsx, SendInternationally.tsx, ...
    primitives/           # Card, Pill, FlagBadge, CurrencyRow, Button, ...
  lib/
    tokens.ts             # typed token references (optional)
    layouts.ts            # product → block placement config (drives the morph)
    fixtures.ts           # static demo data
```

- **State** lives in `BentoShowcase` (mode, product, theme); no global store needed.
- **`layouts.ts`** is the heart: a map of `product → ordered blocks + grid spans`. Changing a product re-reads this; `layoutId` does the rest.
- **Theme** toggled by adding/removing `.dark` on `<html>` (class strategy), persisted to `localStorage`, defaulting to OS preference on first load.

## 8. Success criteria

- All 13 blocks render correctly from tokens in both light and dark.
- Three product layouts are visibly distinct and assembled from the same block components.
- Presentation mode: staggered entrance + smooth morph between all three products via manual tabs.
- Web mode: each product reads as a believable static page.
- No hardcoded colors in components — everything flows from the `@theme` tokens.
- `prefers-reduced-motion` honored.

## 9. Open items to confirm during build

1. Confirm the starred (`*`) light-mode token values against Figma (success/warning muted + on-muted text).
2. Confirm dark-mode `surface-base` (using `#0a0a0a`; reference dark frame background reads near-black).
3. Confirm the exact Corporate desktop layout (no dedicated frame yet — will compose from the same blocks, denser/data-first).
4. Confirm whether the fuchsia "N" markers in the reference are annotations (Figma comments) or an actual UI element. Assumed annotations — excluded from the build.

## 10. Step plan

1. ✅ Connect Figma MCP, extract tokens (done).
2. ✅ Write this PRD (done).
3. Install the three fonts via `next/font/google`, wire CSS variables in `layout.tsx`.
4. Map tokens into Tailwind v4 `@theme` in `globals.css` (light + `.dark`).
5. *(handoff)* Build primitives → blocks → layout engine → controls → animations, light & dark.
