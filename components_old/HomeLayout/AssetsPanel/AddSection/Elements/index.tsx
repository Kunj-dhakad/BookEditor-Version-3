"use client";

import React, { lazy, Suspense } from "react";
import { BarChart3, Grid2X2, ImageIcon, Shapes, Sticker, Table2 } from "lucide-react";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { ElementsCategory } from "./types";

const AllElements = lazy(() => import("./AllElements"));
const ShapesLibrary = lazy(() => import("@/components/blocks/Shape/components"));
const GifsLibrary = lazy(() => import("@/components/blocks/GIF/components"));
const StickersLibrary = lazy(() => import("@/components/blocks/Sticker/components"));
const TableDataLibrary = lazy(() => import("@/components/blocks/Table/components"));
const ChartsLibrary = lazy(() => import("@/components/blocks/Chart/components"));

const cards: { id: ElementsCategory; title: string; caption: string; icon: React.ReactNode }[] = [
  { id: "all", title: "All Elements", caption: "Browse every asset", icon: <Grid2X2 size={22} /> },
  { id: "shapes", title: "Shapes", caption: "Lines, icons & graphics", icon: <Shapes size={22} /> },
  { id: "gifs", title: "GIFs", caption: "Animated media", icon: <ImageIcon size={22} /> },
  { id: "stickers", title: "Stickers", caption: "Decorative stickers", icon: <Sticker size={22} /> },
  { id: "table", title: "Table Data", caption: "Custom tables", icon: <Table2 size={22} /> },
  { id: "charts", title: "Charts", caption: "Visualize data", icon: <BarChart3 size={22} /> },
];

const libraries: Record<ElementsCategory, React.LazyExoticComponent<React.ComponentType>> = {
  all: AllElements, shapes: ShapesLibrary, gifs: GifsLibrary, stickers: StickersLibrary, table: TableDataLibrary, charts: ChartsLibrary,
};

/** Elements category router. Libraries own their data, controls, and insert actions. */
export default function Elements() {
  const activeCategory = useEditorUIStore((s) => s.activeElementsCategory) as ElementsCategory | null;
  const setActiveCategory = useEditorUIStore((s) => s.setActiveElementsCategory);
  if (!activeCategory) return <div className="h-full overflow-y-auto p-3"><h2 className="kd-toolPanel-heding-text mb-1">Elements</h2><p className="mb-4 text-xs text-slate-500">Choose what you want to add</p><div className="grid grid-cols-2 gap-3">{cards.map((card) => <button key={card.id} type="button" onClick={() => setActiveCategory(card.id)} className="group rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500"><span className="mb-3 inline-flex rounded-lg bg-violet-50 p-2 text-violet-600 group-hover:bg-violet-600 group-hover:text-white">{card.icon}</span><span className="block text-sm font-semibold text-slate-800">{card.title}</span><span className="mt-1 block text-[11px] text-slate-500">{card.caption}</span></button>)}</div></div>;
  const Library = libraries[activeCategory];
  return <Suspense fallback={<div className="grid h-full place-items-center text-sm text-slate-500">Loading library…</div>}><Library /></Suspense>;
}
