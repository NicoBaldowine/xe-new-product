"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Color-theme switch as a segmented control (Sun | Moon), mirroring the
 * ViewToggle on the left so the header reads as one consistent line: both
 * options are always visible and the active theme gets the sliding pill.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function set(next: boolean) {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("xe-theme", next ? "dark" : "light");
    } catch {}
  }

  // Before mount we render light as active (matches the SSR default); the mount
  // effect corrects it and the pill animates into place.
  const isDark = mounted && dark;
  const options = [
    { value: "light" as const, label: "Light theme", icon: <SunIcon /> },
    { value: "dark" as const, label: "Dark theme", icon: <MoonIcon /> },
  ];

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex items-center gap-1 rounded-full border border-stroke bg-surface-1 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === (isDark ? "dark" : "light");
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            aria-pressed={active}
            title={opt.label}
            onClick={() => set(opt.value === "dark")}
            className={cn(
              "relative grid h-9 w-9 place-items-center rounded-full transition-colors",
              active ? "text-content" : "text-content-secondary hover:text-content",
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                transition={snappy}
                className="absolute inset-0 rounded-full bg-surface shadow-sm"
              />
            )}
            <span className="relative z-10">{opt.icon}</span>
          </button>
        );
      })}
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
