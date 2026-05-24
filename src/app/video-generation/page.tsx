"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PromptArea, {
  ModelOption,
  GENERATION_PROMPT_ROWS,
  GENERATION_VIDEO_PROMPT_TEXTAREA_CLASS,
} from "@/components/shared/PromptArea";
import PlatformSelector from "@/components/shared/PlatformSelector";
import StyleSelector from "@/components/shared/StyleSelector";
import GenerateButton from "@/components/shared/GenerateButton";
import VideoFrameUpload from "@/components/shared/VideoFrameUpload";
import { PLATFORM_OPTIONS, STYLE_OPTIONS } from "@/lib/mockData";
import {
  generateVideo,
  resolveDurationSeconds,
} from "@/lib/videoGeneration";
import { Download, Heart, Play, Pause, Trash2 } from "lucide-react";

const VIDEO_MODELS: ModelOption[] = [
  { id: "runway", label: "Runway ML" },
];

const ENHANCED_PROMPT = `Gentle ocean waves moving in the background, palm trees softly swaying in the breeze, hammock slowly rocking back and forth, the cat casually adjusting its sunglasses and blinking occasionally. Warm sunlight, realistic shadows, subtle camera push-in, natural beach atmosphere, cinematic movement, photorealistic animation, smooth motion, high-quality travel advertisement feel.`;

const MOCK_VIDEO_THUMBNAIL = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800";

function toggleSelection<T extends string>(current: T | null, value: T): T | null {
  return current === value ? null : value;
}

