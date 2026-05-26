export interface MockCreation {
  id: string;
  type: "image" | "video";
  prompt: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  style: string;
  platform: string;
}

export const STYLE_OPTIONS = [
  {
    id: "cinematic",
    name: "Cinematic",
    thumbnail: "/images/Cinematic.jpeg",
  },
  {
    id: "realistic",
    name: "Realistic",
    thumbnail: "/images/Realistic.jpeg",
  },
  {
    id: "anime",
    name: "Anime",
    thumbnail: "/images/Anime.jpeg",
  },
  {
    id: "dark-fantasy",
    name: "Dark Fantasy",
    thumbnail: "/images/Dark Fantasy.jpeg",
  },
  {
    id: "3d-render",
    name: "3D Render",
    thumbnail: "/images/3D Render.jpeg",
  },
];

export const PLATFORM_OPTIONS = [
  { id: "instagram", name: "Instagram", ratio: "1:1", icon: "instagram" },
  { id: "whatsapp", name: "WhatsApp", ratio: "9:16", icon: "whatsapp" },
  { id: "youtube", name: "YouTube", ratio: "16:9", icon: "youtube" },
  { id: "tiktok", name: "TikTok", ratio: "9:16", icon: "tiktok" },
  { id: "facebook", name: "Facebook", ratio: "4:5", icon: "facebook" },
];
