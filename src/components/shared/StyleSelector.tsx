"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface StyleOption {
  id: string;
  name: string;
  thumbnail: string;
}

interface StyleSelectorProps {
  styles: StyleOption[];
  selected: string;
  onChange: (id: string) => void;
}

export default function StyleSelector({
  styles,
  selected,
  onChange,
}: StyleSelectorProps) {
  return (
    <div className="grid w-full grid-cols-5 gap-2.5">
      {styles.map((style) => {
        const isSelected = selected === style.id;
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "style-card relative aspect-[5/4] w-full overflow-hidden rounded-lg border-2 transition-all duration-200",
              isSelected ? "border-accent" : "border-transparent"
            )}
          >
            <Image
              src={style.thumbnail}
              alt={style.name}
              fill
              className="object-cover"
              sizes="(max-width: 540px) 20vw, 80px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <span
              className={cn(
                "absolute bottom-1.5 left-0 right-0 text-center font-inter text-[10px] font-medium leading-tight sm:text-xs",
                isSelected ? "text-accent" : "text-white"
              )}
            >
              {style.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
