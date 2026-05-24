"use client";

import { useRef } from "react";
import { ArrowRight, ImagePlus, Trash2, Upload } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/jpg,image/png,image/webp";

interface FrameCardProps {
  label: string;
  preview: string | null;
  onSelect: (url: string | null) => void;
}

function FrameCard({ label, preview, onSelect }: FrameCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      onSelect(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    onSelect(null);
  };

  const handleReupload = (event: React.MouseEvent) => {
    event.stopPropagation();
    openFilePicker();
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_IMAGE_TYPES}
      className="hidden"
      onChange={handleChange}
    />
  );

  if (preview) {
    return (
      <div className="group relative h-[72px] w-[130px] shrink-0 overflow-hidden rounded-lg glass-surface">
        {fileInput}
        <img
          src={preview}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 lg:opacity-100">
          <button
            type="button"
            onClick={handleReupload}
            aria-label={`Replace ${label}`}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Remove ${label}`}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openFilePicker}
      className="relative flex h-[72px] w-[130px] shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg glass-surface transition-colors hover:border-accent/30"
    >
      {fileInput}
      <ImagePlus className="h-5 w-5 text-text-dim" />
      <span className="font-inter text-xs font-medium text-text-muted">
        {label}
      </span>
    </button>
  );
}

interface VideoFrameUploadProps {
  startFrame: string | null;
  endFrame: string | null;
  onStartFrameChange: (url: string | null) => void;
  onEndFrameChange: (url: string | null) => void;
}

export default function VideoFrameUpload({
  startFrame,
  endFrame,
  onStartFrameChange,
  onEndFrameChange,
}: VideoFrameUploadProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-3 pb-1 pt-0.5">
      <FrameCard
        label="Start Frame"
        preview={startFrame}
        onSelect={onStartFrameChange}
      />
      <ArrowRight className="h-4 w-4 shrink-0 text-text-dim" aria-hidden />
      <FrameCard
        label="End Frame"
        preview={endFrame}
        onSelect={onEndFrameChange}
      />
    </div>
  );
}
