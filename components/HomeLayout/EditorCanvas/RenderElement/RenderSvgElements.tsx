import React, { useCallback, memo } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData,  SVGData } from "@/app/Store/editorStore";
import Image from "next/image";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "./CanvasDragDrop";


const RenderSvgElements: React.FC<{
  id: string;
  data: ElementData;
  slideIndex: number;
}> = memo(({ id, data, slideIndex }) => {
  const { updateElement, setActiveElementId, setActiveSlide } = useEditorStore(
    useShallow((s) => ({
      updateElement: s.updateElement,
      setActiveElementId: s.setActiveElementId,
      setActiveSlide: s.setActiveSlide,
    }))
  );

  const isSelected = useEditorStore(
    useCallback((s) => s.activeElementId === id, [id])
  );
  const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
  if (data.type !== "svg") return null;
  const Data = data as SVGData;


  return (
    <CanvasDragDrop
      id={id}
      rect={{
        x: Data.x,
        y: Data.y,
        width: Data.width,
        height: Data.height,
        rotation: Data.rotation ?? 0,
      }}
      isSelected={isSelected}
      imageExportMode={imageExportMode}
      onSelect={() => {
        setActiveSlide(slideIndex);
        setActiveElementId(id);
      }}
      onChange={(r) =>
        updateElement(id, {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          rotation: r.rotation,
        }, { history: true })
      }
    >
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: Data.borderRadius || 0,
        overflow: "hidden",
      }}>
          <Image
            src={Data.src}
            fill
            alt={Data.alt || "slide image"}
            draggable={false}
            unoptimized
            loading="eager"
            onError={(e) => {
              const t = e.currentTarget;
              t.onerror = null;
              t.src = "data:image/svg+xml;base64," + btoa(`
              <svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>
                <rect width='100%' height='100%' fill='#f3f4f6'/>
                <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                  font-size='20' font-family='Arial' fill='#6b7280'>Image Not Found</text>
              </svg>
            `);
            }}
            style={{
              objectFit: "contain",
              objectPosition: "center",
              userSelect: "none",
              pointerEvents: "none",
              aspectRatio: "9/9",
              transform: `
                scaleX(${Data.flipX ? -1 : 1})
                scaleY(${Data.flipY ? -1 : 1})
              `,
              border: Data.strokeWidth ? `${Data.strokeWidth}px ${Data.strokeStyle ?? "none"} ${Data.strokeColor ?? "#000"}` : undefined,
              opacity: Data.opacity ?? 100 / 100,
              borderRadius: Data.borderRadius || 0,
              filter: `
              contrast(${Data.contrast ?? 100}%)
              brightness(${Data.brightness ?? 100}%)
              saturate(${Data.saturate ?? 100}%)
              blur(${Data.blur ?? 0}px)
              grayscale(${Data.grayscale ?? 0}%)
              sepia(${Data.sepia ?? 0}%)
              hue-rotate(${Data.hueRotate ?? 0}deg)
            `,
            }}
          />
    

      </div>
    </CanvasDragDrop>
  );
}, (p, n) => {
  const a = p.data as SVGData, b = n.data as SVGData;
  return (
    p.id === n.id &&
    p.slideIndex === n.slideIndex &&
    a.x === b.x && a.y === b.y &&
    a.width === b.width && a.height === b.height &&
    a.rotation === b.rotation &&
    a.src === b.src && a.opacity === b.opacity &&
    a.flipX === b.flipX &&
    a.flipY === b.flipY &&
    a.contrast === b.contrast && a.brightness === b.brightness &&
    a.saturate === b.saturate && a.blur === b.blur &&
    a.grayscale === b.grayscale && a.sepia === b.sepia &&
    a.hueRotate === b.hueRotate && a.borderRadius === b.borderRadius &&
    a.strokeWidth === b.strokeWidth &&
    a.strokeStyle === b.strokeStyle &&
    a.strokeColor === b.strokeColor &&
    a.alt === b.alt
  );
});

RenderSvgElements.displayName = "RenderSvgElements";
export default RenderSvgElements;