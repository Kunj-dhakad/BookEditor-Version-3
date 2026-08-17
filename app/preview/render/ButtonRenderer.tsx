"use client";

import React, { memo } from "react";
import type { ButtonBlock } from "../types/blocks";
import {
  BUTTON_SHADOWS,
  blockFrame,
  gradientCss,
  strokeCss,
} from "../utils/blockStyles";

interface Props {
  block: ButtonBlock;
  /** Links to another page in this book rather than out to the web. */
  onInternalLink?: (link: string) => void;
}

const isExternal = (link: string) => /^(https?:|mailto:|tel:)/i.test(link);

const ButtonRenderer = memo(function ButtonRenderer({
  block,
  onInternalLink,
}: Props) {
  const background =
    gradientCss(block.gradientFrom, block.gradientTo, block.gradientDirection) ??
    block.backgroundColor ??
    "transparent";

  const handleClick = () => {
    const link = block.link;
    if (!link) return;
    if (isExternal(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    onInternalLink?.(link);
  };

  return (
    <div data-block-id={block.id} style={blockFrame(block)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!block.link}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent:
            block.textAlign === "left"
              ? "flex-start"
              : block.textAlign === "right"
                ? "flex-end"
                : "center",
          gap: 6,
          padding: "0 16px",
          boxSizing: "border-box",
          overflow: "hidden",
          whiteSpace: "nowrap",
          background,
          border: strokeCss({ ...block.stroke, color: block.borderColor ?? block.stroke.color }),
          borderRadius: block.borderRadius,
          boxShadow: BUTTON_SHADOWS[block.shadowPreset] ?? "none",
          opacity: block.opacity,
          fontSize: block.fontSize,
          fontFamily: block.fontFamily ?? "Inter",
          fontWeight: block.fontWeight,
          fontStyle: block.fontStyle,
          color: block.textColor,
          textDecoration: block.textDecorationLine ?? "none",
          textTransform: block.textTransform,
          letterSpacing: block.letterSpacing ? `${block.letterSpacing}px` : undefined,
          cursor: block.link ? "pointer" : "default",
        }}
      >
        {block.icon && block.iconPosition === "left" && <span>{block.icon}</span>}
        <span>{block.text}</span>
        {block.icon && block.iconPosition !== "left" && <span>{block.icon}</span>}
      </button>
    </div>
  );
});

export default ButtonRenderer;
