// import React, {
//   useState,
//   useEffect,
//   useRef, memo, useCallback
// } from "react";
// import { useShallow } from "zustand/shallow";
// import useEditorStore, { ElementData, ImageData } from "@/app/Store/editorStore";
// import Image from "next/image";
// import { Rnd } from "react-rnd";
// import type { DraggableEvent, DraggableData } from "react-draggable";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";

// const RenderImage: React.FC<{
//   id: string;
//   data: ElementData;
//   slideIndex: number;
// }> = memo(
//   ({ id, data, slideIndex }) => {
//     const { updateElement, setActiveElementId, setActiveSlide } = useEditorStore(
//       useShallow((s) => ({
//         updateElement: s.updateElement,
//         setActiveElementId: s.setActiveElementId,
//         setActiveSlide: s.setActiveSlide,
//       }))
//     );

//     const isSelected = useEditorStore(
//       useCallback((s) => s.activeElementId === id, [id])
//     );

//     const imageExportMode = useEditorUIStore((s) => s.imageExportMode);

//     const [isTransforming, setIsTransforming] = useState(false);
//     const [isResizing, setIsResizing] = useState(false);
//     const [isHover, setIsHover] = useState(false);
//     const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
//     const editingRef = useRef<HTMLImageElement | null>(null);

//     useEffect(() => {
//       if (isSelected && editingRef.current) {
//         setTargetEl(editingRef.current);
//       } else {
//         setTargetEl(null);
//       }
//     }, [isSelected]);

//     const handleContextMenu = useCallback(
//       (e: React.MouseEvent) => {
//         e.preventDefault();
//         setActiveSlide(slideIndex);
//         setActiveElementId(id);
//       },
//       [slideIndex, id, setActiveSlide, setActiveElementId]
//     );

//     const handleDragStart = useCallback(() => {
//       setIsTransforming(true);
//     }, []);

//     const handleDragStop = useCallback(
//       (_e: DraggableEvent, d: DraggableData) => {
//         setIsTransforming(false);
//         updateElement(id, { x: d.x, y: d.y }, { history: true });
//       },
//       [id, updateElement]
//     );

//     const handleResizeStop = useCallback(
//       (
//         _e: MouseEvent | TouchEvent,
//         _dir: string,
//         ref: HTMLElement,
//         _delta: { width: number; height: number },
//         pos: { x: number; y: number }
//       ) => {
//         setIsResizing(false);
//         updateElement(
//           id,
//           {
//             width: ref.offsetWidth,
//             height: ref.offsetHeight,
//             x: pos.x,
//             y: pos.y,
//           },
//           { history: true }
//         );
//       },
//       [id, updateElement]
//     );

//     const handleMouseDown = useCallback(() => {
//       setActiveSlide(slideIndex);
//       setActiveElementId(id);
//     }, [slideIndex, id, setActiveSlide, setActiveElementId]);

//     const handleImageError = useCallback(
//       (e: React.SyntheticEvent<HTMLImageElement>) => {
//         const target = e.currentTarget;
//         target.onerror = null;
//         target.src =
//           "data:image/svg+xml;base64," +
//           btoa(`
//         <svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>
//           <rect width='100%' height='100%' fill='#f3f4f6'/>
//           <text x='50%' y='50%' 
//             dominant-baseline='middle' 
//             text-anchor='middle'
//             font-size='20'
//             font-family='Arial, Helvetica, sans-serif'
//             fill='#6b7280'>
//           Image Not Found
//           </text>
//         </svg>
//       `);
//       },
//       []
//     );

//     // Type narrow karo
//     if (data.type !== "image") return null;
//     const imgData = data as ImageData;

//     const resizeHandleStyles =
//       isSelected && !isTransforming && !imageExportMode
//         ? {
//           top: {
//             width: "20px",
//             height: "6px",
//             top: "-4px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "ns-resize",
//           },
//           bottom: {
//             width: "20px",
//             height: "6px",
//             bottom: "-4px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "ns-resize",
//           },
//           left: {
//             width: "6px",
//             height: "20px",
//             left: "-4px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "ew-resize",
//           },
//           right: {
//             width: "6px",
//             height: "20px",
//             right: "-4px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "ew-resize",
//           },
//           topLeft: {
//             width: "12px",
//             height: "12px",
//             top: "-6px",
//             left: "-6px",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "nwse-resize",
//             borderRadius: "50%",
//           },
//           topRight: {
//             width: "12px",
//             height: "12px",
//             top: "-6px",
//             right: "-6px",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "nesw-resize",
//             borderRadius: "50%",
//           },
//           bottomLeft: {
//             width: "12px",
//             height: "12px",
//             bottom: "-6px",
//             left: "-6px",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "nesw-resize",
//             borderRadius: "50%",
//           },
//           bottomRight: {
//             width: "12px",
//             height: "12px",
//             bottom: "-6px",
//             right: "-6px",
//             background: "var(--kd-bg-primary)",
//             border: "1px solid var(--kd-text-primary)",
//             cursor: "nwse-resize",
//             borderRadius: "50%",
//           },
//         }
//         : {};

