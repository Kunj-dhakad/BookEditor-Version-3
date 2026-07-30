"use client";
import React from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import useEditorStore, { ChartType } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";



export const chartCards: { type: ChartType; title: string }[] = [
  { type: "bar", title: "Bar Chart" },
  { type: "pie", title: "Pie Chart" },
  { type: "line", title: "Line Chart" },
  { type: "area", title: "Area Chart" },
  { type: "radar", title: "Radar Chart" },
];

const style = {
  primaryColor: "#4F46E5",
  secondaryColor: "#06B6D4",
  background: "#fff",
  gridColor: "#e2e8f0",
  axisColor: "#64748b",
  labelColor: "#334155",
  legendColor: "#334155",
  borderRadius: 8,
  padding: 12,
  showLegend: true,
  legendPosition: "bottom" as const,
  showGrid: true,
  showLabels: false,
  showXAxis: true,
  showYAxis: true,
  fontSize: 11,
  fontFamily: "Arial",
  fontWeight: 400,
  animation: true,
  animationDuration: 400,
};
export default function Charts() {
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const back = useEditorUIStore((s) => s.setActiveElementsCategory);
  const canvas = slides[activeSlide];
  const insert = (chartType: ChartType) => {
    const width = Math.min(400, Math.max(220, (canvas?.width ?? 432) - 32));
    const height = Math.min(260, Math.max(160, (canvas?.height ?? 240) - 32));
    addElement({
      type: "chart",
      x: Math.max(16, ((canvas?.width ?? width) - width) / 2),
      y: Math.max(16, ((canvas?.height ?? height) - height) / 2),
      width,
      height,
      rotation: 0,
      chartType,
      title: "Sales",
      data: [
        { label: "A", value: 30 },
        { label: "B", value: 55 },
        { label: "C", value: 80 },
        { label: "D", value: 45 },
        { label: "E", value: 60 },
      ],
      style,
    });
  };
  return (
    <div className="h-full p-3">
      <div className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => back(null)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="kd-toolPanel-heding-text">Charts</h2>
          <p className="text-[11px] text-slate-500">Elements / Chart Library</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {chartCards.map((chart) => (
          <button
            key={chart.type}
            type="button"
            onClick={() => insert(chart.type)}
            className="rounded-xl border p-4 text-left hover:border-violet-400"
          >
            <BarChart3 className="mb-4 text-violet-600" />
            <span className="block text-sm font-semibold">{chart.title}</span>
            <span className="text-xs text-slate-500">Insert instantly</span>
          </button>
        ))}
      </div>
    </div>
  );
}
