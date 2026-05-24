"use client";

import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
  TikTokIcon,
  FacebookIcon,
} from "./PlatformIcons";

interface Platform {
  id: string;
  name: string;
  ratio: string;
  icon: string;
}

interface PlatformSelectorProps {
  platforms: Platform[];
  selected: string;
  onChange: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
};

export default function PlatformSelector({
  platforms,
  selected,
  onChange,
}: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {platforms.map((platform) => {
        const Icon = iconMap[platform.icon];
        const isSelected = selected === platform.id;
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onChange(platform.id)}
            className={cn(
              "media-btn flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] transition-all duration-200 sm:px-2 sm:text-xs",
              isSelected
                ? "border-accent bg-accent/15 text-text"
                : "glass-surface border-border text-text-muted"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5",
                  isSelected ? "text-accent" : "text-accent/70"
                )}
              />
            )}
            <span className="font-medium">{platform.ratio}</span>
            <span className="truncate">{platform.name}</span>
          </button>
        );
      })}
    </div>
  );
}
