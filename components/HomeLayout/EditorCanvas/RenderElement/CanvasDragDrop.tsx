// import React, { useRef, useCallback, memo, useState } from "react";

// type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "rotate";

// interface Rect { x: number; y: number; width: number; height: number; rotation: number; }

// interface Props {
//   id: string;
//   rect: Rect;
//   isSelected: boolean;
//   imageExportMode?: boolean;
//   onSelect: () => void;
//   onChange: (r: Rect) => void;
//   children: React.ReactNode;
// }

// const DEG = Math.PI / 180;

// export const CanvasDragDrop: React.FC<Props> = memo(({
//   rect, isSelected, imageExportMode = false,
//   onSelect, onChange, children,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);


//   const liveRect = useRef<Rect>({ ...rect });
//   const dragState = useRef<{
//     handle: Handle | "drag";
//     startX: number;
//     startY: number;
//     snap: Rect;
//   } | null>(null);

//   const [isDragging, setIsDragging] = useState(false);

//   const applyRectToDOM = useCallback((r: Rect) => {
//     const el = containerRef.current;
//     if (!el) return;
//     el.style.left = r.x + "px";
//     el.style.top = r.y + "px";
//     el.style.width = r.width + "px";
//     el.style.height = r.height + "px";
//     el.style.transform = `rotate(${r.rotation}deg)`;
//   }, []);

//   const onPointerDown = useCallback((e: React.PointerEvent, handle: Handle | "drag") => {
//     e.stopPropagation();
//     e.preventDefault();
//     onSelect();

//     const el = containerRef.current!;
//     el.setPointerCapture(e.pointerId);

//     liveRect.current = { ...rect };
//     dragState.current = {
//       handle,
//       startX: e.clientX,
//       startY: e.clientY,
//       snap: { ...rect },
//     };

//     setIsDragging(true);
//   }, [rect, onSelect]);

//   const onPointerMove = useCallback((e: React.PointerEvent) => {
//     const ds = dragState.current;
//     if (!ds) return;

//     const dx = e.clientX - ds.startX;
//     const dy = e.clientY - ds.startY;
//     const s = ds.snap;

//     let newRect: Rect;

//     if (ds.handle === "drag") {
//       newRect = { ...s, x: s.x + dx, y: s.y + dy };

//     } else if (ds.handle === "rotate") {
//       const elRect = containerRef.current!.getBoundingClientRect();
//       const ecx = elRect.left + elRect.width / 2;
//       const ecy = elRect.top + elRect.height / 2;
//       const angle = Math.atan2(e.clientY - ecy, e.clientX - ecx) * (180 / Math.PI);
//       newRect = { ...s, rotation: angle + 90 };

//     } else {
//       const cos = Math.cos(-s.rotation * DEG);
//       const sin = Math.sin(-s.rotation * DEG);
//       const ldx = dx * cos - dy * sin;
//       const ldy = dx * sin + dy * cos;

//       let { x, y, width, height } = s;
//       const { rotation } = s;
//       const minSize = 20;

//       switch (ds.handle) {
//         case "e": width = Math.max(minSize, s.width + ldx); break;
//         case "w": width = Math.max(minSize, s.width - ldx); x = s.x + s.width - width; break;
//         case "s": height = Math.max(minSize, s.height + ldy); break;
//         case "n": height = Math.max(minSize, s.height - ldy); y = s.y + s.height - height; break;
//         case "se": width = Math.max(minSize, s.width + ldx); height = Math.max(minSize, s.height + ldy); break;
//         case "sw": width = Math.max(minSize, s.width - ldx); height = Math.max(minSize, s.height + ldy); x = s.x + s.width - width; break;
//         case "ne": width = Math.max(minSize, s.width + ldx); height = Math.max(minSize, s.height - ldy); y = s.y + s.height - height; break;
//         case "nw": width = Math.max(minSize, s.width - ldx); height = Math.max(minSize, s.height - ldy); x = s.x + s.width - width; y = s.y + s.height - height; break;
//         default: return;
//       }

//       newRect = { x, y, width, height, rotation };
//     }

//     liveRect.current = newRect;
//     applyRectToDOM(newRect);

//   }, [applyRectToDOM]);

//   const onPointerUp = useCallback(() => {
//     if (!dragState.current) return;
//     dragState.current = null;
//     setIsDragging(false);

//     onChange(liveRect.current);
//   }, [onChange]);

//   const handles: { h: Handle; style: React.CSSProperties }[] = [
//     { h: "nw", style: { top: -3, left: -3, cursor: "nwse-resize" } },
//     { h: "ne", style: { top: -3, right: -3, cursor: "nesw-resize" } },
//     { h: "sw", style: { bottom: -3, left: -3, cursor: "nesw-resize" } },
//     { h: "se", style: { bottom: -3, right: -3, cursor: "nwse-resize" } },
//     { h: "n", style: { top: -2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
//     { h: "s", style: { bottom: -2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
//     { h: "w", style: { left: -2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" } },
//     { h: "e", style: { right: -2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" } },
//   ];

