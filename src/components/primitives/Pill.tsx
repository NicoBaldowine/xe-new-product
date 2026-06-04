import { cn } from "@/lib/cn";

type Tone = "success" | "warning" | "info";

const TONES: Record<Tone, string> = {
  success: "bg-success-muted text-success-on-muted",
  warning: "bg-warning-muted text-warning-on-muted",
  info: "bg-info-muted text-info-on-muted",
};

/** Status badge — e.g. "Completed" (success) / "Action required" (warning). */
export function Pill({ tone = "info", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1",
        "font-display text-xs font-medium whitespace-nowrap",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
