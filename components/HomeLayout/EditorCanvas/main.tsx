"use client";
import React, {
  useEffect,
  useCallback,
  useRef,
  memo,
  useState,
} from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, TextData } from "@/app/Store/editorStore";
import RenderTable from "@/components/blocks/Table/renderer/RenderTable";
import RenderChart from "@/components/blocks/Chart/renderer/RenderChart";
import RenderText from "@/components/blocks/Text/renderer/RenderText";
import RenderBookIndex from "./RenderElement/RenderBookIndex";
import RenderImage from "@/components/blocks/Image/renderer/RenderImage";
import RenderButton from "@/components/blocks/Button/renderer/RenderButton";
import RenderShape from "@/components/blocks/Shape/renderer/RenderShape";
import RenderVideo from "@/components/blocks/Video/renderer/RenderVideo";
import SlideSettingToolbar from "./toolbar/SlideSetting/SlideSettingToolbar";
import { registerSlideRef } from "@/lib/outputGenerateLibrary";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import RenderWatermark from "@/components/blocks/Watermark/renderer/RenderWatermark";
import RenderSvgElements from "@/components/blocks/Sticker/renderer/RenderSvgElements";
import { getCenteredMediaPlacement } from "./utils/mediaPlacement";
import GroupSelectionBox from "./RenderElement/GroupSelectionBox";
import RenderInteraction from "@/components/blocks/Interaction/renderer/RenderInteraction";

type ButtonPresetKey =
  | "button-filled"
  | "button-outline"
  | "button-ghost"
  | "button-gradient"
  | "button-cta"
  | "button-link";

const BUTTON_PRESETS = {
  "button-filled": {
    text: "Click me",
    variant: "filled",
    fontSize: 16,
    fontWeight: 500,
    width: 140,
    height: 45,
    backgroundColor: "#6366f1",
    textColor: "#ffffff",
    borderRadius: 8,
    link: "",
  },
  "button-outline": {
    text: "Learn More",
    variant: "outline",
    fontSize: 16,
    fontWeight: 500,
    width: 150,
    height: 45,
    textColor: "#6366f1",
    borderColor: "#6366f1",
    borderWidth: 2,
    borderRadius: 8,
    link: "",
  },
  "button-ghost": {
    text: "Skip",
    variant: "ghost",
    fontSize: 16,
    fontWeight: 400,
    width: 100,
    height: 40,
    textColor: "#6366f1",
    borderRadius: 6,
    link: "",
  },
  "button-gradient": {
    text: "Get Started",
    variant: "gradient",
    fontSize: 16,
    fontWeight: 600,
    width: 160,
    height: 50,
    textColor: "#ffffff",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    borderRadius: 10,
    link: "",
  },
  "button-cta": {
    text: "Buy Now",
    variant: "filled",
    fontSize: 18,
    fontWeight: 700,
    width: 180,
    height: 55,
    backgroundColor: "#ef4444",
    textColor: "#ffffff",
    borderRadius: 12,
    link: "",
  },
  "button-link": {
    text: "Visit Website",
    variant: "ghost",
    fontSize: 14,
    fontWeight: 500,
    width: 140,
    height: 36,
    textColor: "#3b82f6",
    borderRadius: 6,
    link: "https://example.com",
  },
} as const;

export type TextPresetKey =
  | "text-title"
  | "text-h1"
  | "text-h2"
  | "text-h3"
  | "text-p"
  | "text-quote";

export type TextPreset = {
  text: string;
  fontSize: number;
  fontWeight: number | string;
  lineHeight?: number;
  fontStyle?: "normal" | "italic";
  width: number;
  height: number;
};

