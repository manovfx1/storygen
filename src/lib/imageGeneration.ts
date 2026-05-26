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

async function generateImage(
  request: Pick<ImageGenerationRequest, "prompt" | "aspectRatio" | "style">
): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: request.prompt,
      aspectRatio: request.aspectRatio,
      style: request.style,
    }),
  });

  const data: { imageUrl?: string; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to generate image");
  }

  if (!data.imageUrl) {
    throw new Error("Invalid response from generate image API");
  }

  return data.imageUrl;
}

export async function generateImages(
  request: ImageGenerationRequest
): Promise<string[]> {
  const { imageCount, ...payload } = request;

  return Promise.all(
    Array.from({ length: imageCount }, () => generateImage(payload))
  );
}
