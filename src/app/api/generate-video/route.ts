import { NextRequest, NextResponse } from "next/server";
import {
  RUNWAY_API_BASE,
  RUNWAY_VIDEO_MODEL,
  clampRunwayDuration,
  getRunwayApiKey,
  mapAspectRatio,
  parseRunwayError,
  runwayHeaders,
  type RunwayTask,
} from "@/lib/runway";

interface GenerateVideoRequest {
  prompt: string;
  aspectRatio: string;
  duration: number;
}

function parseRequestBody(body: unknown): GenerateVideoRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { prompt, aspectRatio, duration } = body as Record<string, unknown>;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return null;
  }

  if (typeof aspectRatio !== "string" || !aspectRatio.trim()) {
    return null;
  }

  const parsedDuration =
    typeof duration === "number"
      ? duration
      : typeof duration === "string"
        ? Number.parseInt(duration, 10)
        : Number.NaN;

  if (!Number.isFinite(parsedDuration)) {
    return null;
  }

  return {
    prompt: prompt.trim(),
    aspectRatio: aspectRatio.trim(),
    duration: parsedDuration,
  };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getRunwayApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Runway API key is not configured" },
        { status: 500 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = parseRequestBody(body);

    if (!parsed) {
      return NextResponse.json(
        { error: "prompt, aspectRatio, and duration are required" },
        { status: 400 }
      );
    }

    const { prompt, aspectRatio, duration } = parsed;
    const ratio = mapAspectRatio(aspectRatio);

    if (!ratio) {
      return NextResponse.json(
        { error: `Unsupported aspect ratio: ${aspectRatio}` },
        { status: 400 }
      );
    }

    const runwayDuration = clampRunwayDuration(duration);

    const runwayResponse = await fetch(`${RUNWAY_API_BASE}/text_to_video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...runwayHeaders(apiKey),
      },
      body: JSON.stringify({
        model: RUNWAY_VIDEO_MODEL,
        promptText: prompt,
        ratio,
        duration: runwayDuration,
      }),
    });

    const data = (await runwayResponse.json()) as RunwayTask;

    if (!runwayResponse.ok) {
      return NextResponse.json(
        { error: parseRunwayError(data, runwayResponse.status) },
        { status: runwayResponse.status }
      );
    }

    if (!data.id) {
      return NextResponse.json(
        { error: "Runway API did not return a task ID" },
        { status: 502 }
      );
    }

    return NextResponse.json({ taskId: data.id });
  } catch (error) {
    console.error("Generate video error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
