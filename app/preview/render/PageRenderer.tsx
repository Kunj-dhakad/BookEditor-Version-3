"use client";

import React, { forwardRef, type CSSProperties } from "react";
import type { PreviewPage } from "../types/book";
import { useBookPreview } from "../context/BookPreviewContext";
import BlockRenderer from "./BlockRenderer";

interface Props {
  page: PreviewPage;
  style?: CSSProperties;
  className?: string;
}

/**
 * One page of the book at its authored size. The reader scales the page from
 * outside, so everything in here stays in page coordinates — the same
 * coordinates the exported JSON uses.
 *
 * forwardRef because react-pageflip needs a DOM handle on each leaf.
 */
const PageRenderer = forwardRef<HTMLDivElement, Props>(function PageRenderer(
  { page, style, className },
  ref,
) {
  const { chapters, goToPage, goToLinkedPage, speakingBlockId } =
    useBookPreview();

  return (
    <div
      ref={ref}
      data-page-id={page.id}
      className={`relative shrink-0 overflow-hidden bg-white shadow-md ${className ?? ""}`}
      style={{
        width: page.width,
        height: page.height,
        background: page.background,
        ...style,
      }}
    >
      {page.blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          chapters={chapters}
          pageWidth={page.width}
          pageHeight={page.height}
          narratingBlockId={speakingBlockId}
          onOpenPage={goToPage}
          onFollowLink={goToLinkedPage}
        />
      ))}
    </div>
  );
});

export default PageRenderer;
