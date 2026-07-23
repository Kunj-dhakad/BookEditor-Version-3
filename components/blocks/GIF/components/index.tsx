"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

export type GifAsset = {
  id: string;
  title: string;
  src: string;
  tags: string[];
};

const fallback: GifAsset[] = [
  {
    id: "gif-celebrate",
    title: "Celebrate",
    src: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
    tags: ["party", "celebrate"],
  },
  {
    id: "gif-hello",
    title: "Hello",
    src: "https://media.giphy.com/media/xTiIzJSKB4l7xTouE8/giphy.gif",
    tags: ["hello", "wave"],
  },
  {
    id: "gif-love",
    title: "Love",
    src: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
    tags: ["love", "heart"],
  },
  {
    id: "gif-success",
    title: "Success",
    src: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
    tags: ["success", "thumbs up"],
  },
  {
    id: "gif-idea",
    title: "Idea",
    src: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif",
    tags: ["idea", "light bulb"],
  },
];

export async function getGifs(query = ""): Promise<GifAsset[]> {
  try {
    const response = await fetch(`/api/gifs?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const assets = await response.json();
      if (Array.isArray(assets) && assets.length) return assets;
    }
  } catch {}
  const needle = query.trim().toLowerCase();
  return needle
    ? fallback.filter((asset) =>
        `${asset.title} ${asset.tags.join(" ")}`.toLowerCase().includes(needle),
      )
    : fallback;
}

export default function GIFs() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GifAsset[]>([]);
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const back = useEditorUIStore((s) => s.setActiveElementsCategory);
  const canvas = slides[activeSlide];
  useEffect(() => {
    let live = true;
    getGifs(query).then((items) => live && setGifs(items));
    return () => {
      live = false;
    };
  }, [query]);
  const insert = (gif: GifAsset) => {
    const size = 160;
    addElement({
      type: "image",
      assetKind: "gif",
      src: gif.src,
      alt: gif.title,
      x: Math.max(16, ((canvas?.width ?? size) - size) / 2),
      y: Math.max(16, ((canvas?.height ?? size) - size) / 2),
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      fit: "contain",
      objectFit: "contain",
    });
  };
  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={() => back(null)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="kd-toolPanel-heding-text">GIFs</h2>
          <p className="text-[11px] text-slate-500">Elements / GIF Library</p>
        </div>
      </div>
      <label className="mb-3 flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
        <Search size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto kd-custom-scrollbar">
        {gifs.map((gif) => (
          <button
            key={gif.id}
            type="button"
            onClick={() => insert(gif)}
            className="overflow-hidden rounded-lg border text-left hover:border-violet-400"
          >
            <div className="relative aspect-square bg-slate-50">
              <Image
                src={gif.src}
                alt={gif.title}
                fill
                unoptimized
                loading="lazy"
                className="object-contain p-2"
              />
            </div>
            <span className="block truncate px-2 py-1.5 text-xs font-medium">
              {gif.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
