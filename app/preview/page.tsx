"use client";

import React, { useEffect, useState } from "react";
import useEditorStore from "@/app/Store/editorStore";
import { BookStateProvider } from "./components/ebook/BookStateContext";
import PreviewHeader from "./components/ebook/PreviewHeader";
import BookReader from "./components/ebook/BookReader";
import NavButton from "./components/ebook/NavButton";
import BottomToolbar from "./components/ebook/BottomToolbar";

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve(useEditorStore.persist.rehydrate()).finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  
  if (!ready) {
    return <main className="h-dvh bg-slate-200" aria-busy="true" />;
  }

  return (
    <BookStateProvider>
      <div className="relative h-dvh w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans select-none antialiased selection:bg-blue-600/20 selection:text-blue-900">
        
       
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent_55%)] pointer-events-none" />
        <PreviewHeader />
        <main className="flex-1 min-h-0 w-full flex items-center justify-center relative bg-slate-200 border-b border-slate-200 overflow-hidden z-10 select-none">
          <BookReader />
        
          <NavButton />
        </main>
        <BottomToolbar />
      </div>
    </BookStateProvider>
  );
}
