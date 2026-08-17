"use client";

import React, { useState, useEffect } from 'react';
import { useBook } from '../context/BookStateContext';
import {
  RefreshCw,
  List,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause,
  Square
} from 'lucide-react';

export function BottomToolbar() {
  const {
    currentPage,
    setPage,
    totalPages,
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoomLevel,
    resetBook,
    viewMode,
    setViewMode,
    isSpeaking,
    isPaused,
    ttsMessage,
    speakCurrentPage,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useBook();

  const [tempPageInput, setTempPageInput] = useState<string>(currentPage.toString());

  // Keep temporary typed page input in sync with current page state
  useEffect(() => {
    setTempPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(tempPageInput, 10);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        setPage(val);
      } else {
        setTempPageInput(currentPage.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const val = parseInt(tempPageInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setPage(val);
    } else {
      setTempPageInput(currentPage.toString());
    }
  };

  const handleIndexClick = () => {
    if (viewMode === 'index') {
      setViewMode('flipbook');
    } else {
      setViewMode('index');
    }
  };

  return (
    <footer className="relative min-h-[60px] py-3 md:py-0 w-full border-t border-slate-200 bg-white text-slate-750 flex flex-col md:flex-row items-center justify-between px-4 md:px-6 bottom-0 z-50 shadow-md gap-3 md:gap-0">

      {ttsMessage && (
        <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs py-2 px-4 rounded-lg shadow-xl border border-slate-800 flex items-center gap-2 select-none animate-bounce font-sans pointer-events-none transition-all">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold tracking-wide">{ttsMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap w-full md:w-1/3 justify-center md:justify-start">
        <button
          id="btn-toolbar-refresh"
          onClick={resetBook}
          title="Reset Book to First Page & Default Zoom"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          id="btn-toolbar-index"
          onClick={handleIndexClick}
          title={viewMode === 'index' ? "Close Index View" : "Open Pages Index View"}
          className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
            viewMode === 'index'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-3xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <List className={`w-4 h-4 ${viewMode === 'index' ? 'text-blue-700' : 'text-blue-600'}`} />
          <span>Index</span>
        </button>

      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full md:w-1/3">
        {totalPages > 0 ? (
          <div className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-700">
            {/* Nav Left Button */}
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800  cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">


              {/* Typeable Input */}
              <input
                id="toolbar-page-input"
                type="text"
                value={tempPageInput}
                onChange={(e) => setTempPageInput(e.target.value)}
                onKeyDown={handlePageInputSubmit}
                onBlur={handlePageInputBlur}
                className="w-10 h-7 text-center text-xs font-bold border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 text-slate-800"
                title="Type page number and press Enter"
              />

              <span className="text-xs text-slate-400 select-none">or</span>

              {/* Selection Dropdown */}
              <select
                id="toolbar-page-select"
                value={currentPage}
                onChange={(e) => setPage(parseInt(e.target.value, 10))}
                className="h-7 text-xs border border-slate-200 rounded px-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-semibold cursor-pointer text-slate-800 animate-none opacity-100"
                title="Select page from dropdown"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <option key={pNum} value={pNum}>
                    Pg {pNum}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-400 text-xs sm:inline hidden">of</span>
            <span className="text-slate-400 text-xs sm:hidden">/</span>
            <span className="text-slate-600 font-bold text-xs">{totalPages}</span>

            {/* Nav Right Button */}
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-sans">Awaiting pages...</span>
        )}

        {/* TTS Audio Controls Container */}
        <div
          id="tts-controls-wrapper"
          className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5 shadow-3xs"
        >
          {/* 1. Playback / Speaker Button */}
          <button
            id="tts-btn-play"
            disabled={isSpeaking}
            onClick={speakCurrentPage}
            title="Read Current Page Aloud"
            className={`p-1.5 rounded-md cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none ${
              isSpeaking && !isPaused
                ? 'bg-emerald-600 text-white shadow-sm scale-102 font-bold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* 2. Pause Button */}
          <button
            id="tts-btn-pause"
            onClick={pauseSpeech}
          // disabled={!isSpeaking || isPaused}
            title="Pause Reading"
            className={`p-1.5 rounded-md cursor-pointer transition-all duration-200 ${
              isSpeaking && isPaused
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>

          {/* 3. Resume Button */}
          <button
            id="tts-btn-resume"
            onClick={resumeSpeech}
            disabled={!isSpeaking || !isPaused}
            title="Resume Reading"
            className="p-1.5 rounded-md text-slate-600 hover:text-sky-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200"
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          {/* 4. Stop Button */}
          <button
  id="tts-btn-stop"
  type="button"
  onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("STOP BUTTON CLICKED");
    stopSpeech();
  }}
  title="Stop Reading"
  className="p-1.5 rounded-md text-slate-600 hover:text-rose-600 hover:bg-white cursor-pointer transition-all duration-200"
>
  <Square
    className="w-3.5 h-3.5 fill-current pointer-events-none"
  />
</button>
        </div>
      </div>

      {/* Right Section: Zoom Controls */}
      <div className="flex items-center gap-1.5 md:gap-2.5 w-full md:w-1/3 justify-center md:justify-end">
        <button
          id="btn-toolbar-zoom-out"
          onClick={zoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-slate-700 min-w-[42px] text-center font-mono select-none">
          {zoomLevel}%
        </span>

        <button
          id="btn-toolbar-zoom-in"
          onClick={zoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          id="btn-toolbar-zoom-reset"
          onClick={() => setZoomLevel(100)}
          title="Reset Zoom to 100%"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}

export default BottomToolbar;
