"use client";
import React from "react";
import { ArrowLeft, Table2 } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

export const tablePresets = [
  { id: "custom", title: "Custom Table", rows: 3, columns: 3 },
];

export default function TableData() {
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const back = useEditorUIStore((s) => s.setActiveElementsCategory);
  const canvas = slides[activeSlide];
  const insert = () => {
    const width = Math.min(400, Math.max(120, (canvas?.width ?? 432) - 32));
    const height = Math.min(180, Math.max(90, (canvas?.height ?? 240) - 32));
    const rows = 3;
    const columns = 3;
    addElement({
      type: "table",
      x: Math.max(16, ((canvas?.width ?? width) - width) / 2),
      y: Math.max(16, ((canvas?.height ?? height) - height) / 2),
      width,
      height,
      rotation: 0,
      rows,
      columns,
      cells: Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({ text: "" })),
      ),
      style: {
        borderColor: "#000",
        borderWidth: 1,
        background: "#fff",
        cellBackground: "#fff",
        padding: 8,
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: 400,
        textColor: "#111",
        lineHeight: 1.35,
        letterSpacing: 0,
        textAlign: "left",
        verticalAlign: "middle",
      },
    });
  };
  return (
    <div className="h-full p-3">
      <div className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => back(null)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="kd-toolPanel-heding-text">Table Data</h2>
          <p className="text-[11px] text-slate-500">Elements / Table Library</p>
        </div>
      </div>
      <div className="grid gap-3">
        {tablePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={insert}
            className="rounded-xl border p-4 text-left hover:border-violet-400"
          >
            <Table2 className="mb-3 text-violet-600" />
            <span className="block text-sm font-semibold">{preset.title}</span>
            <span className="text-xs text-slate-500">
              {preset.rows} × {preset.columns} editable table
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
