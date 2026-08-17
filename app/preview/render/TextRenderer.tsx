"use client";

import React, { memo, useEffect, useState } from "react";
import type { TextBlock } from "../types/blocks";
import { TEXT_BOX_PADDING } from "../constants/reader";
import { loadGoogleFont } from "@/lib/FontFamily/useFontLoader";

interface Props {
  block: TextBlock;
  /** Highlighted while narration is reading this block aloud. */
  narrating?: boolean;
}

/**
 * Read-only text. The stored rect is the inner content box, so the rendered
 * box is inset by the authoring padding on every side — that reproduces the
 * editor's layout exactly without importing any of its machinery.
 */
const TextRenderer = memo(function TextRenderer({ block, narrating }: Props) {
  // Tracking which family finished loading (rather than a boolean) keeps the
  // state correct when a block's font changes mid-session.
  const [loadedFamily, setLoadedFamily] = useState<string | null>(null);
  const fontReady = !block.fontFamily || loadedFamily === block.fontFamily;

  useEffect(() => {
    const family = block.fontFamily;
    if (!family) return;

    let cancelled = false;
    loadGoogleFont(family).finally(() => {
      // Reveal the text even if the webfont failed: a fallback face beats a
      // permanently blank block.
      if (!cancelled) setLoadedFamily(family);
    });
    return () => {
      cancelled = true;
    };
  }, [block.fontFamily]);

  const content = block.html || block.text;

  return (
    <div
      data-block-id={block.id}
      style={{
        position: "absolute",
        left: block.x - TEXT_BOX_PADDING,
        top: block.y - TEXT_BOX_PADDING,
        width: block.width + TEXT_BOX_PADDING * 2,
        transform: block.rotation ? `rotate(${block.rotation}deg)` : undefined,
        transformOrigin: "center center",
        zIndex: block.zIndex,
        padding: TEXT_BOX_PADDING,
        boxSizing: "border-box",
        background: block.backgroundColor || "transparent",
        color: block.color,
        opacity: block.opacity,
        // Height is left to the content: a font that loads late reflows the
        // box instead of clipping the last line.
        minHeight: block.height + TEXT_BOX_PADDING * 2,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: block.fontSize,
        fontFamily: block.fontFamily,
        fontWeight: block.fontWeight,
        fontStyle: block.fontStyle,
        lineHeight: block.lineHeight,
        letterSpacing: block.letterSpacing,
        textAlign: block.align,
        textTransform: block.textTransform,
        textDecoration: block.textDecoration,
        // Avoid a flash of fallback text before the real font arrives.
        visibility: fontReady ? "visible" : "hidden",
        outline: narrating ? "2px solid rgba(37, 99, 235, 0.45)" : undefined,
        borderRadius: narrating ? 4 : undefined,
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

export default TextRenderer;
