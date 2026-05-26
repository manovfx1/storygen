import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ENHANCE_SYSTEM_PROMPT =
  "You are a creative prompt enhancement assistant for AI image generation. Improve the user's prompt with clearer details, style cues, composition, and lighting. Return only the enhanced prompt text with no preamble or explanation.";

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

    const prompt =
      typeof body === "object" &&
      body !== null &&
      "prompt" in body &&
      typeof (body as { prompt: unknown }).prompt === "string"
        ? (body as { prompt: string }).prompt.trim()
        : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "A non-empty prompt string is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: ENHANCE_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(prompt);
    const enhancedPrompt = result.response.text()?.trim();

    if (!enhancedPrompt) {
      return NextResponse.json(
        { error: "Failed to generate enhanced prompt" },
        { status: 502 }
      );
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Enhance prompt error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
