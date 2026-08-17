"use client";

import React from "react";
import { useBookPreview } from "../context/BookPreviewContext";
import type { ViewMode } from "../types/view";

interface Props {
  onBack?: () => void;
  backLabel?: string;
}

const MODES: Array<{ mode: ViewMode; label: string; short: string }> = [
  { mode: "flipbook", label: "Flipbook View", short: "Flipbook" },
  { mode: "vertical", label: "Vertical View", short: "Vertical" },
  { mode: "horizontal", label: "Horizontal View", short: "Horizontal" },
];

export default function PreviewHeader({ onBack, backLabel = "Back" }: Props) {
  const { viewMode, setViewMode } = useBookPreview();

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-between border-b border-slate-200 bg-white px-4 text-slate-800 shadow-xs md:px-6">
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button type="button" onClick={onBack} className="kd-btn px-4 py-1">
            {backLabel}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
        {MODES.map(({ mode, label, short }) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            title={label}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
              viewMode === mode
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900"
            }`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{short}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
