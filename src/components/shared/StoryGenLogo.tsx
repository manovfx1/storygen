import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGOS = {
  light: { src: "/logos/logo-black.png", width: 846, height: 138 },
  dark: { src: "/logos/logo-white.png", width: 564, height: 132 },
} as const;

/** Shared sidebar logo height — used on all dashboard shell pages */
export const SIDEBAR_LOGO_HEIGHT = 56;

type BackgroundVariant = "light" | "dark";

interface StoryGenLogoProps {
  /** `light` background → black logo; `dark` background → white logo */
  variant: BackgroundVariant;
  className?: string;
  height?: number;
  href?: string;
  priority?: boolean;
}

export default function StoryGenLogo({
  variant,
  className,
  height = 28,
  href,
  priority = false,
}: StoryGenLogoProps) {
  const logo = LOGOS[variant];
  const displayWidth = Math.round((height / logo.height) * logo.width);

  const image = (
    <Image
      src={logo.src}
      alt="StoryGen"
      width={logo.width}
      height={logo.height}
      priority={priority}
      quality={100}
      unoptimized
      className={cn("max-w-none shrink-0 object-contain object-left", className)}
      style={{
        height: `${height}px`,
        width: `${displayWidth}px`,
      }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
