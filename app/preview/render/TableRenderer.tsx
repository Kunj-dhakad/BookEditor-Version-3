"use client";

import React, { memo } from "react";
import type { TableBlock } from "../types/blocks";
import { blockFrame } from "../utils/blockStyles";
import {
  tableCellStyle,
  tableFrameStyle,
} from "@/components/blocks/Table/lib/tableStyle";

interface Props {
  block: TableBlock;
}

const TableRenderer = memo(function TableRenderer({ block }: Props) {
  if (block.hidden) return null;
  const { style } = block;
  const columnCount = block.cells[0]?.length ?? 0;

  return (
    <div data-block-id={block.id} style={blockFrame(block, { opacity: block.opacity })}>
      {/* Same style helpers the canvas uses, so the reader cannot drift from it. */}
      <table style={tableFrameStyle(style)}>
        <tbody>
          {block.cells.map((row, rowIndex) => (
            // Same equal share the editor uses, so preview matches the canvas.
            <tr
              key={rowIndex}
              style={{ height: `${100 / block.cells.length}%` }}
            >
              {row.map((cell, columnIndex) =>
                cell.hidden ? null : (
                  <td
                    key={`${rowIndex}:${columnIndex}`}
                    className="kd-table-cell"
                    rowSpan={cell.rowSpan}
                    colSpan={cell.colSpan}
                    style={tableCellStyle(style, {
                      row: rowIndex,
                      column: columnIndex,
                      rowCount: block.cells.length,
                      columnCount,
                      colSpan: cell.colSpan,
                    })}
                  >
                    {cell.text}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default TableRenderer;