//     return (
//       <>
//         <Rnd
//           data-element="true"
//           enableResizing={
//             isSelected
//               ? {
//                 top: true,
//                 right: true,
//                 bottom: true,
//                 left: true,
//                 topRight: true,
//                 bottomRight: true,
//                 bottomLeft: true,
//                 topLeft: true,
//               }
//               : false
//           }
//           resizeHandleStyles={resizeHandleStyles}
//           onContextMenu={handleContextMenu}
//           onDragStart={handleDragStart}
//           // onResizeStart={() => setIsResizing(true)}
//           position={{ x: imgData.x, y: imgData.y }}
//           size={{ width: imgData.width, height: imgData.height }}
//           onDragStop={handleDragStop}
//           onResizeStop={handleResizeStop}
//           onMouseDown={handleMouseDown}
//           onMouseEnter={() => setIsHover(true)}
//           onMouseLeave={() => setIsHover(false)}
//           style={{
//             border: "2px solid transparent",
//             borderColor:
//               !imageExportMode && (isSelected || isHover)
//                 ? "var(--kd-accent-primary)"
//                 : "transparent",
//             display: "flex",
//             padding: 4,
//             boxSizing: "border-box",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "transparent",

//              transform: `rotate(25deg)`,
//           }}
//         >
//           <div style={{
//             width: "100%", height: "100%",
//             position: "relative",
//             border: "5px solid var(--kd-text-primary)",
//             borderRadius: "50%",
//             overflow: "hidden",
//             transform: `rotate(20deg)`,
//           }}>
//             <Image
//               ref={isSelected ? editingRef : null}
//               src={imgData.src}
//               fill
//               alt={imgData.alt || "slide image"}
//               draggable={false}
//               unoptimized
//               loading="eager"
//               onError={handleImageError}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectPosition: "center",
//                 transition: isTransforming ? "none" : "all 0.2s ease",
//                 userSelect: "none",
//                 pointerEvents: "none",

//                 borderRadius: imgData.borderRadius || 0,


//                 filter: `
//                 contrast(${imgData.contrast ?? 100}%)
//                 brightness(${imgData.brightness ?? 100}%)
//                 saturate(${imgData.saturate ?? 100}%)
//                 blur(${imgData.blur ?? 0}px)
//                 grayscale(${imgData.grayscale ?? 0}%)
//                 sepia(${imgData.sepia ?? 0}%)
//                 hue-rotate(${imgData.hueRotate ?? 0}deg)
//               `,
//               }}
//             />
//           </div>
//         </Rnd>

//         {isSelected &&
//           !imageExportMode &&
//           !isResizing &&
//           !isTransforming &&
//           targetEl && <FloatingToolBar target={targetEl} />}
//       </>
//     );
//   },
//   // ✅ Field-by-field comparison — JSON.stringify nahi
//   (prevProps, nextProps) => {
//     if (
//       prevProps.id !== nextProps.id ||
//       prevProps.slideIndex !== nextProps.slideIndex
//     )
//       return false;

//     const p = prevProps.data as ImageData;
//     const n = nextProps.data as ImageData;

//     return (
//       p.x === n.x &&
//       p.y === n.y &&
//       p.width === n.width &&
//       p.height === n.height &&
//       p.src === n.src &&
//       p.opacity === n.opacity &&
//       p.contrast === n.contrast &&
//       p.brightness === n.brightness &&
//       p.saturate === n.saturate &&
//       p.blur === n.blur &&
//       p.grayscale === n.grayscale &&
//       p.sepia === n.sepia &&
//       p.hueRotate === n.hueRotate &&
//       p.borderRadius === n.borderRadius &&
//       p.alt === n.alt
//     );
//   }
// );

// RenderImage.displayName = "RenderImage";
// export default RenderImage;


















// RenderImage.tsx — ab sirf image render, sab kuch CanvasElement handle karta hai
import React, { useCallback, memo } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, ImageData } from "@/app/Store/editorStore";
import Image from "next/image";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "./CanvasDragDrop";

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

  if (data.type !== "image") return null;
  const imgData = data as ImageData;

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
      {/* Aapka image content — bilkul waise hi */}
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: imgData.borderRadius || 0,
        overflow: "hidden",
      }}>
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
    a.contrast === b.contrast && a.brightness === b.brightness &&
    a.saturate === b.saturate && a.blur === b.blur &&
    a.grayscale === b.grayscale && a.sepia === b.sepia &&
    a.hueRotate === b.hueRotate && a.borderRadius === b.borderRadius &&
    a.alt === b.alt
  );
});

RenderImage.displayName = "RenderImage";
export default RenderImage;