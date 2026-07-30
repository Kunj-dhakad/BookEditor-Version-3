"use client";

import React, { useMemo } from "react";
import useEditorStore, { ChartData, ChartPoint } from "@/app/Store/editorStore";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-600"><span>{label}</span>{children}</label>;
const input = "w-24 rounded border border-slate-200 bg-white px-2 py-1 text-xs";
const num = (value: string, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export default function ChartSettings() {
  const slides = useEditorStore((s) => s.slides); const activeSlide = useEditorStore((s) => s.activeSlide); const activeId = useEditorStore((s) => s.activeElementId); const updateElement = useEditorStore((s) => s.updateElement);
  const chart = useMemo(() => slides[activeSlide]?.elements.find((item) => item.id === activeId)?.data as ChartData | undefined, [activeId, activeSlide, slides]);
  if (!chart || chart.type !== "chart" || !activeId) return null;
  const patch = (next: Partial<ChartData>) => updateElement(activeId, next, { history: true });
  const patchStyle = (next: Partial<ChartData["style"]>) => patch({ style: { ...chart.style, ...next } });
  const patchPoint = (index: number, next: Partial<ChartPoint>) => patch({ data: chart.data.map((point, i) => i === index ? { ...point, ...next } : point) });
  return <section className="pb-5">
    <div className="px-3 py-2 text-xs font-semibold text-slate-700">Chart</div>
    <Field label="Type"><select className={input} value={chart.chartType} onChange={(e) => patch({ chartType: e.target.value as ChartData["chartType"] })}>{["bar", "line", "pie", "doughnut", "area", "radar"].map((type) => <option key={type} value={type}>{type}</option>)}</select></Field>
    <Field label="Width"><input className={input} type="number" min="80" value={chart.width} onChange={(e) => patch({ width: num(e.target.value, chart.width) })} /></Field>
    <Field label="Height"><input className={input} type="number" min="80" value={chart.height} onChange={(e) => patch({ height: num(e.target.value, chart.height) })} /></Field>
    <Field label="Title"><input className={input} value={chart.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
    <Field label="Legend"><select className={input} value={chart.style.showLegend ? chart.style.legendPosition : "hide"} onChange={(e) => patchStyle(e.target.value === "hide" ? { showLegend: false } : { showLegend: true, legendPosition: e.target.value as ChartData["style"]["legendPosition"] })}>{["top", "bottom", "left", "right", "hide"].map((value) => <option key={value}>{value}</option>)}</select></Field>
    <Field label="Grid"><input type="checkbox" checked={chart.style.showGrid} onChange={(e) => patchStyle({ showGrid: e.target.checked })} /></Field>
    <Field label="Animation"><input type="checkbox" checked={chart.style.animation} onChange={(e) => patchStyle({ animation: e.target.checked })} /></Field>
    <Field label="Duration"><input className={input} type="number" min="0" step="100" value={chart.style.animationDuration} onChange={(e) => patchStyle({ animationDuration: num(e.target.value, chart.style.animationDuration) })} /></Field>
    <div className="mt-3 px-3 py-2 text-xs font-semibold text-slate-700">Colors & labels</div>
    <Field label="Primary"><input type="color" value={chart.style.primaryColor} onChange={(e) => patchStyle({ primaryColor: e.target.value })} /></Field><Field label="Secondary"><input type="color" value={chart.style.secondaryColor} onChange={(e) => patchStyle({ secondaryColor: e.target.value })} /></Field><Field label="Background"><input type="color" value={chart.style.background} onChange={(e) => patchStyle({ background: e.target.value })} /></Field><Field label="Grid color"><input type="color" value={chart.style.gridColor} onChange={(e) => patchStyle({ gridColor: e.target.value })} /></Field><Field label="Axis color"><input type="color" value={chart.style.axisColor} onChange={(e) => patchStyle({ axisColor: e.target.value })} /></Field><Field label="Text color"><input type="color" value={chart.style.labelColor} onChange={(e) => patchStyle({ labelColor: e.target.value, legendColor: e.target.value })} /></Field>
    <Field label="Labels"><input type="checkbox" checked={chart.style.showLabels} onChange={(e) => patchStyle({ showLabels: e.target.checked })} /></Field><Field label="Font size"><input className={input} type="number" min="8" value={chart.style.fontSize} onChange={(e) => patchStyle({ fontSize: num(e.target.value, chart.style.fontSize) })} /></Field><Field label="Bold"><input type="checkbox" checked={Number(chart.style.fontWeight) >= 700} onChange={(e) => patchStyle({ fontWeight: e.target.checked ? 700 : 400 })} /></Field>
    <div className="mt-3 px-3 py-2 text-xs font-semibold text-slate-700">Axes</div><Field label="X axis"><input type="checkbox" checked={chart.style.showXAxis} onChange={(e) => patchStyle({ showXAxis: e.target.checked })} /></Field><Field label="Y axis"><input type="checkbox" checked={chart.style.showYAxis} onChange={(e) => patchStyle({ showYAxis: e.target.checked })} /></Field><Field label="Padding"><input className={input} type="number" min="0" value={chart.style.padding} onChange={(e) => patchStyle({ padding: num(e.target.value, chart.style.padding) })} /></Field><Field label="Radius"><input className={input} type="number" min="0" value={chart.style.borderRadius} onChange={(e) => patchStyle({ borderRadius: num(e.target.value, chart.style.borderRadius) })} /></Field>
    <div className="mt-3 px-3 py-2 text-xs font-semibold text-slate-700">Data</div>
    <div className="px-3 space-y-2">{chart.data.map((point, index) => <div key={index} className="flex gap-1"><input aria-label="Label" className="min-w-0 flex-1 rounded border px-2 py-1 text-xs" value={point.label} onChange={(e) => patchPoint(index, { label: e.target.value })} /><input aria-label="Value" className="w-16 rounded border px-2 py-1 text-xs" type="number" value={point.value} onChange={(e) => patchPoint(index, { value: num(e.target.value, point.value) })} /><button className="kd-btn text-xs" onClick={() => patch({ data: chart.data.filter((_, i) => i !== index) })} disabled={chart.data.length <= 1}>−</button></div>)}<button className="kd-btn w-full text-xs" onClick={() => patch({ data: [...chart.data, { label: `Item ${chart.data.length + 1}`, value: 0 }] })}>Add row</button></div>
  </section>;
}
