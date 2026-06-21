"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";

/**
 * Desktop top bar (search + notifications) matching the Hit Camp shell.
 * Search routes to the lessons/disciplines area; bell is a placeholder.
 */
export function TopBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lightweight: jump to the disciplines explorer on the home page.
    router.push("/#disciplines");
  };

  return (
    <div className="mb-6 hidden items-center gap-3 lg:flex">
      <form onSubmit={submit} className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lessons, topics, skills…"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-brass/50 focus:ring-1 focus:ring-brass/30"
        />
      </form>
      <button
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition-colors hover:text-ink"
      >
        <Bell className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
