"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
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
import { enhancePrompt } from "@/lib/enhancePrompt";
import {
  buildVideoGenerationRequest,
  generateVideo,
  resolveDurationSeconds,
} from "@/lib/videoGeneration";
import { Download, Heart, Play, Pause, Trash2 } from "lucide-react";

const VIDEO_MODELS: ModelOption[] = [
  { id: "runway", label: "Runway ML" },
];

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
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [startFrame, setStartFrame] = useState<string | null>(null);
  const [endFrame, setEndFrame] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pollAbortRef = useRef<AbortController | null>(null);

  const selectedDurationSeconds = resolveDurationSeconds(duration);
  const playbackDuration =
    videoDuration > 0 ? videoDuration : selectedDurationSeconds;
  const progressPercent =
    playbackDuration > 0
      ? Math.min((currentTime / playbackDuration) * 100, 100)
      : 0;

  useEffect(() => {
    return () => {
      pollAbortRef.current?.abort();
    };
  }, []);

  const resetPlayback = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoDuration(0);
  }, []);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setEnhancing(true);
    try {
      const enhancedPrompt = await enhancePrompt(prompt);
      setPrompt(enhancedPrompt);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to enhance prompt"
      );
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating.");
      return;
    }

    pollAbortRef.current?.abort();
    const abortController = new AbortController();
    pollAbortRef.current = abortController;

    setGenerating(true);
    setGenerationStatus("PENDING");
    setGeneratedVideo(null);
    resetPlayback();
    setLiked(false);

    try {
      const request = buildVideoGenerationRequest({
        prompt,
        startFrame,
        endFrame,
        platform,
        style,
        duration,
        quality,
      });

      const videoUrl = await generateVideo(request, {
        intervalMs: 5000,
        signal: abortController.signal,
        onStatus: setGenerationStatus,
      });

      setGeneratedVideo(videoUrl);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Video generation cancelled"
      ) {
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to generate video"
      );
    } finally {
      setGenerating(false);
      setGenerationStatus(null);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !generatedVideo) return;

    if (video.ended || currentTime >= playbackDuration) {
      video.currentTime = 0;
    }

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || playbackDuration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    );
    const nextTime = ratio * playbackDuration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleDelete = () => {
    setGeneratedVideo(null);
    setLiked(false);
    resetPlayback();
  };

  const getLoadingMessage = () => {
    switch (generationStatus) {
      case "RUNNING":
        return "Runway is generating your video...";
      case "THROTTLED":
        return "Your video is queued. Waiting to start...";
      case "PENDING":
        return "Starting video generation...";
      default:
        return "Generating your video...";
    }
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
                <div className="relative h-full bg-black">
                  <div className="absolute right-3 top-3 z-10 flex gap-1.5">
                    <a
                      href={generatedVideo}
                      download="generated-video.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg glass-control transition-colors hover:bg-black/60"
                      aria-label="Download video"
                    >
                      <Download className="h-3.5 w-3.5 text-white" />
                    </a>
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

                  <video
                    ref={videoRef}
                    src={generatedVideo}
                    className="h-full w-full object-contain"
                    playsInline
                    onLoadedMetadata={(event) => {
                      setVideoDuration(event.currentTarget.duration);
                    }}
                    onTimeUpdate={(event) => {
                      setCurrentTime(event.currentTarget.currentTime);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!isPlaying && (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 glass-control transition-all hover:bg-black/60"
                        aria-label="Play video"
                      >
                        <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                      </button>
                    )}
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
                        aria-valuemax={Math.floor(playbackDuration)}
                        aria-valuenow={Math.floor(currentTime)}
                        tabIndex={0}
                        onClick={handleSeek}
                        onKeyDown={(event) => {
                          const video = videoRef.current;
                          if (!video) return;

                          if (event.key === "ArrowRight") {
                            video.currentTime = Math.min(
                              video.currentTime + 1,
                              playbackDuration
                            );
                          }
                          if (event.key === "ArrowLeft") {
                            video.currentTime = Math.max(
                              video.currentTime - 1,
                              0
                            );
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
                        {formatTime(currentTime)} / {formatTime(playbackDuration)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : generating ? (
                <div className="flex h-full items-center justify-center shimmer">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                    <p className="text-sm text-text-muted">{getLoadingMessage()}</p>
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
