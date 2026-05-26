export async function enhancePrompt(prompt: string): Promise<string> {
  const response = await fetch("/api/enhance-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data: { enhancedPrompt?: string; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to enhance prompt");
  }

  const enhancedPrompt = data.enhancedPrompt?.trim();

  if (!enhancedPrompt) {
    throw new Error("Invalid response from enhance prompt API");
  }

  return enhancedPrompt;
}
