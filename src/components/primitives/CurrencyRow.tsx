import { Figure } from "./Figure";
import { RollingNumber } from "./RollingNumber";

/** flag + name/code + amount — used in Rate Watch, Accounts, Recent Activities. */
export function CurrencyRow({
  flag,
  initials,
  name,
  sub,
  amount,
  emblem,
}: {
  flag?: string;
  initials?: string;
  name: string;
  sub?: string;
  amount: string;
  emblem?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {emblem ?? <Figure flag={flag} initials={initials} size={36} />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-body-sm font-medium text-content">{name}</p>
        {sub && <p className="truncate text-xs text-content-secondary">{sub}</p>}
      </div>
      <RollingNumber
        value={amount}
        className="font-sans text-body-sm font-semibold whitespace-nowrap text-content"
      />
    </div>
  );
}
