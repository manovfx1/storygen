"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  label?: string;
}

export default function GenerateButton({
  onClick,
  loading = false,
  className,
  label = "Generate",
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "btn-generate flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold",
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        label
      )}
    </button>
  );
}
