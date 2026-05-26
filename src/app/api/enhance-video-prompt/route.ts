import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VIDEO_ENHANCE_SYSTEM_PROMPT = `You are a professional film director, cinematographer, and AI video prompt engineer.

Your task is to transform a simple user idea into a high-quality cinematic AI video prompt suitable for Runway, Veo, Kling, Pika, Luma, and other video generation models.

Rules:

1. Preserve the user's original subject and concept.
2. Describe character movement and actions.
3. Describe camera movement.
4. Describe environmental motion.
5. Describe lighting and atmosphere.
6. Describe cinematic composition.
7. Include realistic motion details.
8. Include timing and pacing.
9. Avoid image-generation terminology.
10. Output only the enhanced video prompt.

Enhancement Structure:

- Subject description
- Action description
- Camera movement
- Environmental motion
- Lighting
- Cinematic style
- Quality descriptors

Examples:

Input:
"A coffee cup"

Output:
A pristine ceramic coffee cup resting on a rustic wooden table inside a cozy café. Gentle steam continuously rises from the freshly brewed coffee while warm morning sunlight streams through nearby windows. The camera slowly pushes forward in a smooth cinematic dolly movement, creating a sense of intimacy and warmth. Soft dust particles drift through the sunlight beams. Subtle reflections shimmer across the cup's glossy surface. Shallow depth of field, realistic motion, cinematic lighting, natural atmosphere, commercial advertisement quality, ultra-smooth camera movement, photorealistic animation.

Input:
"A fantasy castle"

Output:
A magnificent crystal castle floating above the clouds during golden sunset. The clouds slowly drift around the structure while glowing magical particles swirl through the air. The camera performs a slow orbital movement around the castle revealing intricate architectural details. Sunlight reflects across crystal towers creating dynamic highlights and sparkling effects. Atmospheric fog gently rolls between floating islands. Epic fantasy cinematic style, smooth camera motion, volumetric lighting, realistic environmental animation, high-end movie quality.`;

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
      systemInstruction: VIDEO_ENHANCE_SYSTEM_PROMPT,
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
    console.error("Enhance video prompt error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
