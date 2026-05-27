import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Palette, Monitor } from "lucide-react";

function FeatureCardButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-accent/12 shadow-sm transition-colors group-hover:bg-accent/20">
      {children}
    </div>
  );
}

const cardIconPosition = {
  position: "absolute" as const,
  right: 0,
  bottom: 0,
  opacity: 0.05,
};

const cardIconFilter = {
  filter:
    "brightness(0) saturate(100%) invert(58%) sepia(69%) saturate(456%) hue-rotate(93deg) brightness(95%) contrast(92%)",
};

const cardIconClass =
  "pointer-events-none h-32 w-32 object-contain object-right-bottom sm:h-36 sm:w-36";

export default function DashboardPage() {
  return (
    <DashboardLayout lockViewport>
      <div className="flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
        <div className="animate-fade-in mb-4 w-full max-w-[960px] text-center sm:mb-5">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-urbanist text-xs text-text-muted glass-chip sm:text-[13px]">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI-powered Creativity
          </span>
          <h1 className="mb-3 font-urbanist text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            Create. Imagine.
            <br />
            <span className="text-accent">Inspire.</span>
          </h1>
          <p className="mx-auto max-w-md font-inter text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]">
            Generate stunning images and videos
            <br />
            with the power of AI
          </p>
        </div>

        <div className="mb-4 grid w-full max-w-[960px] shrink-0 grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/image-generation"
            className="group relative min-h-[120px] overflow-hidden rounded-xl glass-feature-card transition-all duration-300 hover:border-accent/20 sm:min-h-[160px] sm:rounded-2xl"
          >
            <Image
              src="/images/photo-frame.png"
              alt=""
              width={160}
              height={160}
              className={cardIconClass}
              style={{ ...cardIconPosition, ...cardIconFilter }}
            />
            <div className="relative flex min-h-[120px] flex-col p-3 sm:min-h-[160px] sm:p-6">
              <h3 className="font-urbanist text-sm font-semibold leading-tight text-white sm:text-[1.35rem]">
                Image Generation
              </h3>
              <p className="mt-1 max-w-[240px] font-inter text-[11px] leading-snug text-accent sm:mt-1.5 sm:text-sm sm:leading-relaxed">
                Create beautiful, high-Quality images in seconds
              </p>
              <div className="mt-auto pt-4">
                <FeatureCardButton>
                  <ArrowRight className="h-4 w-4 text-accent" strokeWidth={2} />
                </FeatureCardButton>
              </div>
            </div>
          </Link>

          <Link
            href="/video-generation"
            className="group relative min-h-[120px] overflow-hidden rounded-xl glass-feature-card transition-all duration-300 hover:border-accent/20 sm:min-h-[160px] sm:rounded-2xl"
          >
            <Image
              src="/images/camera-video.png"
              alt=""
              width={160}
              height={160}
              className={cardIconClass}
              style={{ ...cardIconPosition, ...cardIconFilter }}
            />
            <div className="relative flex min-h-[120px] flex-col p-3 sm:min-h-[160px] sm:p-6">
              <h3 className="font-urbanist text-sm font-semibold leading-tight text-white sm:text-[1.35rem]">
                Video Generation
              </h3>
              <p className="mt-1 max-w-[240px] font-inter text-[11px] leading-snug text-accent sm:mt-1.5 sm:text-sm sm:leading-relaxed">
                Upload images into cinematic stunning videos in seconds
              </p>
              <div className="mt-auto pt-4">
                <FeatureCardButton>
                  <Play className="h-4 w-4 fill-accent text-accent" strokeWidth={0} />
                </FeatureCardButton>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex w-full max-w-[960px] shrink-0 flex-wrap justify-center gap-2.5 sm:gap-3">
          {[
            { icon: Sparkles, label: "Prompt Enhancer", sub: "Improve your Prompt" },
            {
              icon: Palette,
              label: "Style & Tone",
              sub: "Cinematic, Realistic, Anime & more",
            },
            { icon: Monitor, label: "Social media", sub: "choose variety of size" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 glass-card sm:gap-3 sm:px-5 sm:py-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg glass-chip sm:h-8 sm:w-8">
                <Icon className="h-3.5 w-3.5 text-accent sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="font-urbanist text-xs font-medium text-text sm:text-sm">
                  {label}
                </p>
                <p className="font-inter text-[11px] text-text-muted sm:text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
