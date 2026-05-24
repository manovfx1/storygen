import {
  resolveAspectRatio,
  resolveStyleName,
} from "@/lib/imageGeneration";

export interface VideoGenerationRequest {
  prompt: string;
  startFrame: string | null;
  endFrame: string | null;
  aspectRatio: string;
  style: string;
  duration: number;
  quality: string;
}

export interface VideoGenerationSettingsInput {
  prompt: string;
  startFrame: string | null;
  endFrame: string | null;
  platform: string | null;
  style: string | null;
  duration: string | null;
  quality: string | null;
}

export function resolveDurationSeconds(duration: string | null): number {
  if (!duration) return 10;
  return parseInt(duration.replace("s", ""), 10);
}

export function resolveVideoQuality(quality: string | null): string {
  if (!quality) return "1080p";
  return quality.endsWith("p") ? quality : `${quality}p`;
}

export function buildVideoGenerationRequest(
  input: VideoGenerationSettingsInput
): VideoGenerationRequest {
  return {
    prompt: input.prompt.trim(),
    startFrame: input.startFrame,
    endFrame: input.endFrame,
    aspectRatio: resolveAspectRatio(input.platform),
    style: resolveStyleName(input.style),
    duration: resolveDurationSeconds(input.duration),
    quality: resolveVideoQuality(input.quality),
  };
}

/**
 * Video generation entry point — swap the mock delay for a real API call when ready.
 */
export async function generateVideo(request: any): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return "mock";
}
