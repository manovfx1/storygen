"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelOption {
  id: string;
  label: string;
}

/** Shared prompt dimensions for Image + Video generation pages */
export const GENERATION_PROMPT_ROWS = 3;
export const GENERATION_PROMPT_TEXTAREA_CLASS = "min-h-[300px]";
/** Sized so the full video prompt card matches the image prompt card height */
export const GENERATION_VIDEO_PROMPT_TEXTAREA_CLASS = "min-h-[228px]";

interface PromptAreaProps {
  value: string;
  onChange: (value: string) => void;
  onEnhance: () => void;
  enhancing?: boolean;
  models?: ModelOption[];
  selectedModel?: string | null;
  onModelChange?: (id: string) => void;
  placeholder?: string;
  rows?: number;
  textareaClassName?: string;
  headerSlot?: React.ReactNode;
  showLabel?: boolean;
  enhanceLabel?: string;
}

export default function PromptArea({
  value,
  onChange,
  onEnhance,
  enhancing = false,
  models = [],
  selectedModel,
  onModelChange,
  placeholder = "",
  rows = 5,
  textareaClassName,
  headerSlot,
  showLabel = true,
  enhanceLabel = "Prompt Enhancer",
}: PromptAreaProps) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="p-1">
        {showLabel && (
          <p className="px-3 pb-1 pt-2 font-urbanist text-xs font-medium text-text-muted">
            Your Prompt
          </p>
        )}
        {headerSlot}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-text placeholder-text-dim focus:outline-none",
            textareaClassName
          )}
        />
      </div>
      <div className="flex flex-nowrap items-center justify-between gap-2 px-3 pb-3 pt-1">
        <div className="flex flex-nowrap items-center gap-1.5">
          {models.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => onModelChange?.(model.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                  isSelected
                    ? "border border-accent/40 bg-accent/15 text-accent"
                    : "glass-chip text-text-muted hover:border-accent/25 hover:text-text"
                )}
              >
                {model.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onEnhance}
          disabled={enhancing || !value.trim()}
          className={cn(
            "btn-enhancer flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
            (enhancing || !value.trim()) && "cursor-not-allowed opacity-70"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {enhancing ? "Enhancing..." : enhanceLabel}
        </button>
      </div>
    </div>
  );
}
