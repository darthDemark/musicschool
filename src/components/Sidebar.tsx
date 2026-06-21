"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, AudioLines } from "lucide-react";
import clsx from "clsx";
import { navItems, groupOrder } from "@/lib/nav";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      {groupOrder.map((group) => {
        const items = navItems.filter((item) => item.group === group);
        return (
          <div key={group}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={clsx(
                        "group flex items-center gap-3 rounded-lg border-l-2 py-2 pl-2.5 pr-3 text-sm transition-colors",
                        active
                          ? "border-brass bg-white/10 text-ivory"
                          : "border-transparent text-white/60 hover:bg-white/5 hover:text-ivory"
                      )}
                    >
                      <Icon
                        className={clsx(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          active ? "text-brass" : "text-white/45 group-hover:text-brass"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 px-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brass/40 bg-brass/10">
        <AudioLines className="h-5 w-5 text-brass" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-tight text-ivory">Hit Camp</span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          by HitLab
        </span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-charcoal px-4 py-3 lg:hidden">
        <Brand />
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-ivory hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Spacer so content clears the mobile bar */}
      <div className="h-[60px] lg:hidden" />

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[264px] flex-col border-r border-white/10 bg-charcoal lg:flex">
        <div className="px-4 pb-6 pt-6">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <NavLinks />
        </div>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[11px] text-white/40">Hit Camp • Make hit records</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-charcoal">
            <div className="flex items-center justify-between px-4 pb-6 pt-5">
              <Brand />
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-ivory hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
