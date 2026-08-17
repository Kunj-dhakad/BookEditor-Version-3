"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookPreview } from "../context/BookPreviewContext";

const BUTTON_CLASS =
  "pointer-events-auto flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-lg transition-all duration-200 hover:scale-105 hover:text-blue-600 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:h-14 md:w-14";

/** Flipbook-only page arrows; the scrolling readers use the scroll itself. */
export default function NavButton() {
  const { viewMode, currentPage, totalPages, nextPage, prevPage } =
    useBookPreview();

  if (viewMode !== "flipbook" || totalPages === 0) return null;

  return (
    <>
      <div className="pointer-events-none absolute left-4 top-1/2 z-40 -translate-y-1/2 md:left-6">
        <button
          type="button"
          onClick={prevPage}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={BUTTON_CLASS}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 z-40 -translate-y-1/2 md:right-6">
        <button
          type="button"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={BUTTON_CLASS}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </>
  );
}
