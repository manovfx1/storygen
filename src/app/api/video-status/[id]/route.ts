import { NextRequest, NextResponse } from "next/server";
import { fetchRunwayTask, getRunwayApiKey } from "@/lib/runway";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const apiKey = getRunwayApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Runway API key is not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await fetchRunwayTask(apiKey, id.trim());
    const status = task.status ?? "UNKNOWN";
    const videoUrl =
      status === "SUCCEEDED" && task.output?.[0] ? task.output[0] : null;

    return NextResponse.json({ status, videoUrl });
  } catch (error) {
    console.error("Video status error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