//   const isCorner = (h: Handle) => ["nw", "ne", "sw", "se"].includes(h);

//   return (
//     <div
//       ref={containerRef}
//       data-element="true"
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerUp}
//       onPointerDown={(e) => onPointerDown(e, "drag")}
//       style={{
//         position: "absolute",
//         left: rect.x,
//         top: rect.y,
//         width: rect.width,
//         height: rect.height,
//         transform: `rotate(${rect.rotation}deg)`,
//         transformOrigin: "center center",
//         userSelect: "none",
//         touchAction: "none",
//         cursor: isSelected ? "move" : "pointer",
//         transition: isDragging ? "none" : undefined,
//       }}
//     >
//       {isSelected && !imageExportMode && (
//         <div style={{
//           position: "absolute", inset: 0,
//           border: "2px solid var(--kd-accent-primary)",
//           pointerEvents: "none", zIndex: 10,
//         }} />
//       )}

//       <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
//         {children}
//       </div>

//       {isSelected && !imageExportMode && handles.map(({ h, style }) => (
//         <div
//           key={h}
//           onPointerDown={(e) => onPointerDown(e, h)}
//           style={{
//             position: "absolute",
//             width: isCorner(h) ? 10 : (h === "w" || h === "e" ? 6 : 24),
//             height: isCorner(h) ? 10 : (h === "n" || h === "s" ? 6 : 24),
//             ...(h === "w" || h === "e" ? { width: 6, height: 20 } : {}),
//             background: "var(--kd-bg-primary, #fff)",
//             border: "1px solid var(--kd-text-primary, #7c3aed)",
//             borderRadius: isCorner(h) ? "50%" : 3,
            
//             zIndex: 20,
//             ...style,
//           }}
//         />
//       ))}

//       {isSelected && !imageExportMode && (
//         <>
//           <div style={{
//             position: "absolute", top: -28, left: "50%",
//             transform: "translateX(-50%)",
//             width: 1, height: 24, background: "#4F8EF7",
//             opacity: 0.6, 
//             pointerEvents: "none",
//              zIndex: 19,
//           }} />

//           <div
//             onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, "rotate"); }}
//             style={{
//               position: "absolute", top: -42, left: "50%",
//               transform: "translateX(-50%)",
//               width: 18, height: 18, borderRadius: "50%",
//               background: "white",
//               border: "2px solid var(--kd-accent-primary)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               cursor: "grab", zIndex: 20,
//               boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
//             }}
//           >
//             <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
//               stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round">
//               <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
//             </svg>
//           </div>
//         </>
//       )}
//     </div>
//   );
// });

// CanvasDragDrop.displayName = "CanvasDragDrop";
// export default CanvasDragDrop;

import React, { useRef, useCallback, memo, useState } from "react";

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "rotate";

interface Rect { x: number; y: number; width: number; height: number; rotation: number; }

interface Props {
  id: string;
  rect: Rect;
  isSelected: boolean;
  imageExportMode?: boolean;
  onSelect: () => void;
  onElementClick?: () => void;
  onChange: (r: Rect) => void;
  children: React.ReactNode;
}

const DEG = Math.PI / 180;

