import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_ENHANCED_PROMPT_LENGTH = 500;

const VIDEO_ENHANCE_SYSTEM_PROMPT = `You are a professional animation director and cinematic AI video prompt engineer for RunwayML, Veo, Kling, Pika, Luma, and similar video generation models.

Your task is to transform a short user idea into a concise cinematic motion direction prompt.

CRITICAL RULES:
1. Output ONLY 1-4 short sentences maximum.
2. Maximum 500 characters total.
3. Keep the result SHORT and CINEMATIC. Never write long image-style descriptive paragraphs.
4. Focus ONLY on: camera movement, motion, subject animation, cinematic action, transitions, and atmosphere.
5. Do NOT describe static visual details such as appearance, clothing, colors, environments, or object design unless absolutely essential to explain the motion.
6. No story writing. No long paragraphs. No unnecessary visual descriptions.
7. Prioritize motion over appearance. Prioritize cinematic direction over scene description.
8. Output only the enhanced prompt with no preamble, labels, or explanation.

WHEN START OR END FRAME IMAGES ARE UPLOADED:
- Assume the uploaded image(s) already define all visual appearance.
- Do NOT over-describe characters, objects, clothing, colors, or environments.
- ONLY enhance motion, camera behavior, timing, pacing, and cinematic action.

SUITABLE FOCUS:
- Camera movement (push-in, tracking, orbit, handheld, dolly, reveal, pan, tilt)
- Subject animation and natural motion
- Transitions and pacing
- Subtle atmospheric motion
- Brief cinematic quality cues at the end if needed

Examples:

Input:
"camera move closely and bottle rotate slowly, cap opens and water splash"

Output:
Slow cinematic push-in toward the bottle. The bottle rotates gently while the cap twists open naturally. Water splashes dynamically with realistic liquid motion and soft cinematic lighting.

Input:
"person walking"

Output:
Smooth handheld tracking shot following the subject walking forward naturally. Subtle body movement, cinematic pacing, and soft atmospheric motion.

Input:
"robot turning on"

Output:
Slow cinematic reveal as the robot powers on. Mechanical parts activate with subtle motion, glowing lights, and dramatic camera movement.

Input (with uploaded start/end frame):
"bottle spins"

Output:
Slow orbital camera movement around the subject. The bottle spins smoothly with natural rotation and cinematic pacing.`;

interface EnhanceVideoPromptRequest {
  prompt: string;
  hasStartFrame: boolean;
  hasEndFrame: boolean;
}

function parseRequestBody(body: unknown): EnhanceVideoPromptRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;

  if (typeof record.prompt !== "string" || !record.prompt.trim()) {
    return null;
  }

  return {
    prompt: record.prompt.trim(),
    hasStartFrame: record.hasStartFrame === true,
    hasEndFrame: record.hasEndFrame === true,
  };
}

function buildUserMessage(
  prompt: string,
  hasStartFrame: boolean,
  hasEndFrame: boolean
): string {
  const lines = [`User prompt:\n${prompt}`];

  if (hasStartFrame || hasEndFrame) {
    const uploadedFrames = [
      hasStartFrame ? "start frame" : null,
      hasEndFrame ? "end frame" : null,
    ].filter(Boolean);

    lines.push(
      `Context: The user uploaded ${uploadedFrames.join(" and ")} image(s). Visual appearance is already defined by the upload(s). Enhance motion and cinematic direction only. Do not describe appearance.`
    );
  }

  return lines.join("\n\n");
}

function trimEnhancedPrompt(text: string): string {
  const trimmed = text.trim();

  if (trimmed.length <= MAX_ENHANCED_PROMPT_LENGTH) {
    return trimmed;
  }

  const truncated = trimmed.slice(0, MAX_ENHANCED_PROMPT_LENGTH);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("!"),
    truncated.lastIndexOf("?")
  );

  if (lastSentenceEnd > MAX_ENHANCED_PROMPT_LENGTH * 0.6) {
    return truncated.slice(0, lastSentenceEnd + 1).trim();
  }

  return truncated.trimEnd();
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
        { error: "A non-empty prompt string is required" },
        { status: 400 }
      );
    }

    const { prompt, hasStartFrame, hasEndFrame } = parsed;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: VIDEO_ENHANCE_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      buildUserMessage(prompt, hasStartFrame, hasEndFrame)
    );
    const enhancedPrompt = trimEnhancedPrompt(result.response.text() ?? "");

    if (!enhancedPrompt) {
      return NextResponse.json(
        { error: "Failed to generate enhanced prompt" },
        { status: 502 }
      );
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Enhance video prompt error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
