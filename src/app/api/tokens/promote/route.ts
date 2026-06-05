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

/** Replace `light: "…"` / `dark: "…"` on the single line declaring this token. */
function patchRegistry(src: string, token: string, key: "light" | "dark", value: string): string {
  const lines = src.split("\n");
  const idx = lines.findIndex((l) => l.includes(`name: "${token}"`));
  if (idx === -1) return src;
  const re = new RegExp(`(${key}:\\s*")[^"]*(")`);
  if (re.test(lines[idx])) lines[idx] = lines[idx].replace(re, `$1${value}$2`);
  return lines.join("\n");
}

/** Replace `<cssVar>: <value>;` within a CSS block. */
function patchCssVar(block: string, cssVar: string, value: string): string {
  const re = new RegExp(`(${escapeRe(cssVar)}:\\s*)[^;]*(;)`);
  return re.test(block) ? block.replace(re, `$1${value}$2`) : block;
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
  const darkAt = region.indexOf(".dark");
  let lightPart = region.slice(0, darkAt);
  let darkPart = region.slice(darkAt);

  let count = 0;
  const unknown: string[] = [];
  for (const [name, edit] of Object.entries(edits)) {
    const def = TOKEN_BY_NAME[name];
    if (!def || !edit) {
      if (!def) unknown.push(name);
      continue;
    }
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

  return Response.json({ ok: true, count, ...(unknown.length ? { unknown } : {}) });
}
