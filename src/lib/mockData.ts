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

export const MOCK_IMAGES: MockCreation[] = [
  {
    id: "img-1",
    type: "image",
    prompt: "perfume bottle with yellow vanilla perfume inside a glass flower",
    url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
    thumbnail: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",
    createdAt: "2026-05-20",
    style: "Realistic",
    platform: "Instagram",
  },
  {
    id: "img-2",
    type: "image",
    prompt: "luxury watch on marble surface with dramatic lighting",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    createdAt: "2026-05-19",
    style: "Cinematic",
    platform: "TikTok",
  },
  {
    id: "img-3",
    type: "image",
    prompt: "futuristic city at night with neon lights and rain",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
    thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400",
    createdAt: "2026-05-18",
    style: "Dark Fantasy",
    platform: "YouTube",
  },
  {
    id: "img-4",
    type: "image",
    prompt: "crystal castle floating in the sky surrounded by clouds",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    createdAt: "2026-05-17",
    style: "3D Render",
    platform: "Facebook",
  },
];

export const MOCK_VIDEOS: MockCreation[] = [
  {
    id: "vid-1",
    type: "video",
    prompt: "cat relaxing in the hammock, sea waves moving, trees moving with wind",
    url: "",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
    createdAt: "2026-05-20",
    style: "Realistic",
    platform: "WhatsApp",
  },
  {
    id: "vid-2",
    type: "video",
    prompt: "ocean sunrise with dolphins jumping and golden light",
    url: "",
    thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400",
    createdAt: "2026-05-19",
    style: "Cinematic",
    platform: "YouTube",
  },
];

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
