"use client";
import React, { useCallback } from "react";
import MiniSlidePreview from "@/components/HomeLayout/Preview/MiniSlidePreview";
import type { TemplateSlide } from "./types";

/* ==================== SCALED READ-ONLY SLIDE ==================== */

interface TemplateSlideCanvasProps {
    slide: TemplateSlide;
    /** Box the slide has to fit inside, in px. */
    maxWidth: number;
    maxHeight: number;
}

/**
 * Renders one template slide read-only, scaled to fit the given box. Uses the
 * editor's own `MiniSlidePreview`, so text/images/shapes/backgrounds look exactly
 * like they will on the canvas — no second renderer, no placeholder art.
 */
export const TemplateSlideCanvas = React.memo(function TemplateSlideCanvas({
    slide,
    maxWidth,
    maxHeight,
}: TemplateSlideCanvasProps) {
    const slideWidth = slide.width && slide.width > 0 ? slide.width : 853.33;
    const slideHeight = slide.height && slide.height > 0 ? slide.height : 480;
    const scale = Math.max(
        0.01,
        Math.min(maxWidth / slideWidth, maxHeight / slideHeight),
    );

    return <MiniSlidePreview slide={slide} scale={scale} eagerImages />;
});

/* ==================== SLIDE CARD ==================== */

interface TemplateSlidePreviewProps {
    slide: TemplateSlide;
    /** Zero-based position in the template. */
    index: number;
    boxWidth: number;
    boxHeight: number;
    /** Replaces the current page with this one slide. */
    onApply: (index: number) => void;
}

/**
 * One template slide as a clickable card. Clicking it replaces the page the
 * user is currently on with this slide.
 */
function TemplateSlidePreview({
    slide,
    index,
    boxWidth,
    boxHeight,
    onApply,
}: TemplateSlidePreviewProps) {
    const handleClick = useCallback(() => {
        onApply(index);
    }, [onApply, index]);

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`Replace the current page with slide ${index + 1}`}
            title={`Use slide ${index + 1} for the current page`}
            className="group relative overflow-hidden rounded-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
                width: boxWidth,
                height: boxHeight,
                background: "#F3F3F6",
                border: "1px solid var(--kd-border-primary)",
                outlineColor: "var(--kd-accent-primary)",
            }}
        >
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <TemplateSlideCanvas
                    slide={slide}
                    maxWidth={boxWidth - 6}
                    maxHeight={boxHeight - 6}
                />
            </span>

            {/* Hover/focus affordance — the card is a "use this slide" action. */}
            <span
                className="pointer-events-none absolute inset-x-0 bottom-0 py-1 text-center text-[10px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ background: "#000000a6", color: "#ffffff" }}
            >
                Replace page
            </span>

            {/* Top-right: slide content normally starts at the top-left. */}
            <span
                className="pointer-events-none absolute top-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                style={{ background: "#000000a6", color: "#ffffff" }}
            >
                {index + 1}
            </span>
        </button>
    );
}

export default React.memo(TemplateSlidePreview);
