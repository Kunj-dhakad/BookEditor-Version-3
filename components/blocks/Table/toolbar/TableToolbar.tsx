"use client";

import { Columns3, Combine, Minus, Rows3, Split, Table2 } from "lucide-react";
import useEditorStore, { TableCell } from "@/app/Store/editorStore";

const copyCells = (cells: TableCell[][]) => cells.map((row) => row.map((cell) => ({ ...cell })));

export default function TableToolbar() {
  const updateElement = useEditorStore((s) => s.updateElement);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const element = slides[activeSlide]?.elements.find((item) => item.id === activeElementId);
  const table = element?.data;
  if (!element || !table || table.type !== "table") return null;
  const id = element.id;
  const patch = (rows: number, columns: number, cells: TableCell[][]) => updateElement(id, { rows, columns, cells }, { history: true });
  const addRow = () => patch(table.rows + 1, table.columns, [...copyCells(table.cells), Array.from({ length: table.columns }, () => ({ text: "" }))]);
  const deleteRow = () => table.rows > 1 && patch(table.rows - 1, table.columns, copyCells(table.cells).slice(0, -1));
  const addColumn = () => patch(table.rows, table.columns + 1, copyCells(table.cells).map((row) => [...row, { text: "" }]));
  const deleteColumn = () => table.columns > 1 && patch(table.rows, table.columns - 1, copyCells(table.cells).map((row) => row.slice(0, -1)));
  const merge = () => {
    if (table.columns < 2) return;
    const cells = copyCells(table.cells); cells[0][0].colSpan = 2; cells[0][1].hidden = true;
    patch(table.rows, table.columns, cells);
  };
  const split = () => {
    const cells = copyCells(table.cells); cells[0][0].colSpan = undefined; if (cells[0][1]) cells[0][1].hidden = false;
    patch(table.rows, table.columns, cells);
  };
  const button = "kd-icon-btn-main kd-tool-btn";
  return <div className="kd-text-toolbar flex items-center gap-1 px-2 py-1" onMouseDown={(event) => {
    if (!(event.target instanceof HTMLInputElement)) event.preventDefault();
  }}>
    <button title="Add row" className={button} onClick={addRow}><Rows3 size={15} /></button>
    <button title="Delete row" className={button} onClick={deleteRow}><Minus size={15} /></button>
    <button title="Add column" className={button} onClick={addColumn}><Columns3 size={15} /></button>
    <button title="Delete column" className={button} onClick={deleteColumn}><Table2 size={15} /></button>
    <button title="Merge first two cells" className={button} onClick={merge}><Combine size={15} /></button>
    <button title="Split merged cell" className={button} onClick={split}><Split size={15} /></button>
    <input aria-label="Border color" type="color" value={table.style.borderColor} onChange={(event) => updateElement(id, { style: { ...table.style, borderColor: event.target.value } }, { history: true })} />
    <input aria-label="Cell fill" type="color" value={table.style.cellBackground} onChange={(event) => updateElement(id, { style: { ...table.style, cellBackground: event.target.value } }, { history: true })} />
  </div>;
}
