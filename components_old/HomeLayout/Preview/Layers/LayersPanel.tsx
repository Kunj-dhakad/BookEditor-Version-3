import { memo, useCallback, useRef, useState } from "react";
import useEditorStore, { ElementData, ElementType } from "@/app/Store/editorStore";
import { KdPreviewlayer6dot } from "@/lib/icon/icons";


function getDisplayText(data: ElementData): string | null {
  if (data.type === "text" || data.type === "button") {
    return data.text?.trim() ? data.text.trim().slice(0, 18) : null;
  }
  if (data.type === "table") return `${data.rows} × ${data.columns} table`;
  if (data.type === "chart") return data.title || `${data.chartType} chart`;
  return null;
}

function buildNames(elements: ElementType[]): Map<string, string> {
  const counter: Partial<Record<ElementData["type"], number>> = {};
  const map = new Map<string, string>();

  for (const el of elements) {
    const t = el.data.type;
    counter[t] = (counter[t] ?? 0) + 1;

    const displayText = getDisplayText(el.data);
    if (displayText) {
      map.set(el.id, displayText);
    } else {
      map.set(el.id, `${t.charAt(0).toUpperCase() + t.slice(1)} ${counter[t]}`);
    }
  }

  return map;
}
interface RowProps {
  el: ElementType;
  name: string;
  isSelected: boolean;
  isDragOver: boolean;
  realIndex: number;
  onSelect: (id: string) => void;
  onDragStart: (e: React.DragEvent, realIndex: number, id: string) => void;
  onDragOver: (e: React.DragEvent, realIndex: number) => void;
  onDrop: (e: React.DragEvent, realIndex: number) => void;
  onDragEnd: () => void;
}

const LayerRow = memo(function LayerRow({
  el, name, isSelected, isDragOver,
  onSelect, onDragStart, onDragOver, onDrop, onDragEnd, realIndex,
}: RowProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, realIndex, el.id)}
      onDragOver={(e) => onDragOver(e, realIndex)}
      onDrop={(e) => onDrop(e, realIndex)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(el.id)}
      className={`w-full mt-3  flex items-center border cursor-pointer select-none transition-all duration-100 overflow-hidden
    kd-layer-row
    ${isSelected ? "kd-layer-row-selected" : ""}
    ${isDragOver ? "kd-layer-row-dragover" : ""}
  `}
    >
      {/* Left Purple Box */}
      <div
        className={`py-2 px-3 rounded-tl-lg rounded-bl-lg flex items-center justify-center shrink-0 transition-colors
      kd-layer-icon-box
      ${isSelected ? "kd-layer-icon-box-selected" : ""}
    `}
      >
        <div className="grid grid-cols-1">
          <KdPreviewlayer6dot />
        </div>
      </div>

      {/* Text */}
      <p className="Kd-layer-text-Style flex items-center justify-center flex-1 truncate transition-all">
        {name}
      </p>
    </div>
  );
});


export function LayersPanel() {
  const elements = useEditorStore((s) => s.slides[s.activeSlide]?.elements ?? []);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const setActiveElementId = useEditorStore((s) => s.setActiveElementId);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);

  const reversed = [...elements].reverse();
  const nameMap = buildNames(elements);

  const dragRealIdxRef = useRef<number | null>(null);
  const dragElIdRef = useRef<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const onDragStart = useCallback((e: React.DragEvent, realIndex: number, id: string) => {
    dragRealIdxRef.current = realIndex;
    dragElIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((e: React.DragEvent, realIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(realIndex);
  }, []);

  const onDrop = useCallback((e: React.DragEvent, toRealIndex: number) => {
    e.preventDefault();
    setDragOverIdx(null);

    const from = dragRealIdxRef.current;
    const id = dragElIdRef.current;
    dragRealIdxRef.current = null;
    dragElIdRef.current = null;

    if (from === null || id === null || from === toRealIndex) return;

    const diff = toRealIndex - from;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) bringForward(id);
    } else {
      for (let i = 0; i < Math.abs(diff); i++) sendBackward(id);
    }
  }, [bringForward, sendBackward]);

  const onDragEnd = useCallback(() => {
    dragRealIdxRef.current = null;
    dragElIdRef.current = null;
    setDragOverIdx(null);
  }, []);

  const onSelect = useCallback((id: string) => {
    setActiveElementId(activeElementId === id ? null : id);
  }, [activeElementId, setActiveElementId]);

  return (
    <div

      className="w-full h-full flex items-center justify-center flex-col select-none"
    >
      <div className="w-full h-full kd-custom-scrollbar px-2 overflow-y-auto  ">
        {reversed.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", padding: "20px 12px" }}>
            No elements
          </p>
        ) : (
          reversed.map((el, revIdx) => {
            const realIndex = elements.length - 1 - revIdx;
            return (
              <LayerRow
                key={el.id}
                el={el}
                name={nameMap.get(el.id) ?? el.data.type}
                isSelected={activeElementId === el.id}
                isDragOver={dragOverIdx === realIndex}
                realIndex={realIndex}
                onSelect={onSelect}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            );
          })
        )}
      </div>
    </div>


  );
}

export default LayersPanel;
