import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Figure } from "@/components/primitives/Figure";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { Pill } from "@/components/primitives/Pill";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";

/** Status tones map to the Pill tones; "neutral" renders no pill. */
type TxStatus = "in-progress" | "received" | "added" | "card" | "neutral";

type Transaction = {
  /** Recipient / merchant / account name. */
  name: string;
  /** Status label + date, e.g. "In progress · May 13". */
  sub: string;
  /** Right-aligned amount, e.g. "100 EUR" / "+20 USD". */
  amount: string;
  /** Drives the status pill (when shown) and the fallback emblem icon. */
  status?: TxStatus;
  /** Avatar initials (people-to-person rows). */
  initials?: string;
  /** Icon emblem instead of initials (merchant / system rows). */
  icon?: IconName;
};

type Variant = "All" | "Empty" | "Only Balance";

type TransactionsProps = {
  /** Figma variant: All (mixed activity) · Empty (no activity) · Only Balance (repeated balance rows). */
  variant?: Variant;
  /** Section label above the list. */
  title?: string;
  /** Rows to render (ignored for the Empty variant). */
  rows?: Transaction[];
  /** Show a status Pill in each row's title line. */
  showStatusPill?: boolean;
  /** Empty-state copy. */
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyCta?: string;
  className?: string;
};

const STATUS_META: Record<
  Exclude<TxStatus, "neutral">,
  { label: string; tone: "success" | "warning" | "info"; icon: IconName }
> = {
  "in-progress": { label: "In progress", tone: "info", icon: "clock" },
  received: { label: "Received", tone: "success", icon: "arrowUp" },
  added: { label: "Added", tone: "info", icon: "plus" },
  card: { label: "Spent", tone: "warning", icon: "card" },
};

// Demo defaults — local to this file (do NOT edit src/lib/fixtures.ts).
const ALL_ROWS: Transaction[] = [
  { name: "To Matias", sub: "In progress · May 13", amount: "100 EUR", status: "in-progress", initials: "MS" },
  { name: "China Cafe", sub: "Card · May 06", amount: "76.50 EUR", status: "card", icon: "bag" },
  { name: "From Javo", sub: "Received · Feb 13", amount: "100 EUR", status: "received", initials: "JE" },
  { name: "To US account", sub: "Added · Jan 13", amount: "+20 USD", status: "added", icon: "plus" },
  { name: "BrightPath Financial", sub: "Card · Dec 06, 2025", amount: "1,000 USD", status: "card", icon: "building" },
];

const ONLY_BALANCE_ROWS: Transaction[] = Array.from({ length: 5 }, () => ({
  name: "To US account",
  sub: "Added · Jan 13",
  amount: "+20 USD",
  status: "added" as const,
  icon: "plus" as IconName,
}));

function Emblem({ row }: { row: Transaction }) {
  if (row.initials) return <Figure size={40} initials={row.initials} />;
  const icon = row.icon ?? (row.status && row.status !== "neutral" ? STATUS_META[row.status].icon : "ledger");
  return (
    <Figure size={40} className="bg-surface-1 text-content-secondary">
      <Icon name={icon} size={20} />
    </Figure>
  );
}

function TransactionRow({ row, showStatusPill }: { row: Transaction; showStatusPill: boolean }) {
  const meta = row.status && row.status !== "neutral" ? STATUS_META[row.status] : null;
  return (
    <div className="flex items-center gap-4 py-2.5">
      <Emblem row={row} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate font-display text-base font-medium text-content">{row.name}</p>
          {showStatusPill && meta && (
            <span className="shrink-0">
              <Pill tone={meta.tone}>{meta.label}</Pill>
            </span>
          )}
        </div>
        <p className="truncate text-sm text-content-secondary">{row.sub}</p>
      </div>
      <RollingNumber
        value={row.amount}
        className="shrink-0 font-display text-base font-medium whitespace-nowrap text-content"
      />
    </div>
  );
}

export function Transactions({
  variant = "All",
  title = "Recent activities",
  rows,
  showStatusPill = false,
  emptyTitle = "No activity yet",
  emptySubtitle = "Your transfers will show up here",
  emptyCta = "Make your first transfer",
  className,
}: TransactionsProps = {}) {
  const data = rows ?? (variant === "Only Balance" ? ONLY_BALANCE_ROWS : ALL_ROWS);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Eyebrow chevron>{title}</Eyebrow>

      {variant === "Empty" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
          <Figure size={48} className="bg-surface-1 text-content-secondary">
            <Icon name="clock" size={20} />
          </Figure>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-lg font-medium text-content">{emptyTitle}</p>
            <p className="text-sm text-content-secondary">{emptySubtitle}</p>
          </div>
          <Button variant="secondary" className="h-8 rounded-full bg-surface-adaptive px-3 text-xs">
            {emptyCta}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          {data.map((row, i) => (
            <TransactionRow key={`${row.name}-${i}`} row={row} showStatusPill={showStatusPill} />
          ))}
        </div>
      )}
    </div>
  );
}
