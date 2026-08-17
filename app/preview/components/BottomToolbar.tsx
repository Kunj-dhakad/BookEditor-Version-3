"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useBookPreview } from "../context/BookPreviewContext";
import { DEFAULT_ZOOM } from "../constants/reader";

const ICON_BUTTON =
  "flex cursor-pointer items-center gap-1.5 rounded-lg p-2 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800";

export default function BottomToolbar() {
  const {
    currentPage,
    totalPages,
    goToPage,
    viewMode,
    setViewMode,
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoomLevel,
    reset,
    isSpeaking,
    isPaused,
    narrationMessage,
    speak,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
  } = useBookPreview();

  const [pageInput, setPageInput] = useState(String(currentPage));

  // The field mirrors the reader until the user types in it. Synced during
  // render so a page turn never shows the previous number for a frame.
  const [syncedPage, setSyncedPage] = useState(currentPage);
  if (syncedPage !== currentPage) {
    setSyncedPage(currentPage);
    setPageInput(String(currentPage));
  }

  const commitPageInput = () => {
    const value = parseInt(pageInput, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= totalPages) goToPage(value);
    else setPageInput(String(currentPage));
  };

  return (
    <footer className="relative bottom-0 z-50 flex min-h-[60px] w-full flex-col items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 shadow-md md:flex-row md:gap-0 md:px-6 md:py-0">
      {narrationMessage && (
        <div className="pointer-events-none absolute bottom-[72px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/95 px-4 py-2 font-sans text-xs text-white shadow-xl">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-rose-500" />
          <span className="font-semibold tracking-wide">{narrationMessage}</span>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:w-1/3 md:justify-start">
        <button type="button" onClick={reset} title="Reset" className={ICON_BUTTON}>
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === "index" ? "flipbook" : "index")}
          title={viewMode === "index" ? "Close pages" : "Open pages"}
          className={
            viewMode === "index"
              ? "flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs font-semibold text-blue-700"
              : ICON_BUTTON
          }
        >
          <List className="h-4 w-4" />
          <span>Pages</span>
        </button>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:w-1/3">
        {totalPages > 0 ? (
          <div className="flex items-center gap-1 text-sm font-medium text-slate-700 sm:gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="cursor-pointer rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitPageInput();
              }}
              onBlur={commitPageInput}
              aria-label="Page number"
              className="h-7 w-10 rounded border border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <span className="hidden text-xs text-slate-400 sm:inline">of</span>
            <span className="text-xs text-slate-400 sm:hidden">/</span>
            <span className="text-xs font-bold text-slate-600">{totalPages}</span>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="cursor-pointer rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="font-sans text-xs text-slate-400">No pages</span>
        )}

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-3xs">
          <button
            type="button"
            onClick={speak}
            disabled={isSpeaking}
            title="Read this page aloud"
            className={`cursor-pointer rounded-md p-1.5 transition-all disabled:opacity-30 ${
              isSpeaking && !isPaused
                ? "bg-emerald-600 font-bold text-white"
                : "text-slate-600 hover:bg-white hover:text-emerald-700"
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={pauseSpeech}
            disabled={!isSpeaking || isPaused}
            title="Pause"
            className={`cursor-pointer rounded-md p-1.5 transition-all disabled:opacity-30 ${
              isSpeaking && isPaused
                ? "bg-amber-500 text-white"
                : "text-slate-600 hover:bg-white hover:text-amber-600"
            }`}
          >
            <Pause className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={resumeSpeech}
            disabled={!isSpeaking || !isPaused}
            title="Resume"
            className="cursor-pointer rounded-md p-1.5 text-slate-600 transition-all hover:bg-white hover:text-sky-600 disabled:opacity-30"
          >
            <Play className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={stopSpeech}
            disabled={!isSpeaking}
            title="Stop"
            className="cursor-pointer rounded-md p-1.5 text-slate-600 transition-all hover:bg-white hover:text-rose-600 disabled:opacity-30"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-1.5 md:w-1/3 md:justify-end md:gap-2.5">
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom out"
          className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[42px] select-none text-center font-mono text-xs font-bold text-slate-700">
          {zoomLevel}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom in"
          className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(DEFAULT_ZOOM)}
          title="Reset zoom"
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  );
}
