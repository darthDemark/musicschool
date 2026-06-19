"use client";

import { useState, type ReactNode } from "react";

interface TabsProps {
  tabs: string[];
  children: (active: string) => ReactNode;
  initial?: string;
}

export function Tabs({ tabs, children, initial }: TabsProps) {
  const [active, setActive] = useState(initial ?? tabs[0]);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors ${
              active === tab
                ? "border-brass font-medium text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pt-5">{children(active)}</div>
    </div>
  );
}

export function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-brass bg-brass/10 text-ink"
          : "border-line bg-white/60 text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
