import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/shared/PlatformIcons";

const PAGE = "mx-auto w-full max-w-[1440px] px-5 lg:px-8 xl:px-10";

const COLLAGE_CARD =
  "absolute overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]";

/**
 * Images surround a central headline safe zone — they must not overlap the text.
 * Layout matches Figma: top row (3), left/right mid, bottom row (3).
 */
const collageImages = [
  /* Top row */
  {
    src: "/images/Cocktail.jpeg",
    alt: "Orange drink splash",
    className: `${COLLAGE_CARD} left-[10%] top-[4%] z-[12] h-[292px] w-[292px] -rotate-[6deg] lg:left-[12%] lg:h-[315px] lg:w-[315px]`,
  },
  {
    src: "/images/Comic.jpeg",
    alt: "Castle game art",
    className: `${COLLAGE_CARD} left-[41%] top-[0%] z-[6] h-[383px] w-[240px] rotate-[2deg] lg:h-[409px] lg:w-[256px]`,
  },
  {
    src: "/images/Perfume.jpeg",
    alt: "Perfume bottle",
    className: `${COLLAGE_CARD} right-[10%] top-[3%] z-[14] h-[383px] w-[259px] -rotate-[8deg] lg:right-[12%] lg:h-[409px] lg:w-[274px]`,
  },
  /* Left side */
  {
    src: "/images/Couple.jpeg",
    alt: "Landscape with castle",
    className: `${COLLAGE_CARD} left-[2%] top-[38%] z-[10] h-[369px] w-[242px] -rotate-[4deg] lg:left-[3%] lg:h-[395px] lg:w-[259px]`,
  },
  /* Right side */
  {
    src: "/images/Cake.jpeg",
    alt: "Celebration cake",
    className: `${COLLAGE_CARD} right-[2%] top-[36%] z-[11] h-[369px] w-[242px] rotate-[5deg] lg:right-[3%] lg:h-[395px] lg:w-[259px]`,
  },
  /* Bottom row */
  {
    src: "/images/Drink.jpeg",
    alt: "Ice climber drink",
    className: `${COLLAGE_CARD} bottom-[6%] left-[12%] z-[13] h-[353px] w-[237px] rotate-[7deg] lg:left-[14%] lg:h-[378px] lg:w-[253px]`,
  },
  {
    src: "/images/Shoe.jpeg",
    alt: "Running shoes",
    className: `${COLLAGE_CARD} bottom-[2%] left-[40%] z-[8] h-[383px] w-[235px] rotate-[2deg] lg:h-[409px] lg:w-[250px]`,
  },
  {
    src: "/images/Spicy_Burger.jpeg",
    alt: "Gourmet burger",
    className: `${COLLAGE_CARD} bottom-[8%] right-[12%] z-[15] h-[221px] w-[376px] rotate-[13deg] lg:right-[14%] lg:h-[240px] lg:w-[405px]`,
  },
] as const;

const platforms = [
  {
    icon: InstagramIcon,
    ratio: "1:1",
    name: "Instagram Post",
    frameClass: "h-14 w-14 rounded-xl",
  },
  {
    icon: TikTokIcon,
    ratio: "9:16",
    name: "TikTok Reels",
    frameClass: "h-[72px] w-10 rounded-lg",
  },
  {
    icon: YouTubeIcon,
    ratio: "16:9",
    name: "YouTube Content",
    frameClass: "h-10 w-[72px] rounded-lg",
  },
  {
    icon: FacebookIcon,
    ratio: "4:5",
    name: "Facebook Post",
    frameClass: "h-[58px] w-12 rounded-lg",
  },
  {
    icon: WhatsAppIcon,
    ratio: "9:16",
    name: "WhatsApp",
    frameClass: "h-[72px] w-10 rounded-lg",
  },
] as const;

export default function SocialCollageSection() {
  return (
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className={PAGE}>
        {/* Collage canvas — tall, spacious, headline isolated in center */}
        <div className="relative mx-auto h-[840px] w-full max-w-[1280px] sm:h-[920px] lg:h-[1000px] xl:h-[1060px]">
          {collageImages.map((image) => (
            <div key={image.src} className={image.className}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          ))}

          {/* Headline — plain text, transparent, centered */}
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
            <h2 className="max-w-[550px] text-center text-[1.45rem] font-medium leading-[1.5] tracking-tight text-gray-900 sm:text-[1.6rem] lg:text-[1.7rem]">
              <span className="block">Generate perfectly optimized visuals</span>
              <span className="block">for every social media platform</span>
              <span className="block">and screen size.</span>
            </h2>
          </div>
        </div>

        {/* Aspect ratio section */}
        <div className="mt-32 text-center sm:mt-36 lg:mt-44">
          <h3 className="mb-10 text-xl font-medium text-gray-900 sm:mb-12 sm:text-2xl">
            Choose the Perfect Screen for Your Vision
          </h3>

          <div className="mx-auto max-w-[1100px] rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 sm:px-12 sm:py-11">
            <div className="overflow-x-auto pb-1 lg:overflow-visible">
              <div className="grid min-w-[560px] grid-cols-5 items-end gap-4 sm:min-w-0 sm:gap-8 lg:gap-12">
                {platforms.map(({ icon: Icon, ratio, name, frameClass }) => (
                  <div key={name} className="flex flex-col items-center">
                    <div className="mb-3 flex h-[76px] w-full items-end justify-center">
                      <div
                        className={`flex items-center justify-center border-2 border-dashed border-gray-300 bg-white ${frameClass}`}
                      >
                        <Icon className="h-[22px] w-[22px] text-gray-700" />
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-none text-gray-900">
                      {ratio}
                    </p>
                    <p className="mt-2 text-xs leading-tight text-gray-500">
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
