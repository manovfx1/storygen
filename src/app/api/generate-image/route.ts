import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const IMAGE_MODEL = "gemini-2.5-flash-image";

const SUPPORTED_ASPECT_RATIOS = new Set(["1:1", "9:16", "16:9", "4:5"]);

interface GenerateImageRequest {
  prompt: string;
  aspectRatio: string;
  style: string;
}

function parseRequestBody(body: unknown): GenerateImageRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { prompt, aspectRatio, style } = body as Record<string, unknown>;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return null;
  }

  if (typeof aspectRatio !== "string" || !aspectRatio.trim()) {
    return null;
  }

  if (typeof style !== "string") {
    return null;
  }

  return {
    prompt: prompt.trim(),
    aspectRatio: aspectRatio.trim(),
    style: style.trim(),
  };
}

function buildImagePrompt(
  prompt: string,
  style: string,
  aspectRatio: string
): string {
  return `Create a professional high-quality image.
Style: ${style || "Default"}
Aspect Ratio: ${aspectRatio}
User Prompt:
${prompt}
Generate a highly detailed, photorealistic image with cinematic lighting, sharp focus, realistic textures, professional composition, rich colors, depth of field, and commercial advertising quality.`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
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
        { error: "prompt, aspectRatio, and style are required" },
        { status: 400 }
      );
    }

    const { prompt, aspectRatio, style } = parsed;

    if (!SUPPORTED_ASPECT_RATIOS.has(aspectRatio)) {
      return NextResponse.json(
        { error: `Unsupported aspect ratio: ${aspectRatio}` },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });
    const fullPrompt = buildImagePrompt(prompt, style, aspectRatio);

    const response = await genAI.models.generateContent({
      model: IMAGE_MODEL,
      contents: fullPrompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio,
        },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((part) =>
      part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 502 }
      );
    }

    const mimeType = imagePart.inlineData.mimeType ?? "image/png";
    const imageUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Generate image error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
