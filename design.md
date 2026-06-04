# Building XE Widgets — authoring guide

This is the canonical guide for building a widget in this repo. It exists so every widget is **consistent, token-driven, theme-aware, and renders in both a mobile and a desktop container** from one source. Read it before adding or changing a widget. The token system is documented in [CLAUDE.md](CLAUDE.md); this file is about widgets.

> Source of truth is **Figma "Capacitor – Xe Consumer"** (fileKey `QYQ433qa5md2QWfkBYCtaQ`). Pull each widget's structure with the Figma MCP `get_design_context` on its variant nodes. Never invent colors, sizes, or fonts — they come from tokens, which come from Figma.

## 1. Content vs. Container (the most important rule)

A widget is split in two:

- **Content component** — the pure widget body (`HeroContent`, `ChartsContent`, …). It reads tokens + fixtures, accepts props, and contains **no outer surface, no margins, and no `layoutId`**. This is what the Playground renders and what gets stress-tested.
- **Container** — supplied by `<WidgetShell variant="mobile" | "desktop">` ([WidgetShell.tsx](src/components/primitives/WidgetShell.tsx)). The XE surface rule, applied to **every** widget:
  - `desktop` → 24px padding · base surface (`bg-surface`) · base stroke (`border-stroke`) — the standard `<Card>`.
  - `mobile` → 16px padding · surface level-1 (`bg-surface-1`) · **no border**.
  - `bare` → self-contained widgets that bring their own surface (e.g. Send Again's pinned fill) opt out of the shell surface entirely (just the morph wrapper) so they don't end up card-in-card.

The same content in two shells = **"same structure, different container."** A content component may read `useWidgetContainer()` (`"mobile" | "desktop"`) for *minor* responsive tweaks (e.g. desktop pills vs mobile round actions) — never fork the component.

```tsx
// ✅ content is pure; the view (or Playground) chooses the shell
<WidgetShell variant="desktop" layoutId="hero"><HeroContent {...props} /></WidgetShell>
```

## 2. The cross-view morph (don't break it)

Switching views (mobile ↔ desktop ↔ bento) **morphs** a widget between its containers via a shared `layoutId` under `<LayoutGroup>`. Rules:

- The **view composition** assigns `layoutId` (passed through `WidgetShell`), never the content component.
- A widget that appears in multiple views uses the **same `layoutId`** across them so it morphs.
- The **Playground renders without `layoutId`** (it shows many copies) — never add `layoutId` inside a content component.

## 3. Anatomy

Compose from these parts (most are optional):

| Part | Use | Primitive |
|---|---|---|
| Section title / eyebrow | small uppercase label above a widget | `Eyebrow` (`chevron` if it links) |
| Container | surface + padding | `WidgetShell` → `Card` (use `flush` for tables/media that manage their own padding) |
| Header row | title + subtitle, or flags + label | composed (title = `font-display`, subtitle = `text-content-secondary`) |
| Body | list rows / amount block / chart / media / table | `CurrencyRow`, `RollingNumber`, `RateAreaChart`, `Placeholder` |
| Emblem | circular flag / initials / icon | `Figure` |
| Status badge | success/warning/info pill | `Pill` |
| Footer CTA | primary/secondary action | `Button` |

**Always reuse primitives** (`Card, Eyebrow, CurrencyRow, Figure, Button, Pill, RollingNumber, Icon, RateAreaChart`). Don't re-implement a row, badge, or animated number by hand.

Shared widget primitives:
- **`FlagStack`** ([FlagStack.tsx](src/components/primitives/FlagStack.tsx)) — overlapping flags with a real circular **mask cutout** (no faux ring). Use it **everywhere flags stack** (Hero, Rate Watch, balances). A single flag has no border/cutout.
- **`AssetIcon`** ([AssetIcon.tsx](src/components/primitives/AssetIcon.tsx)) — renders a real Figma icon SVG from `/public/assets/icons/<name>.svg` via a CSS mask painted with the current text colour (themes correctly). Use this for exact Figma-parity icons; the inline `<Icon>` set stays for generic UI glyphs. Exported icon SVGs are normalized to a centered square viewBox (~78% glyph fill) so the `size` prop drives a consistent visual size — keep new exports normalized.
- Need a generic UI glyph not in either set? Add it to the `IconName`/`PATHS` registry in `Icon.tsx` — never inline a one-off SVG.

## 4. Tokens only — never hardcode

Every visual value comes from a token (see the registry in `src/lib/tokens/` and `globals.css`). Use the generated utilities:

- **Text:** `text-content` / `text-content-secondary` / `text-content-tertiary`; status `text-success-on-muted` etc.
- **Titles:** `font-display` (Instrument Sans). **Body:** `font-sans` (Zalando). **Numerals** render in Roboto Mono automatically (digits-only font). **Accent:** `font-serif` (Instrument Serif italic).
- **Surface:** `bg-surface` / `bg-surface-1` / `bg-surface-adaptive`; status `bg-success-muted` etc.
- **Stroke:** `border-stroke`. **Radius:** `rounded-card` / `rounded-xl` / `rounded-full`. **Brand:** `bg-brand-blue-bright` (primary CTA).
- **Spacing:** the 4/8px scale (`gap-2/3/4/6`, `p-6`). No raw px.

If you reach for a raw hex or px, a token is missing — add it to the registry instead. A token change must look right in **both light and dark** (dark values are desaturated tonal variants, never inverted).

## 5. Data & variants

- Content comes from `src/lib/fixtures.ts` (add a fixture there, not literals). Every stressable value is a **prop with a default**, so the Playground can drive it.
- Expose **named variants as props** (mirroring Figma variant names) — e.g. `align`, `showActions`, `count`, `fillHeight`, `variant`. Register the widget's controls + presets in `src/lib/playground/registry.tsx`.

## 6. Motion

- Entrance: inherit `cardVariants` by being a child of a `motion` group — don't inline entrance transitions.
- Use the shared springs in `src/lib/motion.ts`. Micro-interactions **150–300ms**; **exit ≈60–70% of enter**; list stagger **30–50ms**; animate **transform/opacity only**; animations must be **interruptible**.
- Always honor `prefers-reduced-motion` (`useReducedMotion`), as existing components do.

## 7. Pre-delivery checklist (run before PR — every widget)

Adopted from Apple HIG / Material via `ui-ux-pro-max`. Where a rule conflicts with Figma, **Figma wins** and the exception is noted in code.

**Visual**
- [ ] SVG icons only (no emoji as a structural icon; flag emoji fallback in `assets.ts` is data, allowed).
- [ ] One icon family; semantic tokens only; no hardcoded hex/px.
- [ ] Pressed/active states don't shift layout bounds.

**Interaction**
- [ ] Pressed feedback ≤150ms; `cursor-pointer` on clickables; `touch-action: manipulation`.
- [ ] Touch targets ≥44×44pt (iOS) / 48×48dp (Android).
- [ ] Disabled = reduced opacity (0.38–0.5) + non-interactive + correct attribute.

**Light / Dark**
- [ ] Primary text ≥4.5:1, secondary ≥3:1; borders visible in both.
- [ ] Modal/sheet scrim 40–60% black. Tested in both themes.

**Layout**
- [ ] Renders in both mobile and desktop shells; no horizontal scroll on mobile.
- [ ] Breakpoints 375 / 768 / 1024 / 1440; `min-h-dvh` over `100vh`; 4/8px rhythm; safe areas respected.
- [ ] ≥16px body text on mobile.

**A11y**
- [ ] Visible focus rings (2–4px); keyboard order = visual order.
- [ ] `aria-label` on icon-only buttons; sequential headings; color never the sole indicator.
- [ ] `prefers-reduced-motion` honored.

**Plumbing**
- [ ] Pure content component (no outer surface / no `layoutId`); container via `WidgetShell`.
- [ ] Fixtures-driven; stressable props with defaults; registered in the Playground with controls + presets.
