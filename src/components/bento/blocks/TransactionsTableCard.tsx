import { Card } from "@/components/primitives/Card";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { Pill } from "@/components/primitives/Pill";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { convert, formatAmount } from "@/lib/currency";
import { transactions as rows } from "@/lib/fixtures";

const COLS = "grid grid-cols-[minmax(0,1fr)_auto_120px_120px] items-center gap-4";

/** Small status badge pinned to the bottom-right of the avatar. */
function StatusBadge({ status }: { status: "action" | "completed" }) {
  const completed = status === "completed";
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full ring-2 ring-surface ${
        completed ? "bg-success-muted text-success-on-muted" : "bg-info-muted text-info-on-muted"
      }`}
      style={{ width: 18, height: 18 }}
    >
      <Icon name={completed ? "check" : "clock"} size={11} />
    </span>
  );
}

export function TransactionsTableCard() {
  return (
    <Card layoutId="transactions" flush className="overflow-hidden">
      <div
        className={`${COLS} border-b border-stroke px-6 py-3 font-display text-xs font-medium uppercase tracking-wide text-content-secondary`}
      >
        <span>Details</span>
        <span>Status</span>
        <span className="text-right">Recipient gets</span>
        <span className="text-right">You sell</span>
      </div>
      {rows.map((tx, i) => {
        const youSell = convert(tx.recipientGets, tx.recipientCurrency, tx.youSellCurrency);
        return (
        <div
          key={i}
          className={`${COLS} px-6 py-3 ${i < rows.length - 1 ? "border-b border-stroke" : ""}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative inline-flex shrink-0">
              <Figure initials={tx.initials} size={36} />
              <StatusBadge status={tx.status} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-medium text-content">{tx.name}</p>
              <p className="truncate text-xs text-content-secondary">{tx.date}</p>
            </div>
          </div>
          <Pill tone={tx.status === "completed" ? "success" : "warning"}>{tx.statusLabel}</Pill>
          <span className="flex items-center justify-end gap-1.5 font-sans text-sm font-semibold text-content">
            <RollingNumber value={formatAmount(tx.recipientGets)} />
            <Figure flag={tx.recipientCurrency} size={20} />
          </span>
          <span className="flex items-center justify-end gap-1.5 font-sans text-sm font-semibold text-content">
            <RollingNumber value={formatAmount(youSell)} />
            <Figure flag={tx.youSellCurrency} size={20} />
          </span>
        </div>
        );
      })}
    </Card>
  );
}
