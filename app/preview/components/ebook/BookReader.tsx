"use client";
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useBook } from "./BookStateContext";
import BookPage from "./BookPage";
import VerticalReader from "./VerticalReader";
import HorizontalReader from "./HorizontalReader";
import IndexPage from "./IndexPage";

interface PageFlipController {
  turnToPage?: (page: number) => void;
  flip?: (page: number) => void;
  turnPage?: (page: number) => void;
  flipNext?: () => void;
  flipPrev?: () => void;
}

interface PageFlipInstance {
  pageFlip?: (() => PageFlipController) | PageFlipController;
}

interface HTMLFlipBookProps {
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
  onFlip?: (e: { data: number }) => void;
  className?: string;
  children?: React.ReactNode;
}

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as React.ForwardRefExoticComponent<
  HTMLFlipBookProps & React.RefAttributes<PageFlipInstance>
>;

const noopSubscribe = () => () => {};

export function BookReader() {
 const {
  pages,
  viewMode,
  nextPage,
  prevPage,
  setPageFlipRef,
  setCurrentPage,
  zoomLevel,
  bookWidth,
  bookHeight,
  blockMouseFlip,
} = useBook();
  const bookFlipRef = useRef<PageFlipInstance | null>(null);

  const [scale, setScale] = useState<number>(1);
  const [flipReady, setFlipReady] = useState(false);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const pageWidth = bookWidth;
  const pageHeight = bookHeight;
  const [prevViewMode, setPrevViewMode] = useState(viewMode);
  const [prevPages, setPrevPages] = useState(pages);

  if (viewMode !== prevViewMode || pages !== prevPages) {
    setPrevViewMode(viewMode);
    setPrevPages(pages);

    if (viewMode === "flipbook") {
      setFlipReady(false);
    }
  }

  useEffect(() => {
    if (viewMode !== "flipbook" || !pages || pages.length === 0) return;

    const handleResize = () => {
      const navbarHeight = 60;
      const bottomToolbarHeight = 60;
      const availableHeight =
        window.innerHeight - navbarHeight - bottomToolbarHeight;
      const availableWidth = innerWidth - 180;
      const openSpreadWidth = pageWidth * 2;

   
      const calculatedScale = 0.82 * Math.min(
        availableWidth / openSpreadWidth,
        availableHeight / pageHeight,
      );

      setScale(calculatedScale > 0.1 ? calculatedScale : 0.1);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode, pageWidth, pageHeight, pages]);

  useEffect(() => {
    if (viewMode === "flipbook" && bookFlipRef.current) {
      setPageFlipRef(bookFlipRef);
    }

    return () => {
      setPageFlipRef(null);
    };
  }, [viewMode, setPageFlipRef, pages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextPage, prevPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (bookFlipRef.current) {
        setPageFlipRef(bookFlipRef);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [setPageFlipRef]);

  if (!mounted) {
    return null;
  }

  if (pages === null) {
    return (
      <div
        id="invalid-json-fallback"
        className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto p-8 rounded-2xl bg-rose-50/90 border border-rose-100 shadow-xl text-center"
      >
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-rose-900 mb-2 font-sans">
          Invalid Book JSON
        </h3>

        <p className="text-sm text-rose-700 font-sans">
          The config has parsing issues or lacks slide objects. Please correct
          your formatting inside the JSON Editor panel.
        </p>
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-gray-500 font-medium font-sans">
          No pages to display
        </p>
      </div>
    );
  }
      
  if (viewMode === "index") {
    return <IndexPage />;
  }

  if (viewMode === "vertical") {
    return <VerticalReader />;
  }

  if (viewMode === "horizontal") {
    return <HorizontalReader />;
  }

  const pagesArray = pages || [];

  return (
    <div
      id="flipbook-container"
      className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-200"
    >
      <div
        id="flipbook-scale-wrapper"
        style={{
          transform: `scale(${scale * (zoomLevel / 100)})`,
          transformOrigin: "center center",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: flipReady ? 1 : 0,
        }}
        className="flex items-center justify-center select-none animate-none"
      >
        <HTMLFlipBook
          ref={bookFlipRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          showCover={true}
          usePortrait={false}
          drawShadow={true}
          flippingTime={900}
          useMouseEvents={!blockMouseFlip}
          mobileScrollSupport={false}
          maxShadowOpacity={0.4}
          startPage={0}
         
          
          onInit={() => {
            setFlipReady(true);
          }}
          onFlip={(e: { data: number }) => {
            if (e && typeof e.data === "number") {
              setCurrentPage(e.data + 1);
            }
          }}
          className="shadow-2xl"
        >
          {pagesArray.map((page, index) => (
            <BookPage key={page.id || index} page={page} pageIndex={index} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}

export default BookReader;