"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useBook } from './BookStateContext';
import BookPage from './BookPage';
import { BookPageData } from '../../types/book';

export function VerticalReader() {
  const { pages, currentPage, setCurrentPage, bookWidth, bookHeight, zoomLevel } = useBook();
  const [scale, setScale] = useState<number>(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const paddingX = 48;
      const paddingY = 48;
      const availableWidth = rect.width - paddingX;
      const availableHeight = rect.height - paddingY;

      const scaleX = availableWidth / bookWidth;
      const scaleY = availableHeight / bookHeight;
      const calculatedScale = Math.min(1, scaleX, scaleY);
      setScale(calculatedScale > 0.1 ? calculatedScale : 0.1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [bookWidth, bookHeight]);

  const lastPageSwiped = useRef<number | null>(null);

  useEffect(() => {
    if (currentPage !== lastPageSwiped.current) {
      lastPageSwiped.current = currentPage;
      const el = document.getElementById(`vert-page-wrapper-${currentPage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPage]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !pages || pages.length === 0) return;

    const observerOptions = {
      root: viewport,
      rootMargin: '0px',
      threshold: 0.5, 
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const indexStr = entry.target.getAttribute('data-page-index');
          if (indexStr) {
            const index = parseInt(indexStr, 10);
            if (!isNaN(index) && index !== lastPageSwiped.current) {
              lastPageSwiped.current = index;
              setCurrentPage(index);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    pages.forEach((_, idx) => {
      const el = document.getElementById(`vert-page-wrapper-${idx + 1}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pages, setCurrentPage]);

  const pagesList = pages || [];

  return (
    <div
      ref={viewportRef}
      id="vertical-viewport"
      className="w-full h-full overflow-y-auto snap-y snap-mandatory bg-slate-200 select-none flex flex-col items-center"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {pagesList.map((page: BookPageData, index: number) => {
        const pageNum = index + 1;
        const isCurrent = currentPage === pageNum;

        return (
          <section
            key={page.id || `vert-page-${index}`}
            id={`vert-page-wrapper-${pageNum}`}
            data-page-index={pageNum}
            className="min-h-full min-w-full h-full snap-start flex items-center justify-center relative shrink-0"
          >
            <div
              style={{
                width: `${bookWidth * scale * (zoomLevel / 100)}px`,
                height: `${bookHeight * scale * (zoomLevel / 100)}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              className="transition-all duration-200"
            >
              <div
                style={{
                  transform: `scale(${scale * (zoomLevel / 100)})`,
                  transformOrigin: 'center center',
                  width: `${bookWidth}px`,
                  height: `${bookHeight}px`,
                  position: 'absolute',
                }}
                className={`rounded-xl overflow-hidden transition-all duration-300 shadow-2xl ${
                  isCurrent ? 'ring-4 ring-blue-600/40 shadow-blue-600/15' : 'ring-1 ring-slate-300'
                }`}
              >
                <BookPage page={page} pageIndex={index} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default VerticalReader;
