# XE Design System

The **source of truth for XE's look & feel** and the **bridge between product design and engineering**. It's not a product — it's a living design system you can *operate*: edit tokens, watch them ripple through real widgets across products and themes, and export the result for both Figma and code.

It ships as a single-page app with three things in one:

1. **A token system** — one typed registry ([`src/lib/tokens/registry.ts`](src/lib/tokens/registry.ts)) drives every colour, type style, radius, etc. Two tiers: primitive **foundations** (`size-*`, `leading-*`, `tracking-*`, `weight-*`) and **semantic** tokens (`content-*`, `surface-*`, `action-*`, `utility-*`, typesets `text-h1`…`text-caption`) that reference them.
2. **A shared block library** — the same widgets compose four product views, proving the system holds together.
3. **A Playground + live token editor** — stress any widget with live controls, edit tokens per theme, and export.

```bash
npm install
npm run dev      # http://localhost:3000
```

The top bar drives everything: **view switcher** (left) · **Shuffle / theme / token editor** (right).

| View | What it is |
|---|---|
| **Bento** | Cinematic masonry of every block — the showcase. **Shuffle** re-composes it. |
| **Mobile** | The consumer app in a phone frame. |
| **Desktop (consumer)** | The consumer web app shell. |
| **Desktop (corporate)** | The corporate web app shell. |
| **Playground** | The interactive sandbox (see below). |

Light/dark is the sun/moon segmented control in the header.

---

## 🎨 For designers

You can change the brand and see it everywhere, instantly — no code.

**Edit tokens live.** Click the **sliders icon** (top-right) to open the token editor. Pick **Light / Dark / Both**, then edit any token — colours (swatch + hex, alpha supported), type scale, font family, radius, blur. Changes apply to every widget in every view in real time. Aliased tokens (e.g. a typeset's size) show a `→ foundation` chip and are edited on the foundation, so one change cascades correctly.

**Try data, not just style.** Open the **Playground** view → pick a widget → drive its inputs with the **Controls** panel (currency, amount, text length, count, states, container). Use **presets** to load a Figma variant, switch **Mobile / Desktop / Both**, and flip the per-stage theme to preview a single component in the opposite theme of the rest of the page.

**Save & compare.** The editor's **Versions** section snapshots the current edits as a named source of truth you can restore.

**Export to Figma.** The **Export** button offers formats made to round-trip into design:
- **W3C DTCG** — Figma's own dialect (colour value objects + `com.figma.codeSyntax.WEB`); import via Figma's variable import or a DTCG plugin.
- **Tokens Studio** — for the Tokens Studio plugin (also turns typesets into text styles).
- **Figma Variables** — REST API payload (Light/Dark modes).
- **Figma Text Styles** — a plugin script that creates text styles bound to the imported primitive variables.

> Typesets export as a single composite `typography` token (font-size + line-height + font-weight + letter-spacing), each property referencing a foundation — exactly the multi-property shape engineering consumes.

---

## 💻 For engineers

**The registry is the source of truth.** [`src/lib/tokens/registry.ts`](src/lib/tokens/registry.ts) is the only place token values live. It generates the `--xe-*` custom properties between the `@generated:tokens` sentinels in [`globals.css`](src/app/globals.css), which the `@theme` block maps to Tailwind utilities.

**Consume tokens, never raw values.** Style with the generated utilities — `bg-surface`, `text-content`, `border-stroke`, `bg-action` (+ `hover:bg-action-hover` / `active:bg-action-pressed`), `text-h1`, `rounded-card`, `tracking-tight`, … Never hardcode a hex/px — if you reach for one, a token is missing; add it to the registry. Dark mode is class-based (`.dark` on `<html>`); components stay theme-agnostic.

**Build widgets, compose views.** Three layers: `primitives/` (token-styled building blocks) → `bento/blocks/` + `widgets/` (self-contained product blocks) → `bento/` (the views that arrange them). A view is a *configuration* over the shared library, not new UI. See the authoring guide in [`design.md`](design.md) and the conventions in [`CLAUDE.md`](CLAUDE.md).

**Register a widget in the Playground.** Add an entry to [`src/lib/playground/registry.tsx`](src/lib/playground/registry.tsx) (`controls`, `presets`, `render`) and it shows up in the catalog with live knobs. `bare: true` renders it edge-to-edge (no shell card).

**"Make global decision" (dev only).** When you edit tokens in the panel, a button promotes those live edits into the source: it writes the new values back to `registry.ts` and the generated `globals.css` block (validated, line-scoped) and clears the override layer — so a designer's tweak becomes the committed default in one click. (Disabled in production.)

**Export for code.** **Tailwind @theme** and **CSS variables** exports emit the two-tier structure with the references intact (e.g. `--text-h1--font-size → --xe-title-h1 → --xe-size-4xl`).

### Stack & fonts

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 (CSS-first `@theme`, no config file) · `motion/react`. Fonts: **Instrument Sans** (titles) · **Zalando Sans** (body) · **Instrument Serif** (accent) · **IBM Plex Sans** (numerals — digits-only via `unicode-range`, so only 0–9 use it and text falls through to the body face).

### Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm start        # serve the build
npm run lint     # eslint
```

There is no test suite; verify with `npm run lint` + `npm run build`, in both themes.

---

See [`CLAUDE.md`](CLAUDE.md) for the full architecture and working agreement, and [`design.md`](design.md) for the widget-authoring guide.
