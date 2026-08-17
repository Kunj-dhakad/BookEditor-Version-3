"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import PopupPortal from "./PopupPortal";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  label?: string;
}

/**
 * The one dialog frame every reader popup uses: portalled to <body>, backdrop
 * click and Escape both close, and the panel is capped against the viewport so
 * a long form scrolls inside itself instead of running off screen.
 */
export default function PopupShell({
  onClose,
  children,
  maxWidth = 320,
  label = "Dialog",
}: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // The reader's own Escape handler would close the whole preview.
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  return (
    <PopupPortal>
      <div
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/45 p-4"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="relative flex max-h-[min(88vh,760px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_45px_rgba(0,0,0,0.25)]"
          style={{ maxWidth }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2.5 top-2.5 z-[3] flex h-7 w-7 items-center justify-center rounded-full border-0 bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <X size={14} />
          </button>
          <div className="min-w-0 overflow-y-auto overflow-x-hidden px-4 py-5 font-sans text-slate-900">
            {children}
          </div>
        </div>
      </div>
    </PopupPortal>
  );
}
