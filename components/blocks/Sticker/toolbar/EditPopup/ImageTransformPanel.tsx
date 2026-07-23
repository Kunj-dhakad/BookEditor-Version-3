"use client";
import React, { useEffect, useRef, useState } from "react";
import { SVGData } from "@/app/Store/editorStore";

interface Props {
  data: SVGData;
  updateButton: (patch: Partial<SVGData>) => void;
  targetRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

const angles = [0, 90, 180, 270];

const ImageTransformPanel: React.FC<Props> = ({ data, updateButton, targetRef, onClose }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const POPUP_WIDTH = 248;
  const rotation = data.rotation ?? 0;

  // ✅ RAF loop — LinkEditBox jaisa, center aligned
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2 - POPUP_WIDTH / 2, // ✅ center align
        visible: true,
      });
    };

    updatePos();
    let rafId: number;
    const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [targetRef]);

  // ✅ Outside click close — LinkEditBox jaisa
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

  // ✅ Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleRotate = (delta: number) => {
    updateButton({ rotation: (rotation + delta + 360) % 360 });
  };

  if (!pos.visible) return null;

  return (
    <div
      ref={popupRef}
      data-element="true"
      className="fixed z-9999"
      style={{
        top: pos.top,
        left: pos.left,
        width: POPUP_WIDTH,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(-6px)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 flex flex-col gap-0.5">

        {/* ── ROTATE ── */}
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest px-1 pt-1 pb-0.5">
          Rotate
        </span>

        <button
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm text-gray-800 w-full text-left"
          onClick={() => handleRotate(-90)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          <span className="flex-1">Rotate left</span>
          <span className="text-xs text-gray-400">−90°</span>
        </button>

        <button
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm text-gray-800 w-full text-left"
          onClick={() => handleRotate(90)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
          <span className="flex-1">Rotate right</span>
          <span className="text-xs text-gray-400">+90°</span>
        </button>

        {/* Angle presets */}
        <div className="flex gap-1 px-1 pb-1 pt-0.5">
          {angles.map((a) => (
            <button
              key={a}
              onClick={() => updateButton({ rotation: a })}
              className={`flex-1 py-1 text-xs font-medium rounded-lg border transition
                ${rotation === a
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
            >
              {a}°
            </button>
          ))}
        </div>

        <div className="h-px bg-gray-100 my-0.5" />

        {/* ── FLIP ── */}
        {/* <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest px-1 pt-0.5 pb-0.5">
          Flip
        </span>

        <button
          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
            ${data.flipX ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
          onClick={() => updateButton({ flipX: !data.flipX })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><line x1="12" y1="20" x2="12" y2="4"/>
          </svg>
          <span className="flex-1">Flip horizontal</span>
          {data.flipX && (
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
          )}
        </button>

        <button
          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
            ${data.flipY ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
          onClick={() => updateButton({ flipY: !data.flipY })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><line x1="4" y1="12" x2="20" y2="12"/>
          </svg>
          <span className="flex-1">Flip vertical</span>
          {data.flipY && (
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
          )}
        </button> */}

      </div>
    </div>
  );
};

export default ImageTransformPanel;