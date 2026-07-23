"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImageData } from "@/app/Store/editorStore";

interface Props {
  targetRef: React.RefObject<HTMLElement | null>;
  data: ImageData;
  updateButton: (patch: Partial<ImageData>) => void;
  onClose: () => void;
}

const CORNER_PRESETS = [0, 10, 25, 50];

const BorderRadiusPanel: React.FC<Props> = ({ targetRef, data, updateButton, onClose }) => {
  const [pos, setPos]         = useState({ top: 0, left: 0, visible: false });
  const [mounted, setMounted] = useState(false);
//   const [toast, setToast]     = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const borderRadius = data.borderRadius ?? "0%";
  const radiusNum    = parseInt(String(borderRadius)) || 0;



  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: Math.max(8, rect.left + rect.width / 2 - 148), visible: true });
    };
    updatePos();
    let rafId: number;
    const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [targetRef]);

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
        top: pos.top, left: pos.left,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(-6px)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-[296px] flex flex-col gap-0 overflow-hidden">

       

        <div className="flex flex-col gap-3 p-3">

          {/* Slider + Input */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-gray-500 tracking-wide">Radius</span>
            <div className="flex items-center gap-2">
              <input
                type="range" min={0} max={50} step={1} value={radiusNum}
                onChange={(e) => updateButton({ borderRadius: `${e.target.value}%` })}
                className="flex-1 accent-violet-600"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number" min={0} max={50} value={radiusNum}
                  onChange={(e) => updateButton({ borderRadius: `${e.target.value}%` })}
                  className="w-12 px-1.5 py-1 text-xs text-center bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition"
                />
                <span className="text-[11px] text-gray-400">%</span>
              </div>
            </div>
          </div>

        

          {/* Presets */}
          <div className="flex gap-1">
            {CORNER_PRESETS.map((r) => (
              <button
                key={r}
                onClick={() => updateButton({ borderRadius: `${r}%` })}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg border transition
                  ${radiusNum === r
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}
              >
                {r === 0 ? "▪ 0" : r === 50 ? "● 50" : `${r}%`}
              </button>
            ))}
          </div>
        </div>

      
      </div>

      {/* {toast && <p className="mt-2 text-xs text-center text-gray-500">{toast}</p>} */}
    </div>
  );
};

export default BorderRadiusPanel;