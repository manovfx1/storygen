"use client";

import Link from "next/link";
import { Sparkles, User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white/20 hover:bg-[#252525]"
        >
          <Sparkles className="h-3.5 w-3.5 text-white/80" />
          <span>Upgrade to Pro</span>
        </Link>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1c] transition-all hover:border-white/20 hover:bg-[#252525]"
        >
          <User className="h-4 w-4 text-white/70" />
        </button>
      </div>
    </header>
  );
}
