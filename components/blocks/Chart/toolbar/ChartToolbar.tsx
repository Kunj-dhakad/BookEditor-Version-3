"use client";

import React, { useMemo } from "react";
import { BarChart3, Grid3X3, List, Play, Settings2 } from "lucide-react";
import useEditorStore, { ChartData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

export default function ChartToolbar() {
  const slides = useEditorStore((s) => s.slides); const activeSlide = useEditorStore((s) => s.activeSlide); const activeId = useEditorStore((s) => s.activeElementId); const updateElement = useEditorStore((s) => s.updateElement);
  const chart = useMemo(() => slides[activeSlide]?.elements.find((element) => element.id === activeId)?.data as ChartData | undefined, [activeId, activeSlide, slides]);
  if (!chart || chart.type !== "chart" || !activeId) return null;
  const patchStyle = (next: Partial<ChartData["style"]>) => updateElement(activeId, { style: { ...chart.style, ...next } }, { history: true });
  const button = "flex h-8 items-center gap-1 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 hover:bg-slate-50";
  // Settings only ever open from here — selecting a chart no longer reopens them.
  const openSettings = () => {
    const ui = useEditorUIStore.getState();
    if (ui.activePanelType === "main")
      ui.setLastMainPanel(useEditorStore.getState().activeRightPanel);
    useEditorStore.getState().setActiveRightPanel("ChartSettings");
    ui.setActivePanelType("edit");
    if (ui.sidebarWidth === "closed") ui.setSidebarWidth("edit");
  };
  return <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm">
    <BarChart3 size={16} className="text-indigo-600" />
    <select aria-label="Chart type" className="h-8 rounded border border-slate-200 px-2 text-xs" value={chart.chartType} onChange={(e) => updateElement(activeId, { chartType: e.target.value as ChartData["chartType"] }, { history: true })}>{["bar", "line", "pie", "doughnut", "area", "radar"].map((type) => <option key={type} value={type}>{type}</option>)}</select>
    <input aria-label="Chart title" className="h-8 w-28 rounded border border-slate-200 px-2 text-xs" value={chart.title} placeholder="Title" onChange={(e) => updateElement(activeId, { title: e.target.value }, { history: true })} />
    <button type="button" className={`${button} ${chart.style.showLegend ? "bg-indigo-50 text-indigo-700" : ""}`} title="Toggle legend" onClick={() => patchStyle({ showLegend: !chart.style.showLegend })}><List size={14} /> Legend</button>
    <button type="button" className={`${button} ${chart.style.showGrid ? "bg-indigo-50 text-indigo-700" : ""}`} title="Toggle grid" onClick={() => patchStyle({ showGrid: !chart.style.showGrid })}><Grid3X3 size={14} /> Grid</button>
    <button type="button" className={`${button} ${chart.style.animation ? "bg-indigo-50 text-indigo-700" : ""}`} title="Toggle animation" onClick={() => patchStyle({ animation: !chart.style.animation })}><Play size={14} /> Animate</button>
    <button type="button" className={button} title="Chart settings" onClick={openSettings}><Settings2 size={14} /> Settings</button>
  </div>;
}
