"use client";

import type { TokenDef, Theme } from "@/lib/tokens/types";
import { useTokens } from "./TokenProvider";
import { ColorField } from "./ColorField";
import { DimensionField } from "./DimensionField";
import { FontField } from "./FontField";
import { Icon } from "@/components/primitives/Icon";
import { contrastRatio } from "@/lib/tokens/contrast";
import { cn } from "@/lib/cn";

export type EditMode = "light" | "dark" | "both";

function Field({ token, theme }: { token: TokenDef; theme: Theme }) {
  const { getValue, setValue } = useTokens();
  const value = getValue(token.name, theme);
  const onChange = (v: string) => setValue(token.name, theme, v);
  if (token.type === "color") return <ColorField value={value} onChange={onChange} />;
  if (token.type === "fontFamily") return <FontField value={value} onChange={onChange} />;
  return <DimensionField value={value} onChange={onChange} />;
}

/** Contrast ratio chip for a fg token vs its paired bg, for one theme. */
function ContrastChip({ token, theme }: { token: TokenDef; theme: Theme }) {
  const { getValue } = useTokens();
  if (!token.pairWith) return null;
  const ratio = contrastRatio(getValue(token.name, theme), getValue(token.pairWith, theme));
  if (ratio == null) return null;
  const pass = ratio >= 4.5;
  return (
    <span
      title={`Contrast vs ${token.pairWith} (${theme}): ${ratio.toFixed(2)}:1 — ${pass ? "passes" : "fails"} WCAG AA (4.5:1)`}
      className={cn(
        "rounded px-1 text-[10px] font-medium tabular-nums",
        pass ? "bg-success-muted text-success-on-muted" : "bg-danger-muted text-danger-on-muted",
      )}
    >
      {pass ? "✓" : "⚠"} {ratio.toFixed(1)}
    </span>
  );
}

function UsagePopover({ token, onClose }: { token: TokenDef; onClose: () => void }) {
  const { getValue } = useTokens();
  const isColor = token.type === "color";
  const fg = token.pairWith ? getValue(token.name, "light") : undefined;
  const bg = token.pairWith ? getValue(token.pairWith, "light") : undefined;
  return (
    <div className="absolute right-0 top-6 z-50 w-64 rounded-xl border border-stroke bg-surface p-3 shadow-xl">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-content">{token.name}</span>
        <button type="button" aria-label="Close" onClick={onClose} className="text-content-tertiary hover:text-content">
          <Icon name="plus" size={12} className="rotate-45" />
        </button>
      </div>
      <p className="mb-2 text-xs text-content-secondary">{token.description}</p>

      {/* sample */}
      {isColor && (
        token.pairWith ? (
          <div className="mb-2 flex items-center justify-center rounded-lg py-2 text-sm font-semibold" style={{ background: bg, color: fg }}>
            Aa 123 — sample
          </div>
        ) : (
          <div className="mb-2 h-8 rounded-lg border border-stroke" style={{ background: getValue(token.name, "light") }} />
        )
      )}

      {token.pairWith && (
        <div className="mb-2 flex items-center gap-2 text-[11px] text-content-secondary">
          <span>Contrast vs {token.pairWith}:</span>
          <ContrastChip token={token} theme="light" />
          <ContrastChip token={token} theme="dark" />
        </div>
      )}

      {token.usage && token.usage.length > 0 && (
        <>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-content-tertiary">Used in</p>
          <ul className="flex flex-col gap-0.5">
            {token.usage.map((u) => (
              <li key={u} className="text-xs text-content">• {u}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** One editable token row: label + field(s) for the active theme(s) + reset + usage popover. */
export function TokenRow({
  token,
  mode,
  open,
  onToggle,
}: {
  token: TokenDef;
  mode: EditMode;
  open: boolean;
  onToggle: () => void;
}) {
  const { resetToken, edits } = useTokens();
  const edited = token.name in edits;
  const invariant = token.dark == null;
  const showBoth = mode === "both" && !invariant;

  return (
    <div className="relative flex items-center gap-2 py-1.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate font-mono text-xs text-content" title={token.name}>
            {token.name}
          </span>
          <button
            type="button"
            aria-label={`About ${token.name}`}
            onClick={onToggle}
            className="cursor-help text-content-tertiary hover:text-content"
          >
            <Icon name="help" size={11} />
          </button>
          {token.pairWith && !showBoth && <ContrastChip token={token} theme={invariant ? "light" : (mode as Theme)} />}
          {invariant && (
            <span className="rounded bg-surface-1 px-1 text-[10px] text-content-tertiary" title="Theme-invariant — same in light and dark.">
              fixed
            </span>
          )}
          {edited && (
            <button
              type="button"
              aria-label={`Reset ${token.name}`}
              title="Reset to default"
              onClick={() => resetToken(token.name)}
              className="ml-auto grid h-4 w-4 place-items-center rounded text-content-tertiary hover:text-content"
            >
              <Icon name="convert" size={12} />
            </button>
          )}
        </div>
      </div>
      {showBoth ? (
        <div className="flex w-[232px] shrink-0 gap-2">
          <div className="w-[112px]" title="Light">
            <Field token={token} theme="light" />
          </div>
          <div className="w-[112px]" title="Dark">
            <Field token={token} theme="dark" />
          </div>
        </div>
      ) : (
        <div className="w-44 shrink-0">
          <Field token={token} theme={invariant ? "light" : (mode as Theme)} />
        </div>
      )}

      {open && <UsagePopover token={token} onClose={onToggle} />}
    </div>
  );
}
