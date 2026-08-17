"use client";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FaArrowLeft } from "react-icons/fa";
import TemplateSlidePreview from "./TemplateSlidePreview";
import {
    TEMPLATE_EMPTY_MESSAGE,
    TEMPLATE_LOAD_ERROR_MESSAGE,
    applyTemplateSlideToActivePage,
    applyTemplateSlides,
    loadTemplateSlides,
} from "./templateUtils";
import type {
    TemplateListItem,
    TemplatePreviewStatus,
    TemplateSlide,
} from "./types";

interface TemplatePreviewPanelProps {
    template: TemplateListItem;
    /** Back to the template grid. Never mutates the editor. */
    onBack: () => void;
}

const EMPTY_SLIDES: TemplateSlide[] = [];
const GRID_GAP = 8;

/**
 * Template detail view. Lives inside the Assets Panel — same place the Cover
 * Page detail view opens — and renders every slide in the template JSON.
 * "Apply all" replaces the whole document with the template; clicking a single
 * slide replaces only the page the user is on.
 */
export default function TemplatePreviewPanel({
    template,
    onBack,
}: TemplatePreviewPanelProps) {
    const [slides, setSlides] = useState<TemplateSlide[]>(EMPTY_SLIDES);
    const [status, setStatus] = useState<TemplatePreviewStatus>(() =>
        template.json_url ? "loading" : "empty",
    );

    const bodyRef = useRef<HTMLDivElement>(null);
    const [bodyWidth, setBodyWidth] = useState(0);

    /* ==================== LOAD ==================== */

    // The panel is keyed per template by the grid, so this runs once per open:
    // initial state already covers "loading" / missing URL, and every update
    // below lands in an async callback.
    useEffect(() => {
        const url = template.json_url;
        if (!url) return;

        let cancelled = false;

        loadTemplateSlides(url)
            .then((loaded) => {
                if (cancelled) return;
                setSlides(loaded);
                setStatus(loaded.length ? "ready" : "empty");
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Error loading template preview:", err);
                setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [template.json_url]);

    /* ==================== SIZING ==================== */

    // The panel is a percentage of the window, so cards are fitted to the
    // measured width rather than a hardcoded one.
    useEffect(() => {
        const node = bodyRef.current;
        if (!node) return;
        const measure = () => setBodyWidth(node.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [status]);

    const thumbBox = useMemo(() => {
        const slideWidth = slides[0]?.width ?? 853.33;
        const slideHeight = slides[0]?.height ?? 480;
        const width = Math.max(0, Math.floor((bodyWidth - GRID_GAP) / 2));
        return {
            width,
            height: Math.max(56, Math.round((width * slideHeight) / slideWidth)),
        };
    }, [slides, bodyWidth]);

    /* ==================== APPLY ==================== */

    const applyAll = useCallback(() => {
        applyTemplateSlides(slides, { history: true });
    }, [slides]);

    const applyOne = useCallback(
        (index: number) => {
            const slide = slides[index];
            if (slide) applyTemplateSlideToActivePage(slide);
        },
        [slides],
    );

    /* ==================== RENDER ==================== */

    const isReady = status === "ready" && slides.length > 0;

    return (
        <div className="kd-element-panel w-full h-full px-2 flex flex-col overflow-hidden">
            {/* Header with back — same shape as the Cover Page detail view */}
            <div className="flex items-center gap-3 my-3">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to templates"
                    className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                    <FaArrowLeft className="text-sm" />
                </button>
                <span className="kd-toolPanel-heding-text truncate">
                    {template.title || "Template"}
                </span>
            </div>

            <div className="w-full kd-toolPanel-hr-devide-border mb-3" />

            {status === "loading" && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs" style={{ color: "var(--kd-text-muted)" }}>
                        Loading template...
                    </span>
                </div>
            )}

            {(status === "error" || status === "empty") && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3 text-center">
                    <p className="text-xs" style={{ color: "var(--kd-text-primary)" }}>
                        {status === "error"
                            ? TEMPLATE_LOAD_ERROR_MESSAGE
                            : TEMPLATE_EMPTY_MESSAGE}
                    </p>
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-full px-4 py-2 text-xs font-medium cursor-pointer"
                        style={{
                            border: "1px solid var(--kd-border-primary)",
                            color: "var(--kd-text-primary)",
                        }}
                    >
                        Close
                    </button>
                </div>
            )}

            {isReady && (
                <>
                    {/* ----- Apply all, on top ----- */}
                    <button
                        type="button"
                        onClick={applyAll}
                        aria-label={`Apply all ${slides.length} slides`}
                        className="w-full shrink-0 rounded-full py-2.5 text-xs font-semibold cursor-pointer transition focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                            background: "var(--kd-accent-primary)",
                            border: "1px solid var(--kd-accent-primary)",
                            color: "#ffffff",
                            outlineColor: "var(--kd-accent-primary)",
                        }}
                    >
                        Apply all
                    </button>
                    <div
                        className="shrink-0 mt-1 mb-3 text-center text-[10px]"
                        style={{ color: "var(--kd-text-muted)" }}
                    >
                        Replaces current pages
                    </div>

                    {/* ----- Every slide in the template ----- */}
                    <div className="flex shrink-0 items-center justify-between mb-2">
                        <span
                            className="text-[11px] font-semibold"
                            style={{ color: "var(--kd-text-primary)" }}
                        >
                            Slides ({slides.length})
                        </span>
                        <span
                            className="text-[10px]"
                            style={{ color: "var(--kd-text-muted)" }}
                        >
                            Click a slide to replace this page
                        </span>
                    </div>
                </>
            )}

            <div
                ref={bodyRef}
                className={`flex-1 min-h-0 grid grid-cols-2 auto-rows-min overflow-y-auto kd-custom-scrollbar pb-3 ${isReady ? "" : "hidden"
                    }`}
                style={{ gap: GRID_GAP }}
            >
                {isReady &&
                    thumbBox.width > 0 &&
                    slides.map((slide, index) => (
                        <TemplateSlidePreview
                            key={slide.id}
                            slide={slide}
                            index={index}
                            boxWidth={thumbBox.width}
                            boxHeight={thumbBox.height}
                            onApply={applyOne}
                        />
                    ))}
            </div>
        </div>
    );
}