export const TEXT_PRESETS: Record<TextPresetKey, TextPreset> = {
  "text-title": {
    text: "Add a title",
    fontSize: 50,
    fontWeight: 700,
    lineHeight: 1.1,
    width: 295,
    height: 80,
  },
  "text-h1": {
    text: "Add a heading",
    fontSize: 36,
    fontWeight: 600,
    width: 270,
    height: 50,
  },
  "text-h2": {
    text: "Add a subheading",
    fontSize: 28,
    fontWeight: 600,
    width: 260,
    height: 44,
  },
  "text-h3": {
    text: "Add a section title",
    fontSize: 22,
    fontWeight: 500,
    width: 202,
    height: 40,
  },
  "text-p": {
    text: "Start writing your paragraph hereâ€¦",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.6,
    width: 280,
    height: 35,
  },
  "text-quote": {
    text: "Add a quote or highlight",
    fontSize: 20,
    fontWeight: 500,
    fontStyle: "italic",
    width: 250,
    height: 50,
  },
};


interface SlideCanvasProps {
  slideId: string;
  idx: number;
  isActive: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSlideMouseDown: (idx: number) => (e: React.MouseEvent) => void;
}

const SlideCanvas = memo(
  ({ slideId, idx, isActive, onDrop, onSlideMouseDown }: SlideCanvasProps) => {
    const { clearSelection, setSelectedElementIds } = useEditorStore(
      useShallow((s) => ({
        clearSelection: s.clearSelection,
        setSelectedElementIds: s.setSelectedElementIds,
      }))
    );
    const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
    const zoom = useEditorUIStore((s) => s.MainCanvasScale);
    const slideRef = useRef<HTMLDivElement | null>(null);
    const marqueeRef = useRef<{
      startX: number;
      startY: number;
      currentX: number;
      currentY: number;
      active: boolean;
      moved: boolean;
    } | null>(null);
    const [marquee, setMarquee] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
      visible: boolean;
    } | null>(null);

    const slide = useEditorStore(
      useCallback((s) => s.slides.find((sl) => sl.id === slideId), [slideId])
    );

    const getCanvasPoint = useCallback((e: React.MouseEvent | MouseEvent) => {
      const el = slideRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const safeZoom = zoom || 1;
      return {
        x: (e.clientX - rect.left) / safeZoom,
        y: (e.clientY - rect.top) / safeZoom,
      };
    }, [zoom]);

    const buildMarquee = useCallback((startX: number, startY: number, currentX: number, currentY: number) => ({
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY),
      visible: true,
    }), []);

    const handleSlideMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-element="true"]')) return;
      if (e.button !== 0 || imageExportMode) return;
      onSlideMouseDown(idx)(e);
      const point = getCanvasPoint(e);
      marqueeRef.current = {
        startX: point.x,
        startY: point.y,
        currentX: point.x,
        currentY: point.y,
        active: true,
        moved: false,
      };
      clearSelection();
      setMarquee({ x: point.x, y: point.y, width: 0, height: 0, visible: true });
    }, [clearSelection, getCanvasPoint, idx, imageExportMode, onSlideMouseDown]);

    const handleSlideMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const state = marqueeRef.current;
      if (!state?.active) return;
      const point = getCanvasPoint(e);
      state.currentX = point.x;
      state.currentY = point.y;
      const next = buildMarquee(state.startX, state.startY, point.x, point.y);
      state.moved = next.width > 4 || next.height > 4;
      setMarquee(next);
    }, [buildMarquee, getCanvasPoint]);

    const finishMarquee = useCallback(() => {
      const state = marqueeRef.current;
      marqueeRef.current = null;
      setMarquee(null);
      if (!state || !slide) return;
      const box = buildMarquee(state.startX, state.startY, state.currentX, state.currentY);
      if (!state.moved || box.width < 4 || box.height < 4) {
        clearSelection();
        return;
      }
      const intersects = (a: typeof box, b: { x: number; y: number; width: number; height: number }) =>
        a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y;
      const selectedIds = slide.elements
        .filter((el) => intersects(box, {
          x: el.data.x,
          y: el.data.y,
          width: el.data.width,
          height: el.data.height,
        }))
        .map((el) => el.id);
      setSelectedElementIds(selectedIds);
    }, [buildMarquee, clearSelection, setSelectedElementIds, slide]);

    if (!slide) return null;
    console.log("Rendering SlideCanvas", { "new slide": slide });
    const clipBounds = {
      x: 0,
      y: 0,
      width: slide.width ?? 0,
      height: slide.height ?? 0,
    };
    return (
      <div data-slide-index={idx}>
        <div className="kd-slide-scroll ">
          {!imageExportMode && (
            <>
              <SlideSettingToolbar slideIndex={idx} />
            </>
          )}
        </div>
        <div
          onMouseDown={onSlideMouseDown(idx)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`
          relative w-full h-auto transition-all duration-150 mb-10  kd-slide
          ${isActive ? "kd-slide-active" : "kd-slide-inactive"}
        `}
        >

          <div
            ref={(el) => {
              slideRef.current = el;
              registerSlideRef(idx, el);
            }}
            className="relative w-full"
            style={{
              height: slide.height,
              background: slide.background,
              // overflow: "hidden",
              boxShadow:
                "0px 2px 6px rgba(0,0,0,0.04), 0px 10px 20px rgba(0,0,0,0.06), 0px 25px 50px rgba(0,0,0,0.08)",
            }}
            onMouseDown={handleSlideMouseDown}
            onMouseMove={handleSlideMouseMove}
            onMouseUp={finishMarquee}
            onMouseLeave={finishMarquee}
          >
         

            {slide.elements.map((el) => {
              const d = el.data as ElementData;
              if (d.type === "text" && d.bookRole === "index")
                return <RenderBookIndex key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "text")
                return <RenderText key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "image")
                return <RenderImage key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "video")
                return <RenderVideo key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "button")
                return <RenderButton key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "shape")
                return <RenderShape key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "svg")
                return <RenderSvgElements key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "watermark")
                return <RenderWatermark key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "table")
                return <RenderTable key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
              if (d.type === "chart")
                return <RenderChart key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
          
              if (d.type === "interaction")
                return <RenderInteraction key={el.id} id={el.id} data={d} slideIndex={idx} clipBounds={clipBounds} />;
            
              return null;
            })}
            {marquee?.visible && (
              <div
                data-element="true"
                style={{
                  position: "absolute",
                  left: marquee.x,
                  top: marquee.y,
                  width: marquee.width,
                  height: marquee.height,
                  border: "1px solid var(--kd-border-accent)",
                  background: "var(--kd-hover-bg)",
                  opacity: 0.55,
                  pointerEvents: "none",
                  zIndex: 9998,
                }}
              />
            )}
            <GroupSelectionBox slideIndex={idx} />
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.slideId === next.slideId &&
    prev.idx === next.idx &&
    prev.isActive === next.isActive &&
    prev.onDrop === next.onDrop &&
    prev.onSlideMouseDown === next.onSlideMouseDown
);

