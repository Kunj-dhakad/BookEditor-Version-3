"use client";

import { useCallback, useRef, useState } from "react";
import type { PreviewPage } from "../types/book";
import type { ViewMode } from "../types/view";

/**
 * react-pageflip exposes its controller through a couple of different shapes
 * depending on version, so the handle is probed rather than typed hard.
 */
interface PageFlipHandle {
  current?: PageFlipHandle | null;
  pageFlip?: (() => PageFlipHandle) | PageFlipHandle;
  turnToPage?: (page: number) => void;
  flip?: (page: number) => void;
  turnPage?: (page: number) => void;
  flipNext?: () => void;
  flipPrev?: () => void;
}

interface Args {
  pages: PreviewPage[];
  viewMode: ViewMode;
}

/** DOM ids the scrolling readers tag their page wrappers with. */
export const pageAnchorId = (viewMode: ViewMode, pageNumber: number): string => {
  if (viewMode === "vertical") return `preview-vert-page-${pageNumber}`;
  if (viewMode === "horizontal") return `preview-horiz-page-${pageNumber}`;
  return `preview-page-${pageNumber}`;
};

export function usePageNavigation({ pages, viewMode }: Args) {
  const [currentPage, setCurrentPage] = useState(1);
  const [blockMouseFlip, setBlockMouseFlip] = useState(false);
  const flipRef = useRef<PageFlipHandle | null>(null);

  const totalPages = pages.length;

  const setPageFlipRef = useCallback((value: unknown) => {
    flipRef.current = value as PageFlipHandle | null;
  }, []);

  const getPageFlip = useCallback((): PageFlipHandle | null => {
    let instance: PageFlipHandle | null | undefined = flipRef.current;
    if (!instance) return null;
    if (instance.current) instance = instance.current;
    if (!instance) return null;
    if (typeof instance.pageFlip === "function") return instance.pageFlip();
    return instance.pageFlip ?? instance;
  }, []);

  const scrollToPage = useCallback(
    (pageNumber: number) => {
      const element = document.getElementById(pageAnchorId(viewMode, pageNumber));
      element?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [viewMode],
  );

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (totalPages === 0) return;
      const target = Math.max(1, Math.min(totalPages, pageNumber));
      setCurrentPage(target);

      const flip = getPageFlip();
      if (viewMode === "flipbook" && flip) {
        const zeroBased = target - 1;
        if (typeof flip.turnToPage === "function") flip.turnToPage(zeroBased);
        else if (typeof flip.flip === "function") flip.flip(zeroBased);
        else if (typeof flip.turnPage === "function") flip.turnPage(zeroBased);
        return;
      }
      scrollToPage(target);
    },
    [getPageFlip, scrollToPage, totalPages, viewMode],
  );

  const nextPage = useCallback(() => {
    if (totalPages === 0) return;
    const flip = getPageFlip();
    if (viewMode === "flipbook" && flip?.flipNext) {
      flip.flipNext();
      return;
    }
    goToPage(currentPage + 1);
  }, [currentPage, getPageFlip, goToPage, totalPages, viewMode]);

  const prevPage = useCallback(() => {
    if (totalPages === 0) return;
    const flip = getPageFlip();
    if (viewMode === "flipbook" && flip?.flipPrev) {
      flip.flipPrev();
      return;
    }
    goToPage(currentPage - 1);
  }, [currentPage, getPageFlip, goToPage, totalPages, viewMode]);

  /**
   * Interaction blocks may point at a page id or a 1-based page number; both
   * forms appear in exported books.
   */
  const goToLinkedPage = useCallback(
    (link: string) => {
      const clean = String(link ?? "").trim();
      if (!clean || totalPages === 0) return;

      let index = pages.findIndex((page) => page.id.trim() === clean);
      if (index === -1 && !Number.isNaN(Number(clean))) index = Number(clean) - 1;
      if (index < 0 || index >= totalPages) return;

      goToPage(index + 1);
    },
    [goToPage, pages, totalPages],
  );

  // A shorter book must not leave the reader parked past its last page.
  // Adjusted during render so the clamped page is used on this pass rather
  // than after a second one.
  const [knownTotal, setKnownTotal] = useState(totalPages);
  if (knownTotal !== totalPages) {
    setKnownTotal(totalPages);
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPage,
    goToLinkedPage,
    nextPage,
    prevPage,
    setPageFlipRef,
    blockMouseFlip,
    setBlockMouseFlip,
  };
}
