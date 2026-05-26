import {
  resolveAspectRatio,
  resolveStyleName,
} from "@/lib/imageGeneration";
import { clampRunwayDuration } from "@/lib/runway";

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

export interface VideoStatusResponse {
  status: string;
  videoUrl: string | null;
}

export interface PollVideoOptions {
  intervalMs?: number;
  maxAttempts?: number;
  signal?: AbortSignal;
  onStatus?: (status: string) => void;
}

const DEFAULT_POLL_INTERVAL_MS = 5000;
const DEFAULT_MAX_POLL_ATTEMPTS = 120;

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

function buildRunwayPrompt(request: VideoGenerationRequest): string {
  if (request.style) {
    return `${request.prompt}\nStyle: ${request.style}`;
  }

  return request.prompt;
}

export async function startVideoGeneration(
  request: VideoGenerationRequest
): Promise<string> {
  const response = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: buildRunwayPrompt(request),
      aspectRatio: request.aspectRatio,
      duration: clampRunwayDuration(request.duration),
    }),
  });

  const data: { taskId?: string; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to start video generation");
  }

  if (!data.taskId) {
    throw new Error("Invalid response from generate video API");
  }

  return data.taskId;
}

export async function getVideoStatus(
  taskId: string
): Promise<VideoStatusResponse> {
  const response = await fetch(
    `/api/video-status/${encodeURIComponent(taskId)}`,
    { cache: "no-store" }
  );

  const data: VideoStatusResponse & { error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to fetch video status");
  }

  return {
    status: data.status,
    videoUrl: data.videoUrl ?? null,
  };
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Video generation cancelled"));
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new Error("Video generation cancelled"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function pollVideoUntilComplete(
  taskId: string,
  options: PollVideoOptions = {}
): Promise<string> {
  const intervalMs = options.intervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_POLL_ATTEMPTS;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { status, videoUrl } = await getVideoStatus(taskId);
    options.onStatus?.(status);

    if (status === "SUCCEEDED") {
      if (!videoUrl) {
        throw new Error("Video generation completed without a video URL");
      }

      return videoUrl;
    }

    if (status === "FAILED") {
      throw new Error("Video generation failed");
    }

    if (attempt < maxAttempts - 1) {
      await wait(intervalMs, options.signal);
    }
  }

  throw new Error("Video generation timed out");
}

export async function generateVideo(
  request: VideoGenerationRequest,
  options: PollVideoOptions = {}
): Promise<string> {
  const taskId = await startVideoGeneration(request);
  return pollVideoUntilComplete(taskId, options);
}
