import { Card } from "@/components/primitives/Card";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { cn } from "@/lib/cn";
import { usAccount as data } from "@/lib/fixtures";

type AccountBalanceCardProps = {
  flag?: string;
  label?: string;
  amount?: string;
  /** Unique when several of these render together (e.g. the consumer row). */
  layoutId?: string;
  /** "left" stacks everything against the leading edge (consumer reference). */
  align?: "center" | "left";
  className?: string;
};

export function AccountBalanceCard({
  flag = data.flag,
  label = data.label,
  amount = data.amount,
  layoutId = "account-balance",
  align = "center",
  className,
}: AccountBalanceCardProps = {}) {
  const left = align === "left";
  return (
    <Card
      layoutId={layoutId}
      className={cn(
        "flex flex-col gap-4",
        left ? "items-start text-left" : "items-center text-center",
        className,
      )}
    >
      <Figure flag={flag} size={44} />
      <div className={cn("flex flex-col gap-1", left ? "items-start" : "items-center")}>
        <Eyebrow chevron>{label}</Eyebrow>
        <RollingNumber
          value={amount}
          className="font-sans text-h3 tracking-[-0.04em] text-content"
        />
      </div>
    </Card>
  );
}
