import { Card } from "@/components/primitives/Card";
import { IsoIllustration } from "@/components/primitives/Placeholder";
import { verifyId as data } from "@/lib/fixtures";

export function VerifyIdCard() {
  return (
    <Card
      layoutId="verify-id"
      className="flex flex-1 flex-col items-center justify-center gap-5 text-center"
    >
      <IsoIllustration className="h-32 w-full" />
      <p className="font-display text-lg font-semibold text-content">{data.title}</p>
    </Card>
  );
}
