"use client";

import type { SlideType } from "@/app/Store/editorStore";
import { BookStateProvider } from "./context/BookStateContext";
import PreviewHeader from "./components/PreviewHeader";
import BookReader from "./components/BookReader";
import NavButton from "./components/NavButton";
import BottomToolbar from "./components/BottomToolbar";

export interface PreviewBookProps {
  document?: SlideType[];
  jsonUrl?: string;
  mode?: "page" | "modal";
  onClose?: () => void;
}

export default function PreviewBook({
  document,
  jsonUrl,
  mode = "page",
  onClose,
}: PreviewBookProps) {
  return (
    <BookStateProvider document={document} jsonUrl={jsonUrl}>
      {/* In "page" mode this owns the viewport (h-dvh), unchanged. In "modal"
          mode it fills whatever box the dialog gives it instead. */}
      <div
        className={`relative ${
          mode === "modal" ? "h-full" : "h-dvh"
        } w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans select-none antialiased selection:bg-blue-600/20 selection:text-blue-900`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent_55%)] pointer-events-none" />
        <PreviewHeader
          onBack={mode === "modal" ? onClose : undefined}
          backLabel={mode === "modal" ? "Close" : "Back"}
        />
        <main className="flex-1 min-h-0 w-full flex items-center justify-center relative bg-slate-200 border-b border-slate-200 overflow-hidden z-10 select-none">
          <BookReader />
          <NavButton />
        </main>
        <BottomToolbar />
      </div>
    </BookStateProvider>
  );
}
