"use client";
import React, {
  useEffect,
  useCallback,
  useRef,
  memo,
  // useState,
} from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, TextData } from "@/app/Store/editorStore";
import RenderText from "./RenderElement/RenderText";
import RenderImage from "./RenderElement/RenderImage";
import RenderButton from "./RenderElement/RenderButton";
import RenderShape from "./RenderElement/RenderShape";
import RenderVideo from "./RenderElement/RenderVideo";
import SlideSettingToolbar from "./toolbar/SlideSetting/SlideSettingToolbar";
import { registerSlideRef } from "@/lib/outputGenerateLibrary";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import RenderWatermark from "./RenderElement/RenderWatermark";
import RenderSvgElements from "./RenderElement/RenderSvgElements";

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
    text: "Start writing your paragraph here…",
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
    const setActiveElementId = useEditorStore((s) => s.setActiveElementId);
    const imageExportMode = useEditorUIStore((s) => s.imageExportMode);

    const slide = useEditorStore(
      useCallback((s) => s.slides.find((sl) => sl.id === slideId), [slideId])
    );

    if (!slide) return null;
    console.log("Rendering SlideCanvas", { "new slide": slide });
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
            ref={(el) => registerSlideRef(idx, el)}
            className="relative w-full"
            style={{
              height: slide.height,
              background: slide.background,
              boxShadow:
                "0px 2px 6px rgba(0,0,0,0.04), 0px 10px 20px rgba(0,0,0,0.06), 0px 25px 50px rgba(0,0,0,0.08)",
            }}
            onMouseDown={(e) => {
              const target = e.target as HTMLElement;
              if (!target.closest('[data-element="true"]')) {
                setActiveElementId(null);
              }
            }}
          >
         

            {slide.elements.map((el) => {
              const d = el.data as ElementData;
              if (d.type === "text")
                return <RenderText key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "image")
                return <RenderImage key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "video")
                return <RenderVideo key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "button")
                return <RenderButton key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "shape")
                return <RenderShape key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "svg")
                return <RenderSvgElements key={el.id} id={el.id} data={d} slideIndex={idx} />;
              if (d.type === "watermark")
                return <RenderWatermark key={el.id} id={el.id} data={d} slideIndex={idx} />;
              return null;
            })}
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

// ─────────────────────────────────────────────
// MAIN CANVAS
// ─────────────────────────────────────────────
const MainCanvas: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ containerRef }) => {

  const slideIds = useEditorStore(
    useShallow((s) => s.slides.map((sl) => sl.id))
  );

  const activeSlide = useEditorStore((s) => s.activeSlide);

  // ✅ Canvas width — sirf ye ek value
  const canvasWidth = useEditorStore(
    useCallback((s) => s.slides[s.activeSlide]?.width, [])
  );

  // const canvasWidth = 346;
  const { setActiveSlide, setActiveElementId, addElement } = useEditorStore(
    useShallow((s) => ({
      setActiveSlide: s.setActiveSlide,
      setActiveElementId: s.setActiveElementId,
      addElement: s.addElement,
    }))
  );

  const { deleteElement, duplicateElement, undo, redo } = useEditorStore(
    useShallow((s) => ({
      deleteElement: s.deleteElement,
      duplicateElement: s.duplicateElement,
      undo: s.undo,
      redo: s.redo,
    }))
  );

  const activeElementIdRef = useRef<string | null>(
    useEditorStore.getState().activeElementId
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

      if (e.key === "Delete" && activeId) {
        e.preventDefault();
        deleteElement(activeId);
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
  }, [deleteElement, duplicateElement, undo, redo]);

  // ✅ Drop handler — stable
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
        addElement({
          type: "image",
          src: imgSrc,
          x, y,
          width: 300,
          height: 200,
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
    },
    [addElement]
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
          setActiveElementId(null);
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