SlideCanvas.displayName = "SlideCanvas";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN CANVAS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MainCanvas: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ containerRef }) => {

  const slideIds = useEditorStore(
    useShallow((s) => s.slides.map((sl) => sl.id))
  );

  const activeSlide = useEditorStore((s) => s.activeSlide);

  // âœ… Canvas width â€” sirf ye ek value
  const canvasWidth = useEditorStore(
    useCallback((s) => s.slides[s.activeSlide]?.width, [])
  );
  const canvasHeight = useEditorStore(
    useCallback((s) => s.slides[s.activeSlide]?.height, [])
  );

  // const canvasWidth = 346;
  const { setActiveSlide, setActiveElementId, clearSelection, addElement } = useEditorStore(
    useShallow((s) => ({
      setActiveSlide: s.setActiveSlide,
      setActiveElementId: s.setActiveElementId,
      clearSelection: s.clearSelection,
      addElement: s.addElement,
    }))
  );

  const { deleteElement, deleteElements, duplicateElement, duplicateElements, copySelectedElements, pasteElements, undo, redo } = useEditorStore(
    useShallow((s) => ({
      deleteElement: s.deleteElement,
      deleteElements: s.deleteElements,
      duplicateElement: s.duplicateElement,
      duplicateElements: s.duplicateElements,
      copySelectedElements: s.copySelectedElements,
      pasteElements: s.pasteElements,
      undo: s.undo,
      redo: s.redo,
    }))
  );

  const activeElementIdRef = useRef<string | null>(
    useEditorStore.getState().activeElementId
  );
  const selectedElementIdsRef = useRef<string[]>(
    useEditorStore.getState().selectedElementIds
  );


// MainCanvas.tsx ke andar, doosre useEffect's ke saath add karo

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      let bestIdx: number | null = null;
      let bestRatio = 0;
      
      entries.forEach((entry) => {
        const idxAttr = (entry.target as HTMLElement).dataset.slideIndex;
        if (idxAttr === undefined) return;
        const idx = Number(idxAttr);
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestIdx = idx;
          bestRatio = entry.intersectionRatio;
        }
      });
      if (bestIdx !== null) {
        setActiveSlide(bestIdx);
      }
    },
    {
      root: container,
      threshold: [0.5], 
    }
  );

  const slideEls = container.querySelectorAll("[data-slide-index]");
  slideEls.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [slideIds.length, setActiveSlide, containerRef]); 







  useEffect(() => {
    const unsub = useEditorStore.subscribe((state) => {
      activeElementIdRef.current = state.activeElementId;
      selectedElementIdsRef.current = state.selectedElementIds;
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.isContentEditable
      ) return;

      const activeId = activeElementIdRef.current;
      const selectedIds = selectedElementIdsRef.current;

      if (e.key === "Delete" && selectedIds.length > 1) {
        e.preventDefault();
        deleteElements(selectedIds);
        return;
      }

      if (e.key === "Delete" && activeId) {
        e.preventDefault();
        deleteElement(activeId);
        return;
      }

      if (e.key.toLowerCase() === "d" && e.ctrlKey && selectedIds.length > 1) {
        e.preventDefault();
        duplicateElements(selectedIds);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelectedElements();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteElements();
        return;
      }

      if (e.key.toLowerCase() === "d" && e.ctrlKey && activeId) {
        e.preventDefault();
        duplicateElement(activeId);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copySelectedElements, deleteElement, deleteElements, duplicateElement, duplicateElements, pasteElements, undo, redo]);

  // âœ… Drop handler â€” stable
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("application/element");
      const imgSrc = e.dataTransfer.getData("application/image-src");
      const shapeName = e.dataTransfer.getData("application/shape");
      const buttonPreset = e.dataTransfer.getData("application/button-preset");

      const slideRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - slideRect.left;
      const y = e.clientY - slideRect.top;

      if (type === "book-chapter") {
        addElement({ type: "text", bookRole: "chapter", text: "Chapter title", chapterSubtitle: "", chapterAutoNumber: true, x, y, width: 270, height: 70, rotation: 0, opacity: 1, zIndex: 1, fontFamily: "Plus Jakarta Sans", fontSize: 30, fontWeight: 700, lineHeight: 1.2, textAlign: "left", letterSpacing: 0 });
        return;
      }
      if (type === "book-index") {
        const cw = canvasWidth || 350;
        const ch = canvasHeight || 434;
        const boxWidth = Math.round(cw * 0.82);
        const boxHeight = Math.round(ch * 0.65);
        const placedX = Math.min(Math.max(0, x - boxWidth / 2), Math.max(0, cw - boxWidth));
        const placedY = Math.min(Math.max(0, y - boxHeight / 2), Math.max(0, ch - boxHeight));
        addElement({ type: "text", bookRole: "index", text: "INDEX", tocTitle: "INDEX", tocLeader: ".", tocPageAlignment: "right", tocShowRanges: false, tocSpacing: 8, tocIndent: 16, tocMarginTop: 16, tocMarginBottom: 16, tocStyle: "classic", tocAccentColor: "#6366f1", x: placedX, y: placedY, width: boxWidth, height: boxHeight, rotation: 0, opacity: 1, zIndex: 1, fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 400, lineHeight: 1.4, textAlign: "left", letterSpacing: 0 });
        return;
      }
      if (type.startsWith("text")) {
        const preset = TEXT_PRESETS[type as TextPresetKey];
        if (!preset) return;
        const element: TextData = {
          type: "text",
          x, y,
          width: preset.width,
          height: preset.height,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          text: preset.text,
          fontSize: preset.fontSize,
          fontWeight: preset.fontWeight,
          lineHeight: preset.lineHeight,
          fontStyle: preset.fontStyle,
          fontFamily: "Inter",
          textAlign: "left",
          letterSpacing: 0,
        };
        addElement(element);
        return;
      }

      if (type === "image" && imgSrc) {
        const placement = getCenteredMediaPlacement(canvasWidth, canvasHeight, 300, 200);
        const placedX = Math.min(
          Math.max(0, x - placement.width / 2),
          Math.max(0, (canvasWidth || placement.width) - placement.width)
        );
        const placedY = Math.min(
          Math.max(0, y - placement.height / 2),
          Math.max(0, (canvasHeight || placement.height) - placement.height)
        );
        addElement({
          type: "image",
          src: imgSrc,
          x: placedX,
          y: placedY,
          width: placement.width,
          height: placement.height,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          stroke: "",
          strokeWidth: 0,
          borderRadius: "0",
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          color: "rgba(0,0,0,0)",
          fit: "cover",
          maxWidth: 300,
          maxHeight: 200,
          objectFit: "cover",
          contrast: 100,
          hueRotate: 0,
          saturate: 100,
          grayscale: 0,
          sepia: 0,
          brightness: 100,
          transform: "none",
          isDragging: false,
          animationType: "None",
        });
        return;
      }

      if (shapeName) {
        addElement({
          type: "svg",
          src: shapeName,
          x, y,
          color: "",
          width: 120,
          height: 120,
          offsetX: 0,
          offsetY: 0,
          Shadowblur: 0,
          rotation: 0,
          opacity: 1,
        });
        return;
      }

      if (type === "button" && buttonPreset) {
        const preset = BUTTON_PRESETS[buttonPreset as ButtonPresetKey];
        if (!preset) return;
        addElement({
          type: "button",
          x, y,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          fontFamily: "Inter",
          ...preset,
        });
        return;
      }

      if (type.startsWith("interaction-")) {
        addElement({
          type: "text",
          text: type.replace("interaction-", "").replace(/-/g, " "),
          x,
          y,
          width: 180,
          height: 48,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.2,
          textAlign: "center",
          letterSpacing: 0,
        });
        return;
      }
    },
    [addElement, canvasHeight, canvasWidth]
  );

  const handleSlideMouseDown = useCallback(
    (idx: number) => (e: React.MouseEvent) => {
      setActiveSlide(idx);
      if (e.target === e.currentTarget) {
        setActiveElementId(null);
      }
    },
    [setActiveSlide, setActiveElementId]
  );

  const zoom = useEditorUIStore((s) => s.MainCanvasScale);
  const setZoom = useEditorUIStore((s) => s.setMainCanvasScale);

  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const next = zoomRef.current - e.deltaY * 0.001;
      setZoom(Math.min(2, Math.max(0.1, next)));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [containerRef, setZoom]);

  // Keyboard zoom
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom(Math.min(2, zoomRef.current + 0.1));
        }
        if (e.key === "-") {
          e.preventDefault();
          setZoom(Math.max(0.1, zoomRef.current - 0.1));
        }
        if (e.key === "0") {
          e.preventDefault();
          setZoom(1);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setZoom]);

  return (
    <div
      className="relative w-full h-full shadow-xl overflow-hidden"
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-element="true"]')) {
          clearSelection();
        }
      }}
    >
      <div
        ref={containerRef}
        className="default-img absolute inset-0 my-2 kd-default-scroll-panel overflow-auto w-full flex flex-col items-center "

      >
        <div
          style={{
            width: canvasWidth,
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          {slideIds.map((slideId, idx) => (
            <SlideCanvas
              key={slideId}
              slideId={slideId}
              idx={idx}
              isActive={idx === activeSlide}
              onDrop={handleDrop}
              onSlideMouseDown={handleSlideMouseDown}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default MainCanvas;











