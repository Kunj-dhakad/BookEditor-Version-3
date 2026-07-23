"use client";
import React, { useEffect, useRef, useState } from "react";
import { SVGData } from "@/app/Store/editorStore";

interface Props {
  targetRef: React.RefObject<HTMLElement | null>;
  data: SVGData;
  updateButton: (patch: Partial<SVGData>) => void;
  onClose: () => void;
}

const STROKE_STYLES = [
  { id: "none", label: "None", dash: null, icon: "⊘" },
  { id: "solid", label: "Solid", dash: "none" },
  { id: "dashed", label: "Dashed", dash: "8 4" },
  { id: "inset", label: "inset", dash: "12 6" },
  { id: "dotted", label: "Dotted", dash: "2 4" },
] as const;


const ImageStrokePanel: React.FC<Props> = ({ targetRef, data, updateButton, onClose }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const strokeWidth = data.strokeWidth ?? 0;
  const strokeStyle = data.strokeStyle ?? "none";



  // Position tracking with rAF loop (same as LinkEditBox)
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: Math.max(8, rect.left + rect.width / 2 - 148),
        visible: true,
      });
    };
    updatePos();
    let rafId: number;
    const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [targetRef]);

  // Outside click to close
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !targetRef.current?.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose, targetRef]);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);





  if (!pos.visible) return null;

  return (
    <div
      ref={popupRef}
      data-element="true"
      className="fixed z-9999"
      style={{
        top: pos.top,
        left: pos.left,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(-6px)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-[296px] flex flex-col gap-0 overflow-hidden">

        <div className="flex flex-col gap-3 p-3">
          {/* ── Stroke Style ── */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-gray-500 tracking-wide">Style</span>
            <div className="flex gap-1">
              {STROKE_STYLES.map((s) => (
                <button
                  key={s.id}
                  title={s.label}
                  onClick={() => updateButton({ strokeStyle: s.id === "none" ? undefined : s.id })}
                  className={`
                    flex-1 h-9 flex flex-col items-center justify-center rounded-lg border transition
                    ${strokeStyle === s.id
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  {s.id === "none" ? (
                    <svg width="22" height="14" viewBox="0 0 22 14">
                      <line x1="2" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="3" y1="3" x2="9" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="22" height="14" viewBox="0 0 22 14">
                      <line
                        x1="2" y1="7" x2="20" y2="7"
                        stroke="currentColor" strokeWidth="2"
                        strokeDasharray={s.dash === "none" ? undefined : s.dash}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stroke Weight ── */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-gray-500 tracking-wide">Weight</span>
            <div className="flex items-center gap-2">
              <input
                type="range" min={0} max={20} value={strokeWidth} step={1}
                onChange={(e) => updateButton({ strokeWidth: Number(e.target.value) })}
                className="flex-1 accent-violet-600"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number" min={0} max={20} value={strokeWidth}
                  onChange={(e) => updateButton({ strokeWidth: Number(e.target.value) })}
                  className="w-12 px-1.5 py-1 text-xs text-center bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition"
                />
                <span className="text-[11px] text-gray-400">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStrokePanel;