"use client";

import React from 'react';
import { useBook } from '../context/BookStateContext';

interface PreviewHeaderProps {
  onBack?: () => void;
  backLabel?: string;
}

export function PreviewHeader({ onBack, backLabel = 'Back' }: PreviewHeaderProps) {
  const { viewMode, setViewMode } = useBook();

  return (
    <header className="h-[60px] w-full border-b border-slate-200 bg-white text-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-xs">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2.5">
       {onBack && (
         <button onClick={onBack} className='kd-btn py-1 px-4'> {backLabel}</button>
       )}
      </div>

      {/* View Mode Pill Control */}
      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 gap-1">
        <button
          id="btn-flipbook-view"
          onClick={() => setViewMode('flipbook')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            viewMode === 'flipbook'
              ? 'bg-blue-600 text-white shadow-sm scale-102'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
          }`}
          title="Flipbook Mode"
        >
          <span className="hidden sm:inline">Flipbook View</span>
          <span className="sm:hidden">Flipbook</span>
        </button>

        <button
          id="btn-vertical-view"
          onClick={() => setViewMode('vertical')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            viewMode === 'vertical'
              ? 'bg-blue-600 text-white shadow-sm scale-102'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
          }`}
          title="Vertical Scrolling Mode"
        >
          <span className="hidden sm:inline">Vertical View</span>
          <span className="sm:hidden">Vertical</span>
        </button>

        <button
          id="btn-horizontal-view"
          onClick={() => setViewMode('horizontal')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
            viewMode === 'horizontal'
              ? 'bg-blue-600 text-white shadow-sm scale-102'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
          }`}
          title="Horizontal Snapping Mode"
        >
          <span className="hidden sm:inline">Horizontal View</span>
          <span className="sm:hidden">Horizontal</span>
        </button>
      </div>
    </header>
  );
}

export default PreviewHeader;
