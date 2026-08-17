"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ChapterEntry, PreviewPage, PreviewTheme } from "../types/book";
import type { ViewMode } from "../types/view";
import {
  DEFAULT_PAGE_BACKGROUND,
  DEFAULT_PAGE_HEIGHT,
  DEFAULT_PAGE_WIDTH,
} from "../constants/reader";
import { useBookSource, type BookSource } from "../hooks/useBookSource";
import { usePageNavigation } from "../hooks/usePageNavigation";
import { useNarration } from "../hooks/useNarration";
import { useZoom } from "../hooks/useZoom";

export interface BookPreviewValue {
  pages: PreviewPage[];
  chapters: ChapterEntry[];
  theme: PreviewTheme;
  /** Set when the JSON could not be turned into a book. */
  parseError: string | null;
  loading: boolean;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  goToPage: (pageNumber: number) => void;
  goToLinkedPage: (link: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageFlipRef: (ref: unknown) => void;

  /** Held while a reader drags inside an interaction, so the page can't flip. */
  blockMouseFlip: boolean;
  setBlockMouseFlip: React.Dispatch<React.SetStateAction<boolean>>;

  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  reset: () => void;

  isSpeaking: boolean;
  isPaused: boolean;
  speakingBlockId: string | null;
  narrationMessage: string;
  speak: () => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;
}

const EMPTY_PAGES: PreviewPage[] = [];
const EMPTY_CHAPTERS: ChapterEntry[] = [];
const FALLBACK_THEME: PreviewTheme = {
  pageWidth: DEFAULT_PAGE_WIDTH,
  pageHeight: DEFAULT_PAGE_HEIGHT,
  background: DEFAULT_PAGE_BACKGROUND,
};

const BookPreviewContext = createContext<BookPreviewValue | null>(null);

export const useBookPreview = (): BookPreviewValue => {
  const value = useContext(BookPreviewContext);
  if (!value) {
    throw new Error("useBookPreview must be used inside a BookPreviewProvider");
  }
  return value;
};

/** Null outside a provider, for components that work in and out of the reader. */
export const useBookPreviewOptional = (): BookPreviewValue | null =>
  useContext(BookPreviewContext);

interface ProviderProps extends BookSource {
  children: ReactNode;
}

export function BookPreviewProvider({ json, jsonUrl, children }: ProviderProps) {
  const { book, loading } = useBookSource({ json, jsonUrl });
  const [viewMode, setViewMode] = useState<ViewMode>("flipbook");

  // A failed parse still has to yield stable empty arrays: a fresh `[]` per
  // render would invalidate every memo and effect keyed on pages.
  const pages = useMemo(() => (book.ok ? book.pages : EMPTY_PAGES), [book]);
  const chapters = useMemo(
    () => (book.ok ? book.chapters : EMPTY_CHAPTERS),
    [book],
  );
  const theme = useMemo(() => (book.ok ? book.theme : FALLBACK_THEME), [book]);

  const navigation = usePageNavigation({ pages, viewMode });
  const zoom = useZoom();
  const narration = useNarration({
    pages,
    currentPage: navigation.currentPage,
  });

  const reset = useCallback(() => {
    zoom.resetZoom();
    navigation.goToPage(1);
  }, [navigation, zoom]);

  const value = useMemo<BookPreviewValue>(
    () => ({
      pages,
      chapters,
      theme,
      parseError: book.ok ? null : book.reason,
      loading,

      viewMode,
      setViewMode,

      currentPage: navigation.currentPage,
      setCurrentPage: navigation.setCurrentPage,
      totalPages: navigation.totalPages,
      goToPage: navigation.goToPage,
      goToLinkedPage: navigation.goToLinkedPage,
      nextPage: navigation.nextPage,
      prevPage: navigation.prevPage,
      setPageFlipRef: navigation.setPageFlipRef,
      blockMouseFlip: navigation.blockMouseFlip,
      setBlockMouseFlip: navigation.setBlockMouseFlip,

      zoomLevel: zoom.zoomLevel,
      zoomIn: zoom.zoomIn,
      zoomOut: zoom.zoomOut,
      setZoomLevel: zoom.setZoomLevel,
      reset,

      isSpeaking: narration.isSpeaking,
      isPaused: narration.isPaused,
      speakingBlockId: narration.speakingBlockId,
      narrationMessage: narration.message,
      speak: narration.speak,
      pauseSpeech: narration.pause,
      resumeSpeech: narration.resume,
      stopSpeech: narration.stop,
    }),
    [
      book,
      chapters,
      loading,
      narration,
      navigation,
      pages,
      reset,
      theme,
      viewMode,
      zoom,
    ],
  );

  return (
    <BookPreviewContext.Provider value={value}>
      {children}
    </BookPreviewContext.Provider>
  );
}

export default BookPreviewContext;
