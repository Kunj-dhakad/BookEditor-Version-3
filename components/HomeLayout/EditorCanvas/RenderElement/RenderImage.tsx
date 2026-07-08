import React, { useCallback, memo } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, ImageData } from "@/app/Store/editorStore";
import Image from "next/image";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "./CanvasDragDrop";
import ImageCropOverlay from "./ImageCropOverlay";

const RenderImage: React.FC<{
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
  const cropElementId = useEditorUIStore((s) => s.cropElementId);

  const bgRemovingElementId = useEditorUIStore((s) => s.bgRemovingElementId);
  const isBgRemoving = bgRemovingElementId === id;

  if (data.type !== "image") return null;
  const imgData = data as ImageData;

  const isCropping = cropElementId === id;
  if (isCropping) {
    return (
      <div
        style={{
          position: "absolute",
          left: imgData.x,
          top: imgData.y,
          width: imgData.width,
          height: imgData.height,
          transform: `rotate(${imgData.rotation ?? 0}deg)`,
          transformOrigin: "center center",
          zIndex: 1000,
        }}
      >
        <ImageCropOverlay />
      </div>
    );
  }
  return (
    <CanvasDragDrop
      id={id}
      rect={{
        x: imgData.x,
        y: imgData.y,
        width: imgData.width,
        height: imgData.height,
        rotation: imgData.rotation ?? 0,
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
        borderRadius: imgData.borderRadius || 0,
        overflow: "hidden",
      }}>

        {isBgRemoving ? (
          // 👇 Puri image ki jagah yeh aayega
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}>
            <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

            {/* Magic wand icon */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M15 4V2M15 16V14M8 9H6M22 9H20M17.8 6.2L16.4 7.6M17.8 11.8L16.4 10.4M12.2 6.2L13.6 7.6M12.2 11.8L13.6 10.4M3 21L15 9"
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <span style={{ color: "#6b7280", fontSize: 13, fontWeight: 600 }}>
              Removing Background...
            </span>
          </div>

        ) : (

          <Image
            src={imgData.src}
            fill
            alt={imgData.alt || "slide image"}
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
              objectFit: "cover",
              objectPosition: "center",
              userSelect: "none",
              pointerEvents: "none",
              aspectRatio: "9/9",
              transform: `
                scaleX(${imgData.flipX ? -1 : 1})
                scaleY(${imgData.flipY ? -1 : 1})
              `,
              border: imgData.strokeWidth ? `${imgData.strokeWidth}px ${imgData.strokeStyle ?? "none"} ${imgData.strokeColor ?? "#000"}` : undefined,
              opacity: imgData.opacity ?? 100 / 100,
              borderRadius: imgData.borderRadius || 0,
              filter: `
              contrast(${imgData.contrast ?? 100}%)
              brightness(${imgData.brightness ?? 100}%)
              saturate(${imgData.saturate ?? 100}%)
              blur(${imgData.blur ?? 0}px)
              grayscale(${imgData.grayscale ?? 0}%)
              sepia(${imgData.sepia ?? 0}%)
              hue-rotate(${imgData.hueRotate ?? 0}deg)
            `,
            }}
          />
        )}

      </div>
    </CanvasDragDrop>
  );
}, (p, n) => {
  const a = p.data as ImageData, b = n.data as ImageData;
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

RenderImage.displayName = "RenderImage";
export default RenderImage;