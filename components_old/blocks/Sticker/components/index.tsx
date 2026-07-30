"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
export type StickerAsset = { id: string; title: string; src: string; tags: string[] };

const fallback: StickerAsset[] = [
  { id: "sticker-star", title: "Star", src: "https://api.dicebear.com/9.x/icons/svg?seed=star", tags: ["star", "favorite"] },
  { id: "sticker-heart", title: "Heart", src: "https://api.dicebear.com/9.x/icons/svg?seed=heart", tags: ["heart", "love"] },
  { id: "sticker-smile", title: "Smile", src: "https://api.dicebear.com/9.x/icons/svg?seed=smile", tags: ["smile", "happy"] },
  { id: "sticker-bolt", title: "Bolt", src: "https://api.dicebear.com/9.x/icons/svg?seed=bolt", tags: ["bolt", "energy"] },
  { id: "sticker-flower", title: "Flower", src: "https://api.dicebear.com/9.x/icons/svg?seed=flower", tags: ["flower", "nature"] },
];

export async function getStickers(query = ""): Promise<StickerAsset[]> {
  try {
    const response = await fetch(`/api/stickers?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const assets = await response.json();
      if (Array.isArray(assets) && assets.length) return assets;
    }
  } catch {  }
  const needle = query.trim().toLowerCase();
  return needle ? fallback.filter((asset) => `${asset.title} ${asset.tags.join(" ")}`.toLowerCase().includes(needle)) : fallback;
}




export default function Stickers() {
  const [query, setQuery] = useState("");
  const [stickers, setStickers] = useState<StickerAsset[]>([]);
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const back = useEditorUIStore((s) => s.setActiveElementsCategory);
  const canvas = slides[activeSlide];
  useEffect(() => {
    let live = true;
    getStickers(query).then((items) => live && setStickers(items));
    return () => {
      live = false;
    };
  }, [query]);
  const insert = (sticker: StickerAsset) => {
    const size = 160;
    addElement({
      type: "image",
      assetKind: "sticker",
      src: sticker.src,
      alt: sticker.title,
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
          <h2 className="kd-toolPanel-heding-text">Stickers</h2>
          <p className="text-[11px] text-slate-500">
            Elements / Sticker Library
          </p>
        </div>
      </div>
      <label className="mb-3 flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
        <Search size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stickers..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto kd-custom-scrollbar">
        {stickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => insert(sticker)}
            className="overflow-hidden rounded-lg border text-left hover:border-violet-400"
          >
            <div className="relative aspect-square bg-slate-50">
              <Image
                src={sticker.src}
                alt={sticker.title}
                fill
                unoptimized
                loading="lazy"
                className="object-contain p-2"
              />
            </div>
            <span className="block truncate px-2 py-1.5 text-xs font-medium">
              {sticker.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