function formatTime(seconds: number): string {
  const wholeSeconds = Math.floor(seconds);
  const mins = Math.floor(wholeSeconds / 60);
  const secs = wholeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [startFrame, setStartFrame] = useState<string | null>(null);
  const [endFrame, setEndFrame] = useState<string | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const durationSeconds = resolveDurationSeconds(duration);
  const progressPercent = Math.min((currentTime / durationSeconds) * 100, 100);

  useEffect(() => {
    if (!isPlaying || !generatedVideo) {
      lastTickRef.current = null;
      return;
    }

    let rafId = 0;

    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = timestamp;
      }

      const delta = (timestamp - lastTickRef.current) / 1000;
      lastTickRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = Math.min(prev + delta, durationSeconds);
        if (next >= durationSeconds) {
          setIsPlaying(false);
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lastTickRef.current = null;
    };
  }, [isPlaying, generatedVideo, durationSeconds]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    lastTickRef.current = null;
  }, []);

  const handleEnhance = async () => {
    setEnhancing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPrompt(ENHANCED_PROMPT);
    setEnhancing(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedVideo(null);
    resetPlayback();
    setLiked(false);
  
    const result = await generateVideo();
  
    setGeneratedVideo(result);
    setGenerating(false);
  };

  
  const togglePlay = () => {
    if (!generatedVideo) return;

    if (currentTime >= durationSeconds) {
      setCurrentTime(0);
      lastTickRef.current = null;
    }

    setIsPlaying((playing) => !playing);
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    );
    setCurrentTime(ratio * durationSeconds);
    lastTickRef.current = null;
  };

  const handleDelete = () => {
    setGeneratedVideo(null);
    setLiked(false);
    resetPlayback();
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
                models={VIDEO_MODELS}
                selectedModel={selectedModel}
                onModelChange={(id) =>
                  setSelectedModel((current) => toggleSelection(current, id))
                }
                placeholder="Describe the video you want to generate..."
                rows={GENERATION_PROMPT_ROWS}
                textareaClassName={GENERATION_VIDEO_PROMPT_TEXTAREA_CLASS}
                headerSlot={
                  <VideoFrameUpload
                    startFrame={startFrame}
                    endFrame={endFrame}
                    onStartFrameChange={setStartFrame}
                    onEndFrameChange={setEndFrame}
                  />
                }
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

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <h3 className="mb-0.5 font-urbanist text-sm font-medium text-text-muted">
                    Video duration
                  </h3>
                  <div className="flex gap-1.5">
                    {["5s", "10s", "15s"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                          duration === d
                            ? "border-accent bg-accent/15 text-accent"
                            : "glass-surface border-border text-text-muted hover:border-accent/40 hover:text-text"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-0.5 font-urbanist text-sm font-medium text-text-muted">
                    Video Quality
                  </h3>
                  <div className="flex gap-1.5">
                    {["720p", "1080p"].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuality(q)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                          quality === q
                            ? "border-accent bg-accent/15 text-accent"
                            : "glass-surface border-border text-text-muted hover:border-accent/40 hover:text-text"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <GenerateButton onClick={handleGenerate} loading={generating} />
            </div>
        </div>

        {/* Right panel – output */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-3 pt-1 lg:px-8">
          <h2 className="mb-2 shrink-0 font-urbanist text-sm font-medium text-text-muted">
            Generated Video
          </h2>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            <div className="min-h-0 flex-[3] overflow-hidden rounded-xl glass-card">
              {generatedVideo ? (
                <div className="relative h-full">
                  <div className="absolute right-3 top-3 z-10 flex gap-1.5">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg glass-control transition-colors hover:bg-black/60"
                      aria-label="Download video"
                    >
                      <Download className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex h-8 w-8 items-center justify-center rounded-lg glass-control transition-colors hover:bg-black/60"
                      aria-label="Delete video"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLiked(!liked)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg glass-control transition-colors hover:bg-black/60"
                      aria-label="Favorite video"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${liked ? "fill-red-400 text-red-400" : "text-white"}`}
                      />
                    </button>
                  </div>

                  <div className="relative h-full">
                    <img
                      src={MOCK_VIDEO_THUMBNAIL}
                      alt="Generated video"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 glass-control transition-all hover:bg-black/60"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 text-white" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                        )}
                      </button>
                    </div>
                    <div className="absolute left-1/2 top-4 -translate-x-1/2 text-center">
                      <p className="text-2xl font-bold text-white opacity-70 drop-shadow">
                        HORIZONTA
                      </p>
                      <p className="text-xs text-white opacity-60 drop-shadow">
                        Every Journey Begins With Wonder
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={togglePlay}
                          aria-label={isPlaying ? "Pause video" : "Play video"}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 fill-white text-white" />
                          ) : (
                            <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                          )}
                        </button>
                        <div
                          role="slider"
                          aria-label="Video progress"
                          aria-valuemin={0}
                          aria-valuemax={durationSeconds}
                          aria-valuenow={Math.floor(currentTime)}
                          tabIndex={0}
                          onClick={handleSeek}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowRight") {
                              setCurrentTime((prev) =>
                                Math.min(prev + 1, durationSeconds)
                              );
                              lastTickRef.current = null;
                            }
                            if (event.key === "ArrowLeft") {
                              setCurrentTime((prev) => Math.max(prev - 1, 0));
                              lastTickRef.current = null;
                            }
                          }}
                          className="h-1 flex-1 cursor-pointer rounded-full bg-white/20"
                        >
                          <div
                            className="h-full rounded-full bg-red-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="min-w-[4.5rem] text-right text-xs text-white">
                          {formatTime(currentTime)} / {formatTime(durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : generating ? (
                <div className="flex h-full items-center justify-center shimmer">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                    <p className="text-sm text-text-muted">Generating your video...</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl glass-card">
                      <Play className="h-7 w-7 text-text-dim" />
                    </div>
                    <p className="text-sm text-text-dim">
                      Your generated video will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex min-h-0 flex-[2] items-center justify-center overflow-hidden rounded-xl glass-card">
              <div className="flex gap-2 opacity-30">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass-chip"
                >
                  <Download className="h-3.5 w-3.5 text-text-muted" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass-chip"
                >
                  <Heart className="h-3.5 w-3.5 text-text-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
