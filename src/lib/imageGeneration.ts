import { PLATFORM_OPTIONS, STYLE_OPTIONS } from "@/lib/mockData";

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio: string;
  style: string;
  imageCount: number;
}

export interface ImageGenerationSettingsInput {
  prompt: string;
  platform: string | null;
  style: string | null;
  imageCount: string | null;
}

const MOCK_GENERATED_IMAGES = [
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "https://images.unsplash.com/photo-1594938298603-c8148c4b4c03?w=500",
  "https://images.unsplash.com/photo-1566677914817-56426959ae9c?w=500",
];

export function resolveAspectRatio(platformId: string | null): string {
  if (!platformId) return "1:1";
  const platform = PLATFORM_OPTIONS.find((option) => option.id === platformId);
  return platform?.ratio ?? "1:1";
}

export function resolveStyleName(styleId: string | null): string {
  if (!styleId) return "";
  const style = STYLE_OPTIONS.find((option) => option.id === styleId);
  return style?.name ?? styleId;
}

export function resolveImageCount(imageCount: string | null): number {
  if (!imageCount) return 1;
  return parseInt(imageCount.replace("x", ""), 10);
}

export function buildImageGenerationRequest(
  input: ImageGenerationSettingsInput
): ImageGenerationRequest {
  return {
    prompt: input.prompt.trim(),
    aspectRatio: resolveAspectRatio(input.platform),
    style: resolveStyleName(input.style),
    imageCount: resolveImageCount(input.imageCount),
  };
}

/**
 * Image generation entry point — swap the mock delay for a real API call when ready.
 */
export async function generateImages(
  request: ImageGenerationRequest
): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return MOCK_GENERATED_IMAGES.slice(0, request.imageCount);
}
