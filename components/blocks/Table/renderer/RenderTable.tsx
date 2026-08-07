"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, {
  ElementData,
  TableCell,
  TableData,
} from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "@/components/HomeLayout/EditorCanvas/RenderElement/CanvasDragDrop";
import { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";
import FloatingToolBar from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/FloatingToolBar";

type Props = {
  id: string;
  data: ElementData;
  slideIndex: number;
  clipBounds?: PageClipBounds;
};
type CellPosition = { row: number; column: number };

const cloneCells = (cells: TableCell[][]) =>
  cells.map((row) => row.map((cell) => ({ ...cell })));

function RenderTable({ id, data, slideIndex, clipBounds }: Props) {
  const table = data as TableData;
  const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
  const {
    updateElement,
    setActiveElementId,
    setActiveSlide,
    toggleSelectedElementId,
  } = useEditorStore(
    useShallow((s) => ({
      updateElement: s.updateElement,
      setActiveElementId: s.setActiveElementId,
      setActiveSlide: s.setActiveSlide,
      toggleSelectedElementId: s.toggleSelectedElementId,
    })),
  );
  const isSelected = useEditorStore(
    useCallback((s) => s.selectedElementIds.includes(id), [id]),
  );
  const [targetEl, setTargetEl] = useState<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState<CellPosition | null>(null);
  const cellRefs = useRef(new Map<string, HTMLTableCellElement>());
  const tableRef = useRef<HTMLTableElement | null>(null);

  const select = useCallback(
    (event: React.PointerEvent) => {
      setActiveSlide(slideIndex);
      if (event.ctrlKey || event.metaKey || event.shiftKey)
        toggleSelectedElementId(id);
      else {
        setActiveElementId(id);
        const ui = useEditorUIStore.getState();
        ui.setLastMainPanel(useEditorStore.getState().activeRightPanel);
        useEditorStore.getState().setActiveRightPanel("TableSettings");
        ui.setActivePanelType("edit");
        ui.setSidebarWidth("edit");
      }
    },
    [
      id,
      setActiveElementId,
      setActiveSlide,
      slideIndex,
      toggleSelectedElementId,
    ],
  );

  const selectTable = useCallback(() => {
    setActiveSlide(slideIndex);
    setActiveElementId(id);
    const ui = useEditorUIStore.getState();
    ui.setLastMainPanel(useEditorStore.getState().activeRightPanel);
    useEditorStore.getState().setActiveRightPanel("TableSettings");
    ui.setActivePanelType("edit");
    ui.setSidebarWidth("edit");
  }, [id, setActiveElementId, setActiveSlide, slideIndex]);

  const updateCells = useCallback(
    (next: TableCell[][], history = true) => {
      updateElement(id, { cells: next }, { history });
    },
    [id, updateElement],
  );

  const commitCell = useCallback(
    (position: CellPosition, text: string) => {
      const cells = cloneCells(table.cells);
      if (!cells[position.row]?.[position.column]) return;
      cells[position.row][position.column].text = text;
      updateCells(cells);
    },
    [table.cells, updateCells],
  );

  const focusCell = useCallback((row: number, column: number) => {
    const key = `${row}:${column}`;
    setEditing({ row, column });
    requestAnimationFrame(() => cellRefs.current.get(key)?.focus());
  }, []);

  const onCellKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLTableCellElement>,
      row: number,
      column: number,
    ) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const nextIndex = event.shiftKey
          ? row * table.columns + column - 1
          : row * table.columns + column + 1;
        const total = table.rows * table.columns;
        const safeIndex = (nextIndex + total) % total;
        focusCell(
          Math.floor(safeIndex / table.columns),
          safeIndex % table.columns,
        );
        return;
      }
      if (event.key === "Escape") {
        event.currentTarget.blur();
      }
    },
    [focusCell, table.cells, table.columns, table.rows],
  );

  useEffect(() => {
    const element = tableRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const syncHeight = () => {
      const nextHeight = Math.ceil(element.offsetHeight);
      if (nextHeight > table.height + 1)
        updateElement(id, { height: nextHeight }, { history: false });
    };
    const observer = new ResizeObserver(syncHeight);
    observer.observe(element);
    syncHeight();
    return () => observer.disconnect();
  }, [id, table.height, updateElement, table.cells, table.style, table.width]);

  if (data.type !== "table" || table.hidden) return null;
  const style = table.style;
  const rect = {
    x: table.x,
    y: table.y,
    width: table.width,
    height: table.height,
    rotation: table.rotation ?? 0,
  };

  return (
    <>
      <CanvasDragDrop
        id={id}
        rect={rect}
        isSelected={isSelected}
        imageExportMode={imageExportMode}
        clipBounds={clipBounds}
        dragDisabled={Boolean(editing)}
        allowTextSelection={Boolean(editing)}
        onContainerChange={setTargetEl}
        onSelect={select}
        onChange={(next) => updateElement(id, next, { history: true })}
      >
        <table
          ref={tableRef}
          style={{
            width: "100%",
            height: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse",
            background: style.background,
            borderRadius: style.borderRadius,
            overflow: "hidden",
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle ?? "normal",
            textDecoration: style.textDecoration ?? "none",
            color: style.textColor,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
          }}
        >
          <tbody>
            {table.cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  if (cell.hidden) return null;
                  const key = `${rowIndex}:${columnIndex}`;
                  const active =
                    editing?.row === rowIndex && editing.column === columnIndex;
                  return (
                    <td
                      key={key}
                      ref={(el) => {
                        if (el) cellRefs.current.set(key, el);
                        else cellRefs.current.delete(key);
                      }}
                      rowSpan={cell.rowSpan}
                      colSpan={cell.colSpan}
                      contentEditable={!imageExportMode && active}
                      suppressContentEditableWarning
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        if (!table.locked) {
                          selectTable();
                          focusCell(rowIndex, columnIndex);
                        }
                      }}
                      onPointerDown={(event) => {
                        if (active) event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectTable();
                      }}
                      onBlur={(event) => {
                        if (active) {
                          commitCell(
                            { row: rowIndex, column: columnIndex },
                            event.currentTarget.innerText,
                          );
                          setEditing(null);
                        }
                      }}
                      onKeyDown={(event) =>
                        onCellKeyDown(event, rowIndex, columnIndex)
                      }
                      style={{
                        border: `${style.borderWidth}px solid ${style.borderColor}`,
                        background: style.cellBackground,
                        padding: style.padding,
                        boxSizing: "border-box",
                        textAlign: style.textAlign,
                        verticalAlign: style.verticalAlign,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                        overflow: "hidden",
                        outline: active ? "2px solid #4f8ef7" : "none",
                        cursor: active ? "text" : "inherit",
                        userSelect: active ? "text" : "none",
                      }}
                    >
                      {cell.text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CanvasDragDrop>
      {isSelected && !imageExportMode && targetEl && (
        <FloatingToolBar target={targetEl} />
      )}
    </>
  );
}

export default memo(
  RenderTable,
  (previous, next) =>
    previous.id === next.id &&
    previous.data === next.data &&
    previous.slideIndex === next.slideIndex &&
    previous.clipBounds?.width === next.clipBounds?.width &&
    previous.clipBounds?.height === next.clipBounds?.height,
);
