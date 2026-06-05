import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** Small uppercase section label (Instrument Sans), optionally with a chevron. */
export function Eyebrow({
  children,
  chevron = false,
  className,
}: {
  children: React.ReactNode;
  chevron?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-1 font-display text-caption uppercase tracking-wide text-content-secondary",
        className,
      )}
    >
      {children}
      {chevron && <Icon name="chevronRight" size={12} className="text-content-secondary" />}
    </p>
  );
}
