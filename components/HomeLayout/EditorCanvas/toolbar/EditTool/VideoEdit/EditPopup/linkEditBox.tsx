"use client";
import React, { useEffect, useRef, useState } from "react";
import { VideoData } from "@/app/Store/editorStore";

interface ToolbarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  data: VideoData;
  updateButton: (patch: Partial<VideoData>) => void;
  onClose: () => void;
}

const LinkEditBox: React.FC<ToolbarProps> = ({ targetRef, data, updateButton, onClose }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
  const [link, setLink] = useState(data.link || "");
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 - 144, visible: true });
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

  const handleCopy = () => {
    if (!link.trim()) { showToast("Nothing to copy"); return; }
    navigator.clipboard.writeText(link).then(() => showToast("Link copied!"));
  };

  const handleDelete = () => { setLink(""); showToast("Link cleared"); };

  const handleDone = () => {
    if (!link.trim()) { showToast("Please enter a link"); return; }
    updateButton({ link });
    onClose();
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
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(-6px)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Popup box */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 w-72 shadow-lg flex flex-col gap-2.5">
        
        {/* Label */}
        <span className="text-xs font-medium text-gray-500 tracking-wide">Display mode</span>

        {/* Input */}
        <input
          autoFocus
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleDone();
            if (e.key === "Escape") onClose();
          }}
          placeholder="Paste a link"
          className="w-full px-2.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition placeholder:text-gray-400"
        />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {/* Copy */}
            <button
              onClick={handleCopy}
              title="Copy link"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            {/* Delete */}
            <button
              onClick={handleDelete}
              title="Delete"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>

          {/* Done button */}
          <button
            onClick={handleDone}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-medium transition"
          >
            Done
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <p className="mt-2 text-xs text-center text-gray-500">{toast}</p>
      )}
    </div>
  );
};

export default LinkEditBox;