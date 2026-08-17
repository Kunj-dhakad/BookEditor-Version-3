"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useBookPreview } from "../context/BookPreviewContext";
import PageRenderer from "../render/PageRenderer";

interface FlipBookProps {
  width: number;
  height: number;
  size?: "fixed" | "stretch";
  showCover?: boolean;
  usePortrait?: boolean;
  drawShadow?: boolean;
  flippingTime?: number;
  useMouseEvents?: boolean;
  mobileScrollSupport?: boolean;
  maxShadowOpacity?: number;
  startPage?: number;
  onInit?: () => void;
  onFlip?: (event: { data: number }) => void;
  className?: string;
  children?: React.ReactNode;
}

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as React.ForwardRefExoticComponent<
  FlipBookProps & React.RefAttributes<unknown>
>;

/** Two-page spread with page-turn animation. */
export default function FlipbookReader() {
  const {
    pages,
    theme,
    zoomLevel,
    blockMouseFlip,
    setCurrentPage,
    setPageFlipRef,
  } = useBookPreview();

  const flipRef = useRef<unknown>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);

  // A new book (or a re-render of the flip component) has to re-announce
  // itself before the toolbar can drive it.
  const [previousPages, setPreviousPages] = useState(pages);
  if (pages !== previousPages) {
    setPreviousPages(pages);
    setReady(false);
  }

  useEffect(() => {
    const fit = () => {
      const chromeHeight = 120; // header + toolbar
      const availableHeight = window.innerHeight - chromeHeight;
      const availableWidth = window.innerWidth - 180;
      const next =
        0.82 *
        Math.min(
          availableWidth / (theme.pageWidth * 2),
          availableHeight / theme.pageHeight,
        );
      setScale(next > 0.1 ? next : 0.1);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [theme.pageHeight, theme.pageWidth]);

  useEffect(() => {
    setPageFlipRef(flipRef);
    return () => setPageFlipRef(null);
  }, [setPageFlipRef, pages]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-slate-200">
      <div
        className="flex select-none items-center justify-center"
        style={{
          transform: `scale(${scale * (zoomLevel / 100)})`,
          transformOrigin: "center center",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: ready ? 1 : 0,
        }}
      >
        <HTMLFlipBook
          ref={flipRef}
          width={theme.pageWidth}
          height={theme.pageHeight}
          size="fixed"
          showCover
          usePortrait={false}
          drawShadow
          flippingTime={900}
          // Held down while a reader is interacting with a block, so dragging
          // inside a slideshow or form doesn't turn the page.
          useMouseEvents={!blockMouseFlip}
          mobileScrollSupport={false}
          maxShadowOpacity={0.4}
          startPage={0}
          onInit={() => {
            setPageFlipRef(flipRef);
            setReady(true);
          }}
          onFlip={(event) => {
            if (typeof event?.data === "number") setCurrentPage(event.data + 1);
          }}
          className="shadow-2xl"
        >
          {pages.map((page) => (
            <PageRenderer key={page.id} page={page} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
