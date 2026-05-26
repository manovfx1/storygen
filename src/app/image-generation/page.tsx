"use client";

import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PromptArea, {
  ModelOption,
  GENERATION_PROMPT_ROWS,
  GENERATION_PROMPT_TEXTAREA_CLASS,
} from "@/components/shared/PromptArea";
import PlatformSelector from "@/components/shared/PlatformSelector";
import StyleSelector from "@/components/shared/StyleSelector";
import GenerateButton from "@/components/shared/GenerateButton";
import { PLATFORM_OPTIONS, STYLE_OPTIONS } from "@/lib/mockData";
import { enhancePrompt } from "@/lib/enhancePrompt";
import { saveImageCreation } from "@/lib/creationsStorage";
import {
  buildImageGenerationRequest,
  generateImages,
} from "@/lib/imageGeneration";
import { Download, Heart } from "lucide-react";

const IMAGE_MODELS: ModelOption[] = [
  { id: "openai", label: "Open AI" },
  { id: "gemini", label: "Gemini AI" },
];

function toggleSelection<T extends string>(current: T | null, value: T): T | null {
  return current === value ? null : value;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setEnhancing(true);
    try {
      const enhancedPrompt = await enhancePrompt(prompt);
      setPrompt(enhancedPrompt);
    } catch (error) {
      console.error("Failed to enhance prompt:", error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating.");
      return;
    }

    setGenerating(true);
    setGeneratedImages([]);

    try {
      const request = buildImageGenerationRequest({
        prompt,
        platform,
        style,
        imageCount,
      });

      const images = await generateImages(request);
      setGeneratedImages(images);

      images.forEach((imageUrl) => {
        saveImageCreation({
          prompt: request.prompt,
          style: request.style,
          aspectRatio: request.aspectRatio,
          imageUrl,
        });
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate image"
      );
    } finally {
      setGenerating(false);
    }
  };

  const toggleLike = (index: number) => {
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <DashboardLayout lockViewport>
      <div className="flex h-full min-h-0 flex-col overflow-hidden lg:flex-row">
        {/* Left panel */}
        <div className="glass-panel-content flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-border/60 px-5 pb-3 pt-1 lg:max-w-[540px] lg:border-b-0 lg:border-r">
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
            <PromptArea
              value={prompt}
              onChange={setPrompt}
              onEnhance={handleEnhance}
              enhancing={enhancing}
              models={IMAGE_MODELS}
              selectedModel={selectedModel}
              onModelChange={(id) =>
                setSelectedModel((current) => toggleSelection(current, id))
              }
              placeholder="Describe the image you want to generate..."
              rows={GENERATION_PROMPT_ROWS}
              textareaClassName={GENERATION_PROMPT_TEXTAREA_CLASS}
            />

            <div>
              <h3 className="mb-0.5 font-urbanist text-sm font-medium text-text-muted">
                Choose your Media
              </h3>
              <PlatformSelector
                platforms={PLATFORM_OPTIONS}
                selected={platform ?? ""}
                onChange={setPlatform}
              />
            </div>

            <div>
              <h3 className="mb-0.5 font-urbanist text-sm font-medium text-text-muted">
                Tone/ Style
              </h3>
              <StyleSelector
                styles={STYLE_OPTIONS}
                selected={style ?? ""}
                onChange={setStyle}
              />
            </div>

            <div>
              <h3 className="mb-0.5 font-urbanist text-sm font-medium text-text-muted">
                Number of Images
              </h3>
              <div className="mb-0.5 flex gap-2">
                {["1x", "2x", "3x", "4x"].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setImageCount(count)}
                    className={`rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                      imageCount === count
                        ? "border-accent bg-accent/12 text-accent"
                        : "glass-surface border-border text-text-muted hover:border-accent/35 hover:text-text"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <GenerateButton onClick={handleGenerate} loading={generating} />
            </div>
          </div>
        </div>

        {/* Right panel – output */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-3 pt-1 lg:px-8">
          <h2 className="mb-2 shrink-0 font-urbanist text-sm font-medium text-text-muted">
            Generated Images
          </h2>

          <div className="min-h-0 flex-1 overflow-hidden">
            {generatedImages.length === 0 && !generating ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-border/60 bg-[#0a0a0a]">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-card">
                    <svg
                      className="h-8 w-8 text-text-dim"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="font-inter text-sm text-text-dim">
                    Your generated images will appear here
                  </p>
                </div>
              </div>
            ) : generating ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-border/60 bg-[#0a0a0a]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                  <p className="font-inter text-sm text-text-muted">
                    Generating...
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid h-full grid-cols-2 gap-3 overflow-hidden">
                {generatedImages.map((src, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl border-0 glass-card"
                  >
                    <img
                      src={src}
                      alt={`Generated ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/30" />
                    <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg glass-control hover:bg-black/60"
                      >
                        <Download className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleLike(i)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg glass-control hover:bg-black/60"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${likedImages.has(i) ? "fill-red-400 text-red-400" : "text-white"}`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
