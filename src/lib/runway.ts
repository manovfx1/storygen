export const RUNWAY_API_BASE = "https://api.dev.runwayml.com/v1";
export const RUNWAY_API_VERSION = "2024-11-06";
export const RUNWAY_VIDEO_MODEL = "gen4.5";
export const RUNWAY_MIN_DURATION = 2;
export const RUNWAY_MAX_DURATION = 10;

export interface RunwayTask {
  id?: string;
  status?: string;
  output?: string[];
  failure?: string;
  failureCode?: string;
  error?: string;
  message?: string;
}

const ASPECT_RATIO_MAP: Record<string, string> = {
  "16:9": "1280:720",
  "9:16": "720:1280",
  "1:1": "1280:720",
  "4:5": "720:1280",
  "4:3": "1280:720",
  "3:4": "720:1280",
  "21:9": "1280:720",
  "2:3": "720:1280",
  "3:2": "1280:720",
};

export function getRunwayApiKey(): string | undefined {
  return process.env.RUNWAY_API_KEY;
}

export function runwayHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "X-Runway-Version": RUNWAY_API_VERSION,
  };
}

export function mapAspectRatio(aspectRatio: string): string | null {
  return ASPECT_RATIO_MAP[aspectRatio] ?? null;
}

export function clampRunwayDuration(duration: number): number {
  return Math.min(Math.max(duration, RUNWAY_MIN_DURATION), RUNWAY_MAX_DURATION);
}

export function parseRunwayError(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    const errorData = data as RunwayTask;

    if (typeof errorData.failure === "string" && errorData.failure.trim()) {
      return errorData.failure;
    }

    if (typeof errorData.error === "string" && errorData.error.trim()) {
      return errorData.error;
    }

    if (typeof errorData.message === "string" && errorData.message.trim()) {
      return errorData.message;
    }
  }

  return `Runway API request failed with status ${status}`;
}

export async function fetchRunwayTask(
  apiKey: string,
  taskId: string
): Promise<RunwayTask> {
  const response = await fetch(`${RUNWAY_API_BASE}/tasks/${taskId}`, {
    headers: runwayHeaders(apiKey),
    cache: "no-store",
  });

  const data = (await response.json()) as RunwayTask;

  if (!response.ok) {
    throw new Error(parseRunwayError(data, response.status));
  }

  return data;
}
