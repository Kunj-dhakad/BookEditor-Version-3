"use client";

import React from 'react';
import { useBook } from './BookStateContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NavButton() {
  const {
    viewMode,
    currentPage,
    pages,
    nextPage,
    prevPage
  } = useBook();

  if (viewMode !== 'flipbook' || !pages || pages.length === 0) {
    return null;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < pages.length;

  return (
    <>
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <button
          id="nav-button-left"
          onClick={prevPage}
          disabled={!hasPrev}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-all duration-200 pointer-events-auto shadow-lg hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none select-none cursor-pointer"
          aria-label="Previous Page"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <button
          id="nav-button-right"
          onClick={nextPage}
          disabled={!hasNext}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-all duration-200 pointer-events-auto shadow-lg hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none select-none cursor-pointer"
          aria-label="Next Page"
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </>
  );
}

export default NavButton;
