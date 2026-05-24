"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Image as ImageIcon, Video, FolderOpen, Settings } from "lucide-react";
import StoryGenLogo, { SIDEBAR_LOGO_HEIGHT } from "@/components/shared/StoryGenLogo";

const MOUNTAIN_LOGO_SRC = "/Images/Mountain Logo.png";

const navItems = [
  { href: "/dashboard", label: "Home Page", icon: Home },
  { href: "/image-generation", label: "Image Generation", icon: ImageIcon },
  { href: "/video-generation", label: "Video Generation", icon: Video },
  { href: "/my-creations", label: "My creation", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative sticky top-0 flex h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-border/60 glass-panel">
      {/* Green glow overlay — preserved sidebar effect */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-36 bg-green-glow opacity-10"
        aria-hidden
      />

      {/* Mountain logo — flush bottom-left, scaled ~140% */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] m-0 origin-bottom-left scale-[1.4] p-0 leading-none"
        aria-hidden
      >
        <Image
          src={MOUNTAIN_LOGO_SRC}
          alt=""
          width={315}
          height={179}
          sizes="268px"
          className="block h-auto w-[80%] max-w-none object-contain object-left-bottom opacity-80"
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex h-16 items-center justify-start px-5">
        <StoryGenLogo variant="dark" height={SIDEBAR_LOGO_HEIGHT} priority />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200",
                isActive
                  ? "glass-border-glow border-l-2 border-accent bg-accent/10 text-text backdrop-blur-sm"
                  : "text-text-muted hover:bg-white/[0.04] hover:text-text hover:backdrop-blur-sm"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 text-accent",
                  !isActive && "opacity-70"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
