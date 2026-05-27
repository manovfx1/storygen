export interface EnhanceVideoPromptOptions {
  hasStartFrame?: boolean;
  hasEndFrame?: boolean;
}

export async function enhanceVideoPrompt(
  prompt: string,
  options: EnhanceVideoPromptOptions = {}
): Promise<string> {
  const response = await fetch("/api/enhance-video-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      hasStartFrame: options.hasStartFrame ?? false,
      hasEndFrame: options.hasEndFrame ?? false,
    }),
  });

  const data: { enhancedPrompt?: string; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to enhance video prompt");
  }

  const enhancedPrompt = data.enhancedPrompt?.trim();

  if (!enhancedPrompt) {
    throw new Error("Invalid response from enhance video prompt API");
  }

  return enhancedPrompt;
}
