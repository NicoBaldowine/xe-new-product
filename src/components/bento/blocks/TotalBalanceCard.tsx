import { Card } from "@/components/primitives/Card";
import { Button } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { cn } from "@/lib/cn";
import { totalBalance as data } from "@/lib/fixtures";

type TotalBalanceCardProps = {
  amount?: string;
  /** Hide the Create account / Send money buttons (e.g. the consumer row). */
  showActions?: boolean;
  /** "left" stacks flags → label → amount against the leading edge. */
  align?: "center" | "left";
  className?: string;
};

export function TotalBalanceCard({
  amount = data.amount,
  showActions = true,
  align = "center",
  className,
}: TotalBalanceCardProps = {}) {
  const left = align === "left";

  const flags = (
    <div className="flex">
      {data.flags.map((f, i) => (
        <Figure key={f} flag={f} ring className={i > 0 ? "-ml-2" : ""} />
      ))}
    </div>
  );

  const text = (
    <div className={cn("flex flex-col gap-2", left ? "items-start" : "items-center")}>
      <Eyebrow>{data.label}</Eyebrow>
      <RollingNumber
        value={amount}
        className="font-sans text-3xl font-semibold tracking-[-0.04em] text-content"
      />
    </div>
  );

  return (
    <Card
      layoutId="total-balance"
      className={cn(
        "flex flex-col gap-6",
        left ? "items-start text-left" : "items-center text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", left ? "items-start" : "items-center")}>
        {/* Left variant leads with the flags; centered variant trails with them. */}
        {left ? (
          <>
            {flags}
            {text}
          </>
        ) : (
          <>
            {text}
            {flags}
          </>
        )}
      </div>
      {showActions && (
        <div className="flex w-full gap-2">
          <Button icon="plus" full>
            Create account
          </Button>
          <Button icon="send" variant="primary" full>
            Send money
          </Button>
        </div>
      )}
    </Card>
  );
}