export const CanvasDragDrop: React.FC<Props> = memo(({
  rect, isSelected, imageExportMode = false,
  onSelect, onElementClick, onChange, children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRect = useRef<Rect>({ ...rect });
  const dragState = useRef<{
    handle: Handle | "drag";
    startX: number;
    startY: number;
    snap: Rect;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const movedRef = useRef(false);
  const lastHandleRef = useRef<Handle | "drag" | null>(null);

  const applyRectToDOM = useCallback((r: Rect) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.left = r.x + "px";
    el.style.top = r.y + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
    el.style.transform = `rotate(${r.rotation}deg)`;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, handle: Handle | "drag") => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();

    const el = containerRef.current!;
    el.setPointerCapture(e.pointerId);

    liveRect.current = { ...rect };
    dragState.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      snap: { ...rect },
    };
    lastHandleRef.current = handle;
    movedRef.current = false;

    setIsDragging(true);
  }, [rect, onSelect]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds) return;

    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedRef.current = true;

    const s = ds.snap;
    let newRect: Rect;

    if (ds.handle === "drag") {
      newRect = { ...s, x: s.x + dx, y: s.y + dy };

    } else if (ds.handle === "rotate") {
      const elRect = containerRef.current!.getBoundingClientRect();
      const ecx = elRect.left + elRect.width / 2;
      const ecy = elRect.top + elRect.height / 2;
      const angle = Math.atan2(e.clientY - ecy, e.clientX - ecx) * (180 / Math.PI);
      newRect = { ...s, rotation: angle + 90 };

    } else {
      const cos = Math.cos(-s.rotation * DEG);
      const sin = Math.sin(-s.rotation * DEG);
      const ldx = dx * cos - dy * sin;
      const ldy = dx * sin + dy * cos;

      let { x, y, width, height } = s;
      const { rotation } = s;
      const minSize = 20;

      switch (ds.handle) {
        case "e": width = Math.max(minSize, s.width + ldx); break;
        case "w": width = Math.max(minSize, s.width - ldx); x = s.x + s.width - width; break;
        case "s": height = Math.max(minSize, s.height + ldy); break;
        case "n": height = Math.max(minSize, s.height - ldy); y = s.y + s.height - height; break;
        case "se": width = Math.max(minSize, s.width + ldx); height = Math.max(minSize, s.height + ldy); break;
        case "sw": width = Math.max(minSize, s.width - ldx); height = Math.max(minSize, s.height + ldy); x = s.x + s.width - width; break;
        case "ne": width = Math.max(minSize, s.width + ldx); height = Math.max(minSize, s.height - ldy); y = s.y + s.height - height; break;
        case "nw": width = Math.max(minSize, s.width - ldx); height = Math.max(minSize, s.height - ldy); x = s.x + s.width - width; y = s.y + s.height - height; break;
        default: return;
      }

      newRect = { x, y, width, height, rotation };
    }

    liveRect.current = newRect;
    applyRectToDOM(newRect);

  }, [applyRectToDOM]);

  const onPointerUp = useCallback(() => {
    if (!dragState.current) return;
    const handle = lastHandleRef.current;
    const wasMove = movedRef.current;
    dragState.current = null;
    setIsDragging(false);

    onChange(liveRect.current);

    if (handle === "drag" && !wasMove) {
      onElementClick?.();
    }
  }, [onChange, onElementClick]);

  const handles: { h: Handle; style: React.CSSProperties }[] = [
    { h: "nw", style: { top: -3, left: -3, cursor: "nwse-resize" } },
    { h: "ne", style: { top: -3, right: -3, cursor: "nesw-resize" } },
    { h: "sw", style: { bottom: -3, left: -3, cursor: "nesw-resize" } },
    { h: "se", style: { bottom: -3, right: -3, cursor: "nwse-resize" } },
    { h: "n", style: { top: -2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
    { h: "s", style: { bottom: -2, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
    { h: "w", style: { left: -2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" } },
    { h: "e", style: { right: -2, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" } },
  ];

  const isCorner = (h: Handle) => ["nw", "ne", "sw", "se"].includes(h);

  return (
    <div
      ref={containerRef}
      data-element="true"
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => { setIsHover(false); onPointerUp(); }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerDown={(e) => onPointerDown(e, "drag")}
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        transform: `rotate(${rect.rotation}deg)`,
        transformOrigin: "center center",
        userSelect: "none",
        touchAction: "none",
        cursor: isSelected ? "move" : "pointer",
        transition: isDragging ? "none" : undefined,
      }}
    >
      {isHover && !isSelected && !imageExportMode && (
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid var(--kd-accent-primary)",
          pointerEvents: "none", zIndex: 9,
        }} />
      )}

      {isSelected && !imageExportMode && (
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid var(--kd-accent-primary)",
          pointerEvents: "none", zIndex: 10,
        }} />
      )}

      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        {children}
      </div>

      {isSelected && !imageExportMode && handles.map(({ h, style }) => (
        <div
          key={h}
          onPointerDown={(e) => onPointerDown(e, h)}
          style={{
            position: "absolute",
            width: isCorner(h) ? 10 : (h === "w" || h === "e" ? 6 : 24),
            height: isCorner(h) ? 10 : (h === "n" || h === "s" ? 6 : 24),
            ...(h === "w" || h === "e" ? { width: 6, height: 20 } : {}),
            background: "var(--kd-bg-primary, #fff)",
            border: "1px solid var(--kd-text-primary, #7c3aed)",
            borderRadius: isCorner(h) ? "50%" : 3,
            zIndex: 20,
            ...style,
          }}
        />
      ))}

      {isSelected && !imageExportMode && (
        <>
          <div style={{
            position: "absolute", top: -28, left: "50%",
            transform: "translateX(-50%)",
            width: 1, height: 24, background: "#4F8EF7",
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 19,
          }} />

          <div
            onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, "rotate"); }}
            style={{
              position: "absolute", top: -42, left: "50%",
              transform: "translateX(-50%)",
              width: 18, height: 18, borderRadius: "50%",
              background: "white",
              border: "2px solid var(--kd-accent-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "grab", zIndex: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
});

CanvasDragDrop.displayName = "CanvasDragDrop";
export default CanvasDragDrop;