import type { ReactNode } from "react";
import { Hero } from "@/components/widgets/Hero";
import { Charts } from "@/components/widgets/Charts";
import { SendMoneyFlow } from "@/components/widgets/SendMoneyFlow";
import { Convert } from "@/components/widgets/Convert";
import { Transactions } from "@/components/widgets/Transactions";
import { SendAgain } from "@/components/widgets/SendAgain";
import { InProgress } from "@/components/widgets/InProgress";
import { GettingStarted } from "@/components/widgets/GettingStarted";
import { MktCard } from "@/components/widgets/MktCard";

/**
 * The consumer dashboard, defined ONCE as widget content + a stable `layoutId`.
 * The mobile and desktop views render this same set through <WidgetShell> in
 * different containers, and the shared `layoutId` lets each widget morph between
 * its phone-cell and its desktop card when the view toggles.
 */
export type ConsumerWidget = {
  id: string;
  el: ReactNode;
  /** Self-contained widget (brings its own surface) → render without the shell card. */
  bare?: boolean;
  /** Like `bare`, but only in the mobile frame (keeps its desktop card). */
  bareMobile?: boolean;
};

/** Top-of-screen hero — bare (no card): full-bleed, blends into the device top. */
export const HERO_WIDGET: ConsumerWidget = { id: "c-hero", el: <Hero variant="balance" />, bare: true };

/** Left desktop column / upper mobile stack. */
export const PRIMARY_WIDGETS: ConsumerWidget[] = [
  { id: "c-smf", el: <SendMoneyFlow />, bareMobile: true },
  { id: "c-in-progress", el: <InProgress variant="In progress" /> },
  { id: "c-transactions", el: <Transactions variant="All" /> },
  { id: "c-charts", el: <Charts /> },
];

/** Right desktop column / lower mobile stack. */
export const SECONDARY_WIDGETS: ConsumerWidget[] = [
  { id: "c-send-again", el: <SendAgain /> },
  { id: "c-getting-started", el: <GettingStarted /> },
  { id: "c-convert", el: <Convert /> },
  { id: "c-mkt", el: <MktCard variant="Large" /> },
];

/** Mobile stack order (interleaves the two columns into one scroll). */
export const MOBILE_ORDER: ConsumerWidget[] = [
  HERO_WIDGET,
  PRIMARY_WIDGETS[0], // send money flow
  SECONDARY_WIDGETS[0], // send again
  PRIMARY_WIDGETS[1], // in progress
  PRIMARY_WIDGETS[2], // transactions
  PRIMARY_WIDGETS[3], // charts
  SECONDARY_WIDGETS[2], // convert
  SECONDARY_WIDGETS[1], // getting started
  SECONDARY_WIDGETS[3], // mkt
];
