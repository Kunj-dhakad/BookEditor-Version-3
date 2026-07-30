"use client";

import React, { useMemo } from "react";
import useEditorStore, { TableCell, TableData } from "@/app/Store/editorStore";

const value = (input: string, fallback: number) => Number.isFinite(Number(input)) ? Number(input) : fallback;
const copy = (cells: TableCell[][]) => cells.map((row) => row.map((cell) => ({ ...cell })));
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-600"><span>{label}</span>{children}</label>;

export default function TableSettings() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const table = useMemo(() => slides[activeSlide]?.elements.find((element) => element.id === activeId)?.data as TableData | undefined, [activeId, activeSlide, slides]);
  if (!table || table.type !== "table" || !activeId) return null;
  const input = "w-20 rounded border border-slate-200 bg-white px-2 py-1 text-xs";
  const updateStyle = (patch: Partial<TableData["style"]>) => updateElement(activeId, { style: { ...table.style, ...patch } }, { history: true });
  const resize = (rows: number, columns: number) => updateElement(activeId, { rows, columns, cells: Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => ({ ...table.cells[row]?.[column] ?? { text: "" } }))) }, { history: true });
  const insertRow = () => updateElement(activeId, { rows: table.rows + 1, cells: [...copy(table.cells), Array.from({ length: table.columns }, () => ({ text: "" }))] }, { history: true });
  const insertColumn = () => updateElement(activeId, { columns: table.columns + 1, cells: copy(table.cells).map((row) => [...row, { text: "" }]) }, { history: true });
  return <section className="pb-4">
    <div className="px-3 py-2 text-xs font-semibold text-slate-700">Table</div>
    <Field label="Rows"><input className={input} type="number" min="1" value={table.rows} onChange={(e) => resize(Math.max(1, value(e.target.value, table.rows)), table.columns)} /></Field>
    <Field label="Columns"><input className={input} type="number" min="1" value={table.columns} onChange={(e) => resize(table.rows, Math.max(1, value(e.target.value, table.columns)))} /></Field>
    <Field label="Table width"><input className={input} type="number" min="40" value={table.width} onChange={(e) => updateElement(activeId, { width: value(e.target.value, table.width) }, { history: true })} /></Field>
    <Field label="Table height"><input className={input} type="number" min="20" value={table.height} onChange={(e) => updateElement(activeId, { height: value(e.target.value, table.height) }, { history: true })} /></Field>
    <Field label="Cell size"><span>{Math.round(table.width / table.columns)} × {Math.round(table.height / table.rows)} px</span></Field>
    <Field label="Border"><input className={input} type="number" min="0" value={table.style.borderWidth} onChange={(e) => updateStyle({ borderWidth: value(e.target.value, table.style.borderWidth) })} /></Field>
    <Field label="Border color"><input type="color" value={table.style.borderColor} onChange={(e) => updateStyle({ borderColor: e.target.value })} /></Field>
    <Field label="Table fill"><input type="color" value={table.style.background} onChange={(e) => updateStyle({ background: e.target.value })} /></Field>
    <Field label="Cell fill"><input type="color" value={table.style.cellBackground} onChange={(e) => updateStyle({ cellBackground: e.target.value })} /></Field>
    <Field label="Padding"><input className={input} type="number" min="0" value={table.style.padding} onChange={(e) => updateStyle({ padding: value(e.target.value, table.style.padding) })} /></Field>
    <Field label="Radius"><input className={input} type="number" min="0" value={table.style.borderRadius ?? 0} onChange={(e) => updateStyle({ borderRadius: value(e.target.value, 0) })} /></Field>
    <div className="mt-3 px-3 py-2 text-xs font-semibold text-slate-700">Text</div>
    <Field label="Font"><input className={input} value={table.style.fontFamily} onChange={(e) => updateStyle({ fontFamily: e.target.value })} /></Field>
    <Field label="Font size"><input className={input} type="number" min="1" value={table.style.fontSize} onChange={(e) => updateStyle({ fontSize: value(e.target.value, table.style.fontSize) })} /></Field>
    <Field label="Color"><input type="color" value={table.style.textColor} onChange={(e) => updateStyle({ textColor: e.target.value })} /></Field>
    <Field label="Weight"><select className={input} value={String(table.style.fontWeight)} onChange={(e) => updateStyle({ fontWeight: Number(e.target.value) })}><option value="400">Regular</option><option value="700">Bold</option></select></Field>
    <Field label="Italic"><input type="checkbox" checked={table.style.fontStyle === "italic"} onChange={(e) => updateStyle({ fontStyle: e.target.checked ? "italic" : "normal" })} /></Field>
    <Field label="Underline"><input type="checkbox" checked={table.style.textDecoration === "underline"} onChange={(e) => updateStyle({ textDecoration: e.target.checked ? "underline" : "none" })} /></Field>
    <Field label="Alignment"><select className={input} value={table.style.textAlign} onChange={(e) => updateStyle({ textAlign: e.target.value as TableData["style"]["textAlign"] })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></Field>
    <Field label="Vertical"><select className={input} value={table.style.verticalAlign} onChange={(e) => updateStyle({ verticalAlign: e.target.value as TableData["style"]["verticalAlign"] })}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></Field>
    <div className="mt-3 grid grid-cols-2 gap-2 px-3"><button className="kd-btn text-xs" onClick={insertRow}>Add row</button><button className="kd-btn text-xs" onClick={() => table.rows > 1 && resize(table.rows - 1, table.columns)}>Delete row</button><button className="kd-btn text-xs" onClick={insertColumn}>Add column</button><button className="kd-btn text-xs" onClick={() => table.columns > 1 && resize(table.rows, table.columns - 1)}>Delete column</button></div>
  </section>;
}
