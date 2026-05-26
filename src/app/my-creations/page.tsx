"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  formatCreationDate,
  loadCreations,
  type StoredCreation,
} from "@/lib/creationsStorage";
import { Download, Heart, Image as ImageIcon, Video, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "image" | "video";

export default function MyCreationsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [creations, setCreations] = useState<StoredCreation[]>([]);

  useEffect(() => {
    setCreations(loadCreations());
  }, []);

  const filtered =
    filter === "all"
      ? creations
      : creations.filter((item) => item.type === filter);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">My Creations</h1>
            <p className="text-text-muted text-sm">{filtered.length} items</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="flex glass-surface rounded-lg p-1 gap-1">
              {[
                { value: "all", label: "All" },
                { value: "image", label: "Images", icon: ImageIcon },
                { value: "video", label: "Videos", icon: Video },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as Filter)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    filter === value
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {label}
                </button>
              ))}
            </div>

            {/* View mode */}
            <div className="flex glass-surface rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid" ? "glass-chip text-text" : "text-text-muted"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "list" ? "glass-chip text-text" : "text-text-muted"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border/60 bg-[#0a0a0a]">
            <p className="font-inter text-sm text-text-dim">No creations yet</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden glass-card">
                <div className="relative aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg glass-control flex items-center justify-center">
                      <Download className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="w-7 h-7 rounded-lg glass-control flex items-center justify-center"
                    >
                      <Heart className={`w-3 h-3 ${likedItems.has(item.id) ? "text-red-400 fill-red-400" : "text-white"}`} />
                    </button>
                  </div>
                  {/* Type badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium bg-accent/80 text-white">
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-text-muted line-clamp-2">{item.prompt}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-text-dim">{item.style}</span>
                    <span className="text-xs text-text-dim">
                      {formatCreationDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl glass-card hover:border-accent/30 transition-all group"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{item.prompt}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-accent/20 text-accent">
                      {item.type}
                    </span>
                    <span className="text-xs text-text-dim">{item.style}</span>
                    <span className="text-xs text-text-dim">{item.aspectRatio}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-text-dim">
                    {formatCreationDate(item.createdAt)}
                  </span>
                  <button className="w-7 h-7 rounded-lg glass-chip flex items-center justify-center hover:border-accent/40">
                    <Download className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="w-7 h-7 rounded-lg glass-chip flex items-center justify-center hover:border-accent/40"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedItems.has(item.id) ? "text-red-400 fill-red-400" : "text-text-muted"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
