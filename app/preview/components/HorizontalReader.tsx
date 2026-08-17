"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBookPreview } from "../context/BookPreviewContext";
import { pageAnchorId } from "../hooks/usePageNavigation";
import PageRenderer from "../render/PageRenderer";

/** Side-to-side swipe, one page snapped per screen. */
export default function HorizontalReader() {
  const { pages, currentPage, setCurrentPage, theme, zoomLevel } =
    useBookPreview();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const syncedPageRef = useRef<number | null>(null);

  useEffect(() => {
    const fit = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const next = Math.min(
        1,
        (rect.width - 48) / theme.pageWidth,
        (rect.height - 48) / theme.pageHeight,
      );
      setScale(next > 0.1 ? next : 0.1);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [theme.pageHeight, theme.pageWidth]);

  useEffect(() => {
    if (currentPage === syncedPageRef.current) return;
    syncedPageRef.current = currentPage;
    document
      .getElementById(pageAnchorId("horizontal", currentPage))
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentPage]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || pages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute("data-page-number"));
          if (Number.isNaN(index) || index === syncedPageRef.current) return;
          syncedPageRef.current = index;
          setCurrentPage(index);
        });
      },
      { root: viewport, threshold: 0.5 },
    );

    pages.forEach((_, index) => {
      const element = document.getElementById(
        pageAnchorId("horizontal", index + 1),
      );
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pages, setCurrentPage]);

  const zoom = scale * (zoomLevel / 100);

  return (
    <div
      ref={viewportRef}
      className="flex h-full w-full snap-x snap-mandatory select-none overflow-x-auto bg-slate-200 pb-2 [scrollbar-width:none]"
    >
      {pages.map((page, index) => {
        const pageNumber = index + 1;
        const isCurrent = currentPage === pageNumber;

        return (
          <section
            key={page.id}
            id={pageAnchorId("horizontal", pageNumber)}
            data-page-number={pageNumber}
            className="relative flex h-full min-w-full shrink-0 snap-center items-center justify-center"
          >
            <div
              className="relative flex items-center justify-center transition-all duration-200"
              style={{
                width: theme.pageWidth * zoom,
                height: theme.pageHeight * zoom,
              }}
            >
              <div
                className={`absolute overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
                  isCurrent
                    ? "ring-4 ring-blue-600/40"
                    : "ring-1 ring-slate-300"
                }`}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  width: theme.pageWidth,
                  height: theme.pageHeight,
                }}
              >
                <PageRenderer page={page} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
