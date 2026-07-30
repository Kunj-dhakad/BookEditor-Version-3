"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
} from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { ElementItem } from "@/components/HomeLayout/AssetsPanel/AddSection/Elements/types";
export default function AllElements() {
  const [items, setItems] = useState<ElementItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const back = useEditorUIStore((s) => s.setActiveElementsCategory);
  const canvas = slides[activeSlide];
  useEffect(() => {
    fetch("/api/elements")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );
  const visible = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All" || item.category === filter),
  );
  const insert = (item: ElementItem) => {
    const size = 150;
    const placement = {
      x: Math.max(16, ((canvas?.width ?? size) - size) / 2),
      y: Math.max(16, ((canvas?.height ?? size) - size) / 2),
      width: size,
      height: size,
      opacity: 1,
      rotation: 0,
      zIndex: 1,
    };
    addElement(
      item.category === "Shapes"
        ? { type: "shape", shape: item.svg_code, ...placement }
        : {
            type: "svg",
            src: item.svg_url,
            ...placement,
            fit: "contain",
            isDragging: false,
            animationType: "None",
          },
    );
  };

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={() => back(null)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="kd-toolPanel-heding-text">All Elements</h2>
          <p className="text-[11px] text-slate-500">
            Elements / Complete Library
          </p>
        </div>
      </div>
      <label className="mb-3 flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
        <Search size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search elements..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${filter === category ? "bg-violet-600 text-white" : "bg-slate-100"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-3 content-start gap-3 overflow-y-auto kd-custom-scrollbar">
        {visible.map((item) => (
          <button
            key={item.id}
            type="button"
            title={item.name}
            onClick={() => insert(item)}
            className="flex aspect-square items-center justify-center rounded-lg border p-2 hover:border-violet-400"
          >
            <Image
              src={item.svg_url}
              alt={item.name}
              width={56}
              height={56}
              unoptimized
              loading="lazy"
              className="h-11 w-11 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
