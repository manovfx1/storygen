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
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/12 shadow-sm transition-colors group-hover:bg-accent/20">
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

const imageCardIconClass =
  "pointer-events-none h-40 w-40 object-contain object-right-bottom sm:h-44 sm:w-44";

const videoCardIconClass =
  "pointer-events-none h-40 w-40 object-contain object-right-bottom sm:h-44 sm:w-44";

export default function DashboardPage() {
  return (
    <DashboardLayout lockViewport>
      <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center px-8 pb-16 pt-12 md:pt-16 lg:pt-20">
        {/* Hero */}
        <div className="animate-fade-in mb-12 text-center md:mb-14 lg:mb-16">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 font-urbanist text-[13px] text-text-muted glass-chip">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI-powered Creativity
          </span>
          <h1 className="mb-5 font-urbanist text-[2.4rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[3.15rem] lg:text-[4rem]">
            Create. Imagine.
            <br />
            <span className="text-accent">Inspire.</span>
          </h1>
          <p className="mx-auto max-w-md font-inter text-[0.9375rem] leading-relaxed text-text-muted md:text-[1.0625rem]">
            Generate stunning images and videos
            <br />
            with the power of AI
          </p>
        </div>

        {/* Feature cards */}
        <div className="mb-12 grid w-full max-w-[960px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:mb-14">
          <Link
            href="/image-generation"
            className="group relative min-h-[200px] overflow-hidden rounded-2xl glass-feature-card transition-all duration-300 hover:border-accent/20"
          >
            <Image
              src="/images/photo-frame.png"
              alt=""
              width={160}
              height={160}
              className={imageCardIconClass}
              style={{ ...cardIconPosition, ...cardIconFilter }}
            />
            <div className="relative flex min-h-[200px] flex-col p-7">
              <h3 className="font-urbanist text-[1.4rem] font-semibold leading-tight text-white">
                Image Generation
              </h3>
              <p className="mt-2 max-w-[240px] font-inter text-sm leading-relaxed text-accent">
                Create beautiful, high-Quality images in seconds
              </p>
              <div className="mt-auto pt-6">
                <FeatureCardButton>
                  <ArrowRight className="h-5 w-5 text-accent" strokeWidth={2} />
                </FeatureCardButton>
              </div>
            </div>
          </Link>

          <Link
            href="/video-generation"
            className="group relative min-h-[200px] overflow-hidden rounded-2xl glass-feature-card transition-all duration-300 hover:border-accent/20"
          >
            <Image
              src="/images/camera-video.png"
              alt=""
              width={160}
              height={160}
              className={videoCardIconClass}
              style={{ ...cardIconPosition, ...cardIconFilter }}
            />
            <div className="relative flex min-h-[200px] flex-col p-7">
              <h3 className="font-urbanist text-[1.4rem] font-semibold leading-tight text-white">
                Video Generation
              </h3>
              <p className="mt-2 max-w-[240px] font-inter text-sm leading-relaxed text-accent">
                Upload images into cinematic stunning videos in seconds
              </p>
              <div className="mt-auto pt-6">
                <FeatureCardButton>
                  <Play className="h-5 w-5 fill-accent text-accent" strokeWidth={0} />
                </FeatureCardButton>
              </div>
            </div>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4">
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
              className="flex items-center gap-3 rounded-xl px-5 py-3.5 glass-card"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg glass-chip">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-urbanist text-sm font-medium text-text">{label}</p>
                <p className="font-inter text-xs text-text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
