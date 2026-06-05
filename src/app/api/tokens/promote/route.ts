import { promises as fs } from "node:fs";
import path from "node:path";
import type { Edits } from "@/lib/tokens/types";
import { TOKEN_BY_NAME } from "@/lib/tokens/registry";

/**
 * Dev-only: promote live token edits into the source of truth.
 *
 * The Tokens panel edits live as a runtime override (localStorage + an injected
 * <style>) — a preview, not a decision. This handler writes those values back
 * into the two files that ARE the decision, with surgical line-scoped patches
 * (each token name / `--xe-*` var is unique, so structure + comments survive):
 *   · src/lib/tokens/registry.ts          → the `light` / `dark` literals.
 *   · src/app/globals.css (@generated…)   → the raw `--xe-*` values the browser uses.
 * The client then clears its override layer — the edit is now the baseline.
 *
 * Only runs under `next dev`; there is no filesystem to write in production.
 */

const REGISTRY = "src/lib/tokens/registry.ts";
const GLOBALS = "src/app/globals.css";
const GEN_START = "/* @generated:tokens-start";
const GEN_END = "/* @generated:tokens-end */";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A function replacer keeps `value` literal — a string replacement would treat
// `$1`/`$&`/`$\`` etc. as special patterns and corrupt the output.
const insert = (value: string) => (_m: string, p1: string, p2: string) => p1 + value + p2;

/** Replace `light: "…"` / `dark: "…"` on the single line declaring this token. */
function patchRegistry(src: string, token: string, key: "light" | "dark", value: string): string {
  const lines = src.split("\n");
  const idx = lines.findIndex((l) => l.includes(`name: "${token}"`));
  if (idx === -1) return src;
  const re = new RegExp(`(${key}:\\s*")[^"]*(")`);
  if (re.test(lines[idx])) lines[idx] = lines[idx].replace(re, insert(value));
  return lines.join("\n");
}

/** Replace `<cssVar>: <value>;` within a CSS block. */
function patchCssVar(block: string, cssVar: string, value: string): string {
  const re = new RegExp(`(${escapeRe(cssVar)}:\\s*)[^;]*(;)`);
  return re.test(block) ? block.replace(re, insert(value)) : block;
}

/**
 * Whitelist a value by token type before it is written into source files —
 * blocks injection: a stray quote, semicolon, brace, comment-terminator or
 * newline could otherwise escape the TS string literal or the generated CSS block.
 */
function isValidValue(type: string, value: string): boolean {
  if (typeof value !== "string" || /[\n\r;{}"]|\*\//.test(value)) return false;
  switch (type) {
    case "color":
      return /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
    case "dimension":
      return /^-?\d*\.?\d+(px|em|rem|%)?$/.test(value);
    case "fontWeight":
      return /^[1-9]00$/.test(value);
    case "fontFamily":
      // var(--font-…) or a comma-separated stack of quoted/bare family names.
      return /^[\w\s,'()./-]+$/.test(value);
    default:
      return false;
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "Disabled in production" }, { status: 403 });
  }

  let edits: Edits;
  try {
    ({ edits } = (await request.json()) as { edits: Edits });
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  if (!edits || typeof edits !== "object") {
    return Response.json({ ok: false, error: "Missing edits" }, { status: 400 });
  }

  const root = process.cwd();
  const registryPath = path.join(root, REGISTRY);
  const globalsPath = path.join(root, GLOBALS);

  let registry = await fs.readFile(registryPath, "utf8");
  const globals = await fs.readFile(globalsPath, "utf8");

  // Carve out the generated CSS region and split it at the `.dark` boundary so
  // light edits patch `:root` and dark edits patch `.dark`.
  const gStart = globals.indexOf(GEN_START);
  const gEnd = globals.indexOf(GEN_END);
  if (gStart === -1 || gEnd === -1) {
    return Response.json({ ok: false, error: "globals.css generated markers not found" }, { status: 500 });
  }
  const region = globals.slice(gStart, gEnd);
  const darkAt = region.search(/\n\.dark[\s,{]/);
  if (darkAt === -1) {
    return Response.json({ ok: false, error: "globals.css `.dark` block not found" }, { status: 500 });
  }
  let lightPart = region.slice(0, darkAt);
  let darkPart = region.slice(darkAt);

  let count = 0;
  const unknown: string[] = [];
  const skipped: string[] = [];
  const invalid: string[] = [];
  for (const [name, edit] of Object.entries(edits)) {
    const def = TOKEN_BY_NAME[name];
    if (!def || !edit) {
      if (!def) unknown.push(name);
      continue;
    }
    // Aliased tokens are read-only — their CSS is `var(--xe-<ref>)`; patching a
    // literal here would sever the alias. Edit the referenced foundation instead.
    if (def.ref) {
      skipped.push(name);
      continue;
    }
    // Reject anything that isn't a clean value for the token's type (injection guard).
    if (edit.light != null && !isValidValue(def.type, edit.light)) { invalid.push(name); continue; }
    if (edit.dark != null && !isValidValue(def.type, edit.dark)) { invalid.push(name); continue; }
    if (edit.light != null) {
      registry = patchRegistry(registry, name, "light", edit.light);
      lightPart = patchCssVar(lightPart, def.cssVar, edit.light);
    }
    if (edit.dark != null && def.dark != null) {
      registry = patchRegistry(registry, name, "dark", edit.dark);
      darkPart = patchCssVar(darkPart, def.cssVar, edit.dark);
    }
    count++;
  }

  const nextGlobals = globals.slice(0, gStart) + lightPart + darkPart + globals.slice(gEnd);

  await fs.writeFile(registryPath, registry, "utf8");
  await fs.writeFile(globalsPath, nextGlobals, "utf8");

  return Response.json({
    ok: true,
    count,
    ...(unknown.length ? { unknown } : {}),
    ...(skipped.length ? { skipped } : {}),
    ...(invalid.length ? { invalid } : {}),
  });
}
