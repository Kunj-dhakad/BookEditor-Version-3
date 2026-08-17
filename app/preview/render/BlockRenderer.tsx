"use client";

import React, { memo } from "react";
import dynamic from "next/dynamic";
import type { ChapterEntry } from "../types/book";
import type { PreviewBlock } from "../types/blocks";
import TextRenderer from "./TextRenderer";
import IndexRenderer from "./IndexRenderer";
import ImageRenderer from "./ImageRenderer";
import VideoRenderer from "./VideoRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ShapeRenderer from "./ShapeRenderer";
import WatermarkRenderer from "./WatermarkRenderer";
import TableRenderer from "./TableRenderer";
import InteractionRenderer from "./InteractionRenderer";

// recharts pulls in the whole d3 subtree; charts are rare in a book, so the
// renderer loads only for the pages that actually contain one.
const ChartRenderer = dynamic(() => import("./ChartRenderer"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  block: PreviewBlock;
  chapters: ChapterEntry[];
  pageWidth: number;
  pageHeight: number;
  narratingBlockId: string | null;
  onOpenPage: (pageNumber: number) => void;
  onFollowLink: (link: string) => void;
}

/**
 * Maps one parsed block to its renderer. Unknown kinds render nothing, so a
 * book exported by a newer authoring tool still opens in an older reader.
 */
const BlockRenderer = memo(function BlockRenderer({
  block,
  chapters,
  pageWidth,
  pageHeight,
  narratingBlockId,
  onOpenPage,
  onFollowLink,
}: Props) {
  switch (block.kind) {
    case "text":
      return (
        <TextRenderer block={block} narrating={narratingBlockId === block.id} />
      );
    case "index":
      return (
        <IndexRenderer
          block={block}
          chapters={chapters}
          onOpenPage={onOpenPage}
        />
      );
    case "image":
    case "sticker":
      return <ImageRenderer block={block} />;
    case "video":
      return <VideoRenderer block={block} />;
    case "button":
      return <ButtonRenderer block={block} onInternalLink={onFollowLink} />;
    case "shape":
      return <ShapeRenderer block={block} />;
    case "watermark":
      return (
        <WatermarkRenderer
          block={block}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      );
    case "table":
      return <TableRenderer block={block} />;
    case "chart":
      return <ChartRenderer block={block} />;
    case "interaction":
      return <InteractionRenderer block={block} />;
    default:
      return null;
  }
});

export default BlockRenderer;
