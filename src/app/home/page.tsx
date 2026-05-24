import Link from "next/link";
import { Star } from "lucide-react";
import SocialCollageSection from "@/components/home/SocialCollageSection";
import StoryGenLogo from "@/components/shared/StoryGenLogo";

const PAGE = "mx-auto w-full max-w-[1440px] px-5 lg:px-8 xl:px-10";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className={`${PAGE} flex items-center justify-between gap-6 py-5`}>
        <StoryGenLogo variant="light" height={46} href="/home" priority />

        <div className="hidden flex-1 items-center justify-center gap-14 text-[15px] font-medium text-gray-600 lg:flex">
          <Link href="#" className="transition-colors hover:text-gray-900">
            Home
          </Link>
          <Link href="#" className="transition-colors hover:text-gray-900">
            Features
          </Link>
          <Link href="#" className="transition-colors hover:text-gray-900">
            Templates
          </Link>
          <Link href="#" className="transition-colors hover:text-gray-900">
            Pricing
          </Link>
          <Link href="#" className="transition-colors hover:text-gray-900">
            Blog
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-[15px] font-semibold text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-[15px] font-semibold text-white transition-all hover:bg-gray-700"
          >
            Start Trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className={`${PAGE} grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-[1fr_1.05fr] md:gap-10 lg:py-12 xl:gap-12`}
      >
        <div className="md:-ml-1 md:-mt-3 lg:-mt-5 lg:max-w-none">
          <span className="mb-6 inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            Multi-Model Gen AI Platform
          </span>
          <h1 className="mb-4 text-[2.75rem] font-black leading-[1.05] tracking-tight text-gray-900 sm:text-6xl md:whitespace-nowrap lg:text-[4rem]">
            Boost your creativity
          </h1>
          <p className="mb-6 text-2xl font-semibold text-[#22c55e] sm:text-3xl lg:text-4xl">
            Enhance your social media
          </p>
          <p className="mb-10 max-w-lg text-base leading-relaxed text-gray-500 lg:text-lg">
            Create stunning images and cinematic visuals for social media advertising
            and storytelling with our all-in-one next-generation AI platform for
            non-designers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-gray-900 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-gray-700"
            >
              Start Creating
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-7 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300"
            >
              <Star className="h-5 w-5 text-[#22c55e]" />
              Explore Templates
            </Link>
          </div>
        </div>

        {/* Hero video */}
        <div className="flex w-full items-center justify-center py-6 md:py-8 lg:py-10">
          <div className="aspect-[4/3.35] w-full max-w-none overflow-hidden rounded-2xl border border-gray-100 bg-gray-900 shadow-2xl">
            <video
              src="/videos/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
                alt="StoryGen demo"
                className="h-full w-full object-cover"
              />
            </video>
          </div>
        </div>
      </section>

      {/* Feature pills */}
      <section className={`${PAGE} mb-16 mt-6 md:mb-20 md:mt-12 lg:mb-24 lg:mt-16`}>
        <div className="mx-auto max-w-[1100px] rounded-2xl border border-gray-100 bg-gray-50 px-6 py-8 sm:px-10 sm:py-9">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4 lg:gap-8">
            {[
              { icon: "🤖", title: "AI Powered", sub: "Multi-model generation" },
              { icon: "✨", title: "Easy to use", sub: "For non-designers" },
              { icon: "📱", title: "Social ready", sub: "Perfect aspect ratios" },
              { icon: "⚡", title: "Save time", sub: "From idea to content" },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center justify-center gap-3.5 md:justify-start"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-base font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialCollageSection />

      {/* Use case tags */}
      <section className="border-t border-gray-100 py-6">
        <div
          className={`${PAGE} flex flex-wrap items-center justify-center gap-x-12 gap-y-3 sm:gap-x-16 md:gap-x-24 lg:gap-x-28`}
        >
          {[
            "Social Media Ads",
            "Product promotions",
            "Event announcements",
            "Brand Awareness",
            "Content Creation",
          ].map((tag) => (
            <span key={tag} className="text-sm text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className={`${PAGE} flex items-center justify-between`}>
          <div>
            <div className="mb-1">
              <StoryGenLogo variant="dark" height={28} />
            </div>
            <p className="text-xs text-gray-500">
              Powered by Open AI, Gemini AI, Runway ML
            </p>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 Gen Craft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
