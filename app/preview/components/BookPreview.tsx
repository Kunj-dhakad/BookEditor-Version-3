"use client";

import React from "react";
import { BookPreviewProvider } from "../context/BookPreviewContext";
import type { PreviewMode } from "../types/view";
import BottomToolbar from "./BottomToolbar";
import NavButton from "./NavButton";
import PreviewHeader from "./PreviewHeader";
import ReaderStage from "./ReaderStage";

export interface BookPreviewProps {
  /** Exported book JSON. */
  json?: string;
  /** Where to fetch the book JSON from, when it is not passed inline. */
  jsonUrl?: string;
  /** "page" owns the viewport; "modal" fills whatever box it is given. */
  mode?: PreviewMode;
  onClose?: () => void;
}


export default function BookPreview({
  json,
  jsonUrl,
  mode = "page",
  onClose,
}: BookPreviewProps) {
  return (
    <BookPreviewProvider json={json} jsonUrl={jsonUrl}>
      <div
        className={`relative flex ${
          mode === "modal" ? "h-full" : "h-dvh"
        } w-full select-none flex-col overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-600/20 selection:text-blue-900`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent_55%)]" />

        <PreviewHeader
          onBack={mode === "modal" ? onClose : undefined}
          backLabel={mode === "modal" ? "Close" : "Back"}
        />

        <main className="relative z-10 flex w-full min-h-0 flex-1 select-none items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-200">
          <ReaderStage />
          <NavButton />
        </main>

        <BottomToolbar />
      </div>
    </BookPreviewProvider>
  );
}
