"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import { ViewMode } from "../types/book";
import type { SlideType } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { useBookDocument } from "../hooks/useBookDocument";
import { useZoom } from "../hooks/useZoom";
import { usePageNavigation } from "../hooks/usePageNavigation";
import { useTts } from "../hooks/useTts";
import type { BookPageData } from "../types/book";

export interface BookContextValue {
  rawJson: string;
  setRawJson: (json: string) => void;

  pages: BookPageData[] | null;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
  setPage: (pageNumber: number) => void;
  goToLinkedPage: (linkValue: string) => void;

  totalPages: number;

  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;

  resetBook: () => void;

  scale: number;
  setPageFlipRef: (refValue: unknown) => void;

  bookWidth: number;
  bookHeight: number;

  isSpeaking: boolean;
  isPaused: boolean;
  speakingElementId: string | null;
  speakingWordIndex: number | null;
  ttsMessage: string;

  speakCurrentPage: () => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;

  blockMouseFlip: boolean;
  setBlockMouseFlip: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookStateContext = createContext<BookContextValue | null>(null);

export const useBook = (): BookContextValue => {
  const context = useContext(BookStateContext);

  if (!context) {
    throw new Error("useBook must be used within a BookStateProvider");
  }

  return context;
};

export const useBookOptional = (): BookContextValue | null => {
  return useContext(BookStateContext);
};

interface BookStateProviderProps {
  document?: SlideType[];
  jsonUrl?: string;
  children: ReactNode;
}

export const BookStateProvider = ({
  document,
  jsonUrl,
  children,
}: BookStateProviderProps) => {
  useEffect(() => {
    const ui = useEditorUIStore.getState();
    const previous = ui.imageExportMode;
    ui.setImageExportMode(true);
    return () => useEditorUIStore.getState().setImageExportMode(previous);
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>("flipbook");

  const { rawJson, setRawJson, pages, bookWidth, bookHeight } =
    useBookDocument({ document, jsonUrl });

  const nav = usePageNavigation({ pages, viewMode, bookWidth, bookHeight });
  const zoom = useZoom();
  const tts = useTts({ pages, currentPage: nav.currentPage });

  const resetBook = useCallback(() => {
    zoom.setZoomLevel(100);
    nav.goToPage(1);
  }, [zoom, nav]);

  return (
    <BookStateContext.Provider
      value={{
        rawJson,
        setRawJson,
        pages,
        viewMode,
        setViewMode,
        currentPage: nav.currentPage,
        setCurrentPage: nav.setCurrentPage,
        nextPage: nav.nextPage,
        prevPage: nav.prevPage,
        goToPage: nav.goToPage,
        setPage: nav.setPage,
        goToLinkedPage: nav.goToLinkedPage,
        totalPages: nav.totalPages,
        zoomLevel: zoom.zoomLevel,
        zoomIn: zoom.zoomIn,
        zoomOut: zoom.zoomOut,
        setZoomLevel: zoom.setZoomLevel,
        resetBook,
        scale: nav.scale,
        setPageFlipRef: nav.setPageFlipRef,
        bookWidth,
        bookHeight,
        isSpeaking: tts.isSpeaking,
        isPaused: tts.isPaused,
        speakingElementId: tts.speakingElementId,
        speakingWordIndex: tts.speakingWordIndex,
        ttsMessage: tts.ttsMessage,
        speakCurrentPage: tts.speakCurrentPage,
        pauseSpeech: tts.pauseSpeech,
        resumeSpeech: tts.resumeSpeech,
        stopSpeech: tts.stopSpeech,
        blockMouseFlip: nav.blockMouseFlip,
        setBlockMouseFlip: nav.setBlockMouseFlip,
      }}
    >
      {children}
    </BookStateContext.Provider>
  );
};

export default BookStateContext;
