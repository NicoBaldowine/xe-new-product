import Image from "next/image";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { logoLightSrc, logoDarkSrc } from "@/lib/assets";
import { cn } from "@/lib/cn";

export type NavItem = {
  label: string;
  icon: IconName;
  active?: boolean;
  /** Renders an external-link glyph on the right (opens elsewhere). */
  external?: boolean;
};

/** Default navigation — the corporate (business) web app. */
export const CORPORATE_NAV: NavItem[] = [
  { label: "Home", icon: "home", active: true },
  { label: "Currency accounts", icon: "wallet" },
  { label: "Recipients", icon: "users" },
  { label: "Ledger view", icon: "ledger" },
  { label: "Transactions", icon: "convert" },
  { label: "Payments", icon: "dollar" },
  { label: "Payment Methods", icon: "card" },
  { label: "Market Orders", icon: "chart" },
  { label: "Rate Alerts", icon: "bell" },
  { label: "Help Center", icon: "help" },
];

/**
 * Persistent left sidebar — XE logo + primary navigation. Lives outside the
 * bento blocks since it's chrome for the web-app shell, not a card. The nav
 * content is passed in so consumer and corporate can share one component.
 */
export function Sidebar({ items = CORPORATE_NAV }: { items?: NavItem[] }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-7 border-r border-stroke px-4 py-6">
      <div className="px-2">
        {/* Theme-aware logo: blue wordmark on light, white on dark. Toggled via
            the `.dark` class on <html> (pure CSS, no flash). */}
        <Image src={logoLightSrc} alt="XE" width={48} height={48} className="dark:hidden" priority unoptimized />
        <Image src={logoDarkSrc} alt="XE" width={48} height={48} className="hidden dark:block" priority unoptimized />
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5",
              "font-display text-body-sm font-medium transition-colors",
              item.active
                ? "bg-surface-1 text-content"
                : "text-content-secondary hover:bg-surface-1 hover:text-content",
            )}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
            {item.external && (
              <Icon name="external" size={16} className="ml-auto text-content-tertiary" />
            )}
          </a>
        ))}
      </nav>
    </aside>
  );
}
