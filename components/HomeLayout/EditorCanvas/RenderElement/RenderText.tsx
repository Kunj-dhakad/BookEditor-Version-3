// "use client";
// import React, { useEffect, useRef, useState, memo, useCallback } from "react";
// import { Rnd } from "react-rnd";
// import { useShallow } from "zustand/shallow";
// import useEditorStore, { TextData } from "@/app/Store/editorStore";
// import type { DraggableEvent, DraggableData } from "react-draggable";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";
// import { loadGoogleFont } from "@/lib/FontFamily/useFontLoader";

// let _mc: HTMLCanvasElement | null = null;
// let _mx: CanvasRenderingContext2D | null = null;

// function getContext(): CanvasRenderingContext2D | null {
//   if (typeof document === "undefined") return null;
//   if (!_mc) { _mc = document.createElement("canvas"); _mx = _mc.getContext("2d"); }
//   return _mx;
// }

// function measureTextHeight(
//   text: string | undefined,
//   fontSize: number,
//   fontFamily: string | undefined,
//   fontWeight: string | number | undefined,
//   fontStyle: string | undefined,
//   lineHeight: number | string | undefined,
//   boxWidth: number
// ): number {
//   const ctx = getContext();
//   if (!ctx) return fontSize * 1.4;
//   const PAD_X = 0, PAD_Y = 0;
//   const lh = typeof lineHeight === "number" ? lineHeight : parseFloat(String(lineHeight ?? "1.4")) || 1.4;
//   const maxW = Math.max(1, boxWidth - PAD_X * 2);
//   ctx.font = `${fontStyle || "normal"} ${fontWeight || "400"} ${fontSize}px ${fontFamily || "sans-serif"}`;
//   let totalLines = 0;
//   for (const para of (text || "").replace(/\r/g, "").split("\n")) {
//     if (!para) { totalLines++; continue; }
//     let line = "";
//     for (const word of para.split(" ")) {
//       const test = line ? line + " " + word : word;
//       if (ctx.measureText(test).width > maxW && line) { totalLines++; line = word; }
//       else { line = test; }
//     }
//     totalLines++;
//   }
//   return Math.max(1, totalLines) * fontSize * lh + PAD_Y * 2;
// }

// // ─── RenderText ───────────────────────────────────────────────────────────────
// const RenderText: React.FC<{ id: string; data: TextData; slideIndex: number }> = memo(
//   ({ id, data, slideIndex }) => {
//     const editingRef = useRef<HTMLDivElement | null>(null);
//     const [fontReady, setFontReady] = useState(!data.fontFamily);
//     const isEditingRef = useRef(false);
//     const dataRef = useRef(data);
//     const pendingFsRef = useRef<number | null>(null);
//     const resizeStartRef = useRef<{
//       width: number; height: number; fontSize: number; x: number; y: number;
//     } | null>(null);
//     const lastHeightRef = useRef<number>(data.height);

//     const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
//     const setActiveTextRef = useEditorUIStore((s) => s.setActiveTextRef);

//     const [isTransforming, setIsTransforming] = useState(false);
//     const [isResizing, setIsResizing] = useState(false);
//     const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
//     const [editing, setEditing] = useState(false);
//     const [isHover, setIsHover] = useState(false);
//     const [tempSize, setTempSize] = useState({ width: data.width, height: data.height });

//     // dataRef sync
//     useEffect(() => { dataRef.current = data; }, [data]);

//     // undo/redo se tempSize sync
//     useEffect(() => {
//       setTempSize({ width: data.width, height: data.height });
//       lastHeightRef.current = data.height;
//     }, [data.width, data.height]);

//     const { updateElement, setActiveElementId, setActiveSlide } = useEditorStore(
//       useShallow((s) => ({
//         updateElement: s.updateElement,
//         setActiveElementId: s.setActiveElementId,
//         setActiveSlide: s.setActiveSlide,
//       }))
//     );

//     const isSelected = useEditorStore(useCallback((s) => s.activeElementId === id, [id]));

//     useEffect(() => {
//       if (isSelected) {
//         setTargetEl(editingRef.current);
//         setActiveTextRef(editingRef.current);
//       }
//     }, [isSelected, setActiveTextRef]);

//     // ── EDITING TOGGLE ──────────────────────────────────────────────────────

//     useEffect(() => {
//       const el = editingRef.current;
//       if (!el) return;
//       if (editing) {
//         isEditingRef.current = true;
//         el.focus();
//         const r = document.createRange();
//         r.selectNodeContents(el);
//         r.collapse(false);
//         window.getSelection()?.removeAllRanges();
//         window.getSelection()?.addRange(r);
//       } else {
//         isEditingRef.current = false;
//         el.innerHTML = dataRef.current.html || dataRef.current.text;
//       }
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [editing]);


//     useEffect(() => {
//       const el = editingRef.current;
//       if (!el || isEditingRef.current) return;
//       el.innerHTML = data.html || data.text;
//     }, [data.html, data.text]);

//     // ── AUTO HEIGHT ─────────────────────────────────────────────────────────
//     // useEffect(() => {
//     //   if (isResizing || isTransforming) return;
//     //   const el = editingRef.current;      
//     //   if (!el) return;
//     //   const raf = requestAnimationFrame(() => {
//     //     const d = dataRef.current;
//     //     const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
//     //     const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
//     //     const h = Math.max(measuredH, el.scrollHeight);
//     //     if (Math.abs(h - lastHeightRef.current) > 2) {
//     //       lastHeightRef.current = h;
//     //       setTempSize((p) => ({ ...p, height: h }));
//     //       updateElement(id, { height: h });
//     //     }
//     //   });
//     //   return () => cancelAnimationFrame(raf);
//     // }, [
//     //   data.text, data.html, data.fontSize, data.fontFamily,
//     //   data.lineHeight, data.width, data.fontWeight, data.fontStyle,
//     //   updateElement, id, isResizing, isTransforming,
//     // ]);




// useEffect(() => {
//   if (isResizing || isTransforming || !fontReady) return;
//   const el = editingRef.current;
//   if (!el) return;
//   const raf = requestAnimationFrame(() => {
//     const d = dataRef.current;
//     const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
//     const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
//     const h = Math.max(measuredH, el.scrollHeight);
//     if (Math.abs(h - lastHeightRef.current) > 2) {
//       lastHeightRef.current = h;
//       setTempSize((p) => ({ ...p, height: h }));
//       updateElement(id, { height: h });
//     }
//   });
//   return () => cancelAnimationFrame(raf);
// }, [
//   data.text, data.html, data.fontSize, data.fontFamily,
//   data.lineHeight, data.width, data.fontWeight, data.fontStyle,
//   updateElement, id, isResizing, isTransforming, fontReady,
// ]);


    
//     const handleBlur = useCallback(
//       (e: React.FocusEvent<HTMLDivElement>) => {
//         const newH = e.currentTarget.scrollHeight;
//         lastHeightRef.current = newH;
//         updateElement(
//           id,
//           { text: e.currentTarget.innerText, html: e.currentTarget.innerHTML, height: newH },
//           { history: true }
//         );
//         setEditing(false);
//       },
//       [id, updateElement]
//     );

//     const syncHeightToText = useCallback(() => {
//       const el = editingRef.current;
//       if (!el) return;
//       requestAnimationFrame(() => {
//         const d = dataRef.current;
//         const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
//         const h = Math.max(
//           measureTextHeight(el.innerText || "", fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width),
//           el.scrollHeight
//         );
//         if (Math.abs(h - lastHeightRef.current) > 2) {
//           lastHeightRef.current = h;
//           setTempSize((s) => ({ ...s, height: h }));
//           updateElement(id, { height: h });
//         }
//       });
//     }, [id, updateElement]);

//     const handleResizeStart = useCallback(() => {
//       const d = dataRef.current;
//       resizeStartRef.current = {
//         width: d.width, height: d.height,
//         fontSize: typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize)),
//         x: d.x, y: d.y,
//       };
//       pendingFsRef.current = null;
//       setIsResizing(true);
//     }, []);

//     const handleResize = useCallback(
//       (_e: unknown, dir: string, ref: HTMLElement) => {
//         const start = resizeStartRef.current;
//         if (!start) return;
//         const d = dataRef.current;
//         const newW = ref.offsetWidth;
//         const isCorner = ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(dir);
//         let newFs = start.fontSize;
//         if (isCorner) {
//           newFs = Math.max(4, Math.min(800, Math.round(start.fontSize * (newW / start.width))));
//           updateElement(id, { fontSize: newFs });
//         }
//         setTempSize({
//           width: newW,
//           height: measureTextHeight(d.text, newFs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, newW),
//         });
//       },
//       [id, updateElement]
//     );

//     const handleResizeStop = useCallback(
//       (
//         _e: unknown,
//         dir: string,
//         ref: HTMLElement,
//         _delta: { width: number; height: number },
//         pos: { x: number; y: number }
//       ) => {
//         const start = resizeStartRef.current;
//         const d = dataRef.current;
//         setIsTransforming(false);
//         setIsResizing(false);
//         const newW = ref.offsetWidth;
//         const origFs = start?.fontSize ?? (typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize)));
//         const origW = start?.width ?? d.width;
//         const isCorner = ["topLeft", "topRight", "bottomLeft", "bottomRight"].includes(dir);
//         const newFs = isCorner
//           ? (pendingFsRef.current ?? Math.max(4, Math.min(800, Math.round(origFs * (newW / origW)))))
//           : origFs;
//         const autoH = measureTextHeight(d.text, newFs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, newW);
//         lastHeightRef.current = autoH;
//         setTempSize({ width: newW, height: autoH });
//         updateElement(id, { width: newW, height: autoH, fontSize: newFs, x: pos.x, y: pos.y }, { history: true });
//         resizeStartRef.current = null;
//         pendingFsRef.current = null;
//       },
//       [id, updateElement]
//     );

//     const handleDragStop = useCallback(
//       (_e: DraggableEvent, d: DraggableData) => {
//         setIsTransforming(false);
//         updateElement(id, { x: d.x, y: d.y }, { history: true });
//       },
//       [id, updateElement]
//     );

//     const clickStageRef = useRef<"first" | "second">("first");
//     const dragIntentRef = useRef(false);

//     const handleMouseDown = useCallback(() => {
//       dragIntentRef.current = false;
//       setActiveSlide(slideIndex);
//       const currentActiveId = useEditorStore.getState().activeElementId;
//       if (currentActiveId !== id) {
//         clickStageRef.current = "first";
//         setActiveElementId(id);
//         setEditing(false);
//       } else {
//         clickStageRef.current = "second";
//       }
//     }, [id, slideIndex, setActiveSlide, setActiveElementId]);

//     const handleClick = useCallback(() => {
//       if (dragIntentRef.current) return;
//       if (clickStageRef.current !== "second") return;
//       setEditing(true);
//       requestAnimationFrame(() => editingRef.current?.focus());
//     }, []);

//     const showHandles = isSelected && !editing && !isTransforming && !imageExportMode;

//     const cornerStyle: React.CSSProperties = {
//       width: "12px", height: "12px",
//       background: "var(--kd-bg-primary, #fff)",
//       border: "1px solid var(--kd-text-primary, #7c3aed)",
//       borderRadius: "50%",
//     };
//     const sideStyle: React.CSSProperties = {
//       background: "var(--kd-bg-primary, #fff)",
//       border: "1px solid var(--kd-text-primary, #7c3aed)",
//     };


//     // useEffect(() => {
//     //   if (data.fontFamily) loadGoogleFont(data.fontFamily);
//     // }, [data.fontFamily]);


//     // fontReady change hone par height recalculate 
//     useEffect(() => {
//       if (!fontReady) return;
//       const el = editingRef.current;
//       if (!el) return;

//       document.fonts.ready.then(() => {
//         const d = dataRef.current;
//         const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
//         const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
//         const h = Math.max(measuredH, el.scrollHeight);
//         if (Math.abs(h - lastHeightRef.current) > 2) {
//           lastHeightRef.current = h;
//           setTempSize((p) => ({ ...p, height: h }));
//           updateElement(id, { height: h });
//         }
//       });
//     }, [fontReady, id, updateElement]);







//     const handlePaste = useCallback(
//       (e: React.ClipboardEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         const plain = e.clipboardData.getData("text/plain");
//         const sel = window.getSelection();
//         if (!sel || !sel.rangeCount) return;
//         sel.deleteFromDocument();
//         const range = sel.getRangeAt(0);
//         const textNode = document.createTextNode(plain);
//         range.insertNode(textNode);
//         range.setStartAfter(textNode);
//         range.collapse(true);
//         sel.removeAllRanges();
//         sel.addRange(range);
//         syncHeightToText();
//       },
//       [syncHeightToText]
//     );

//     useEffect(() => {
//       if (!data.fontFamily) {
//         setFontReady(true);
//         return;
//       }
//       setFontReady(false);
//       loadGoogleFont(data.fontFamily).then(() => {
//         setFontReady(true);
//       });
//     }, [data.fontFamily]);

//     return (
//       <>
//         <Rnd
//           data-element="true"
//           disableDragging={editing}
//           position={{ x: data.x, y: data.y }}
//           size={tempSize}
//           enableResizing={
//             isSelected && !editing
//               ? { left: true, right: true, top: false, bottom: false, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }
//               : false
//           }
//           resizeHandleStyles={
//             showHandles
//               ? {
//                 left: { ...sideStyle, width: "6px", height: "24px", left: "-4px", top: "50%", transform: "translateY(-50%)", borderRadius: "3px", cursor: "ew-resize" },
//                 right: { ...sideStyle, width: "6px", height: "24px", right: "-4px", top: "50%", transform: "translateY(-50%)", borderRadius: "3px", cursor: "ew-resize" },
//                 topLeft: { ...cornerStyle, top: "-6px", left: "-6px", cursor: "nwse-resize" },
//                 topRight: { ...cornerStyle, top: "-6px", right: "-6px", cursor: "nesw-resize" },
//                 bottomLeft: { ...cornerStyle, bottom: "-6px", left: "-6px", cursor: "nesw-resize" },
//                 bottomRight: { ...cornerStyle, bottom: "-6px", right: "-6px", cursor: "nwse-resize" },
//               }
//               : {}
//           }
//           onDragStart={() => setIsTransforming(true)}
//           onResizeStart={handleResizeStart}
//           onDragStop={handleDragStop}
//           onResize={handleResize as never}
//           onResizeStop={handleResizeStop as never}
//           onMouseDown={handleMouseDown}
//           onClick={handleClick}
//           onMouseEnter={() => setIsHover(true)}
//           onMouseLeave={() => setIsHover(false)}
//           onMouseMove={() => { dragIntentRef.current = true; }}
//           style={{
//             // border: "2px solid transparent",
//             border: "none",
//             outline: !imageExportMode && (isSelected || isHover) ? "2px solid var(--kd-accent-primary)" : "none",
//             borderColor: !imageExportMode && (isSelected || isHover) ? "var(--kd-accent-primary)" : "transparent",
//             padding: 0,
//             boxSizing: "border-box",
//             background: "transparent",
//             cursor: editing ? "text" : "move",
//             display: "flex",
//             alignItems: "flex-start",
//             overflow: "visible",
//             opacity: fontReady ? 1 : 0,
//             transition: "opacity 0.15s ease",
//           }}
//         >
//           <div
//             ref={editingRef}
//             contentEditable={editing}
//             suppressContentEditableWarning
//             data-element-id={id}
//             onBlur={handleBlur}
//             onInput={syncHeightToText}
//             onPaste={handlePaste}
//             onClick={(e) => {
//               const anchor = (e.target as HTMLElement).closest("a");
//               if (!anchor) return;
//               e.preventDefault();
//               if (e.ctrlKey || e.metaKey) {
//                 const href = anchor.getAttribute("href");
//                 if (href) window.open(href, "_blank");
//               }
//             }}
//             style={{
//               width: "100%",
//               background: data.backgroundColor || "transparent",
//               minHeight: "1em",
//               height: "auto",
//               whiteSpace: "pre-wrap",
//               wordBreak: "break-word",
//               outline: "none",
//               overflow: "hidden",
//               textDecoration: data.textDecoration,
//               color: data.color,
//               fontSize: typeof data.fontSize === "number" ? `${data.fontSize}px` : data.fontSize,
//               fontFamily: data.fontFamily,
//               textAlign: data.align,
//               lineHeight: data.lineHeight,
//               letterSpacing: data.letterSpacing,
//               fontWeight: data.fontWeight,
//               fontStyle: data.fontStyle,
//               textTransform: data.textTransform || "none",
//             }}
//           />
//         </Rnd>

//         {isSelected && !imageExportMode && !isResizing && !isTransforming && targetEl && (
//           <FloatingToolBar target={targetEl} />
//         )}
//       </>
//     );
//   },
//   (p, n) =>
//     p.id === n.id &&
//     p.slideIndex === n.slideIndex &&
//     p.data.x === n.data.x &&
//     p.data.y === n.data.y &&
//     p.data.width === n.data.width &&
//     p.data.height === n.data.height &&
//     p.data.text === n.data.text &&
//     p.data.html === n.data.html &&
//     p.data.fontSize === n.data.fontSize &&
//     p.data.fontFamily === n.data.fontFamily &&
//     p.data.fontWeight === n.data.fontWeight &&
//     p.data.fontStyle === n.data.fontStyle &&
//     p.data.textDecoration === n.data.textDecoration &&
//     p.data.lineHeight === n.data.lineHeight &&
//     p.data.letterSpacing === n.data.letterSpacing &&
//     p.data.align === n.data.align &&
//     p.data.color === n.data.color &&
//     p.data.backgroundColor === n.data.backgroundColor &&
//     p.data.opacity === n.data.opacity &&
//     // p.data.textTransform === n.data.textTransform
//     (p.data.textTransform || "none") === (n.data.textTransform || "none")
// );

// RenderText.displayName = "RenderText";
// export default RenderText;


// text render add new defult drag and drop rmve RND

"use client";
import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { TextData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";
import { loadGoogleFont } from "@/lib/FontFamily/useFontLoader";
import TextDragAndDrop, { TextTransformRect } from "./TextDragAndDrop";

let _mc: HTMLCanvasElement | null = null;
let _mx: CanvasRenderingContext2D | null = null;
const TEXT_BOX_PADDING = 6;

function getContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!_mc) { _mc = document.createElement("canvas"); _mx = _mc.getContext("2d"); }
  return _mx;
}

function measureTextHeight(
  text: string | undefined,
  fontSize: number,
  fontFamily: string | undefined,
  fontWeight: string | number | undefined,
  fontStyle: string | undefined,
  lineHeight: number | string | undefined,
  boxWidth: number
): number {
  const ctx = getContext();
  if (!ctx) return fontSize * 1.4;
  const PAD_X = 0, PAD_Y = 0;
  const lh = typeof lineHeight === "number" ? lineHeight : parseFloat(String(lineHeight ?? "1.4")) || 1.4;
  const maxW = Math.max(1, boxWidth - PAD_X * 2);
  ctx.font = `${fontStyle || "normal"} ${fontWeight || "400"} ${fontSize}px ${fontFamily || "sans-serif"}`;
  let totalLines = 0;
  for (const para of (text || "").replace(/\r/g, "").split("\n")) {
    if (!para) { totalLines++; continue; }
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxW && line) { totalLines++; line = word; }
      else { line = test; }
    }
    totalLines++;
  }
  return Math.max(1, totalLines) * fontSize * lh + PAD_Y * 2;
}

function getContentScrollHeight(el: HTMLElement): number {
  return Math.max(1, el.scrollHeight - TEXT_BOX_PADDING * 2);
}

function toOuterTextRect(rect: TextTransformRect): TextTransformRect {
  return {
    x: rect.x - TEXT_BOX_PADDING,
    y: rect.y - TEXT_BOX_PADDING,
    width: rect.width + TEXT_BOX_PADDING * 2,
    height: rect.height + TEXT_BOX_PADDING * 2,
    rotation: rect.rotation,
  };
}

function toContentTextRect(rect: TextTransformRect): TextTransformRect {
  return {
    x: rect.x + TEXT_BOX_PADDING,
    y: rect.y + TEXT_BOX_PADDING,
    width: Math.max(1, rect.width - TEXT_BOX_PADDING * 2),
    height: Math.max(1, rect.height - TEXT_BOX_PADDING * 2),
    rotation: rect.rotation,
  };
}

// ─── RenderText ───────────────────────────────────────────────────────────────
const RenderText: React.FC<{ id: string; data: TextData; slideIndex: number }> = memo(
  ({ id, data, slideIndex }) => {
    const editingRef = useRef<HTMLDivElement | null>(null);
    const [fontReady, setFontReady] = useState(!data.fontFamily);
    const isEditingRef = useRef(false);
    const dataRef = useRef(data);
    const pendingFsRef = useRef<number | null>(null);
    const resizeStartRef = useRef<{
      width: number; height: number; fontSize: number; x: number; y: number;
    } | null>(null);
    const lastHeightRef = useRef<number>(data.height);

    const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
    const setActiveTextRef = useEditorUIStore((s) => s.setActiveTextRef);

    const [isTransforming, setIsTransforming] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
    const [editing, setEditing] = useState(false);
    const [tempSize, setTempSize] = useState({ width: data.width, height: data.height });
    const [tempFontSize, setTempFontSize] = useState<TextData["fontSize"]>(data.fontSize);

    // dataRef sync
    useEffect(() => { dataRef.current = data; }, [data]);

    // undo/redo se tempSize sync
    useEffect(() => {
      lastHeightRef.current = data.height;
      const raf = requestAnimationFrame(() => {
        setTempSize({ width: data.width, height: data.height });
      });
      return () => cancelAnimationFrame(raf);
    }, [data.width, data.height]);

    useEffect(() => {
      if (isResizing) return;
      const raf = requestAnimationFrame(() => {
        setTempFontSize(data.fontSize);
      });
      return () => cancelAnimationFrame(raf);
    }, [data.fontSize, isResizing]);

    const { updateElement, setActiveElementId, setActiveSlide } = useEditorStore(
      useShallow((s) => ({
        updateElement: s.updateElement,
        setActiveElementId: s.setActiveElementId,
        setActiveSlide: s.setActiveSlide,
      }))
    );

    const isSelected = useEditorStore(useCallback((s) => s.activeElementId === id, [id]));

    useEffect(() => {
      if (isSelected) {
        setActiveTextRef(editingRef.current);
      }
    }, [isSelected, setActiveTextRef]);

    // ── EDITING TOGGLE ──────────────────────────────────────────────────────

    useEffect(() => {
      const el = editingRef.current;
      if (!el) return;
      if (editing) {
        isEditingRef.current = true;
        el.focus();
        const r = document.createRange();
        r.selectNodeContents(el);
        r.collapse(false);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(r);
      } else {
        isEditingRef.current = false;
        el.innerHTML = dataRef.current.html || dataRef.current.text;
      }
    }, [editing]);


    useEffect(() => {
      const el = editingRef.current;
      if (!el || isEditingRef.current) return;
      el.innerHTML = data.html || data.text;
    }, [data.html, data.text]);

    // ── AUTO HEIGHT ─────────────────────────────────────────────────────────
    // useEffect(() => {
    //   if (isResizing || isTransforming) return;
    //   const el = editingRef.current;      
    //   if (!el) return;
    //   const raf = requestAnimationFrame(() => {
    //     const d = dataRef.current;
    //     const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
    //     const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
    //     const h = Math.max(measuredH, el.scrollHeight);
    //     if (Math.abs(h - lastHeightRef.current) > 2) {
    //       lastHeightRef.current = h;
    //       setTempSize((p) => ({ ...p, height: h }));
    //       updateElement(id, { height: h });
    //     }
    //   });
    //   return () => cancelAnimationFrame(raf);
    // }, [
    //   data.text, data.html, data.fontSize, data.fontFamily,
    //   data.lineHeight, data.width, data.fontWeight, data.fontStyle,
    //   updateElement, id, isResizing, isTransforming,
    // ]);




useEffect(() => {
  if (isResizing || isTransforming || !fontReady) return;
  const el = editingRef.current;
  if (!el) return;
  const raf = requestAnimationFrame(() => {
    const d = dataRef.current;
    const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
    const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
    const h = Math.max(measuredH, getContentScrollHeight(el));
    if (Math.abs(h - lastHeightRef.current) > 2) {
      lastHeightRef.current = h;
      setTempSize((p) => ({ ...p, height: h }));
      updateElement(id, { height: h });
    }
  });
  return () => cancelAnimationFrame(raf);
}, [
  data.text, data.html, data.fontSize, data.fontFamily,
  data.lineHeight, data.width, data.fontWeight, data.fontStyle,
  updateElement, id, isResizing, isTransforming, fontReady,
]);


    
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        const newH = getContentScrollHeight(e.currentTarget);
        lastHeightRef.current = newH;
        updateElement(
          id,
          { text: e.currentTarget.innerText, html: e.currentTarget.innerHTML, height: newH },
          { history: true }
        );
        setEditing(false);
      },
      [id, updateElement]
    );

    const syncHeightToText = useCallback(() => {
      const el = editingRef.current;
      if (!el) return;
      requestAnimationFrame(() => {
        const d = dataRef.current;
        const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
        const h = Math.max(
          measureTextHeight(el.innerText || "", fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width),
          getContentScrollHeight(el)
        );
        if (Math.abs(h - lastHeightRef.current) > 2) {
          lastHeightRef.current = h;
          setTempSize((s) => ({ ...s, height: h }));
          updateElement(id, { height: h });
        }
      });
    }, [id, updateElement]);

    const handleResizeStart = useCallback(() => {
      const d = dataRef.current;
      resizeStartRef.current = {
        width: d.width, height: d.height,
        fontSize: typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize)),
        x: d.x, y: d.y,
      };
      pendingFsRef.current = null;
      setIsResizing(true);
    }, []);

    const handleResize = useCallback(
      (nextOuter: TextTransformRect, handle: string) => {
        const start = resizeStartRef.current;
        if (!start) return;
        const d = dataRef.current;
        const next = toContentTextRect(nextOuter);
        const newW = next.width;
        const isCorner = ["nw", "ne", "sw", "se"].includes(handle);
        let newFs = start.fontSize;
        if (isCorner) {
          newFs = Math.max(4, Math.min(800, Math.round(start.fontSize * (newW / start.width))));
          pendingFsRef.current = newFs;
          setTempFontSize(newFs);
        }
        setTempSize({
          width: newW,
          height: measureTextHeight(d.text, newFs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, newW),
        });
      },
      []
    );

    const handleResizeStop = useCallback(
      (nextOuter: TextTransformRect, handle: string) => {
        const start = resizeStartRef.current;
        const d = dataRef.current;
        setIsTransforming(false);
        setIsResizing(false);
        const next = toContentTextRect(nextOuter);
        const newW = next.width;
        const origFs = start?.fontSize ?? (typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize)));
        const origW = start?.width ?? d.width;
        const isCorner = ["nw", "ne", "sw", "se"].includes(handle);
        const newFs = isCorner
          ? (pendingFsRef.current ?? Math.max(4, Math.min(800, Math.round(origFs * (newW / origW)))))
          : origFs;
        const autoH = measureTextHeight(d.text, newFs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, newW);
        lastHeightRef.current = autoH;
        setTempSize({ width: newW, height: autoH });
        setTempFontSize(newFs);
        updateElement(
          id,
          { width: newW, height: autoH, fontSize: newFs, x: next.x, y: next.y, rotation: next.rotation },
          { history: true }
        );
        resizeStartRef.current = null;
        pendingFsRef.current = null;
      },
      [id, updateElement]
    );

    const handleDragStop = useCallback(
      (nextOuter: TextTransformRect) => {
        setIsTransforming(false);
        const next = toContentTextRect(nextOuter);
        updateElement(id, { x: next.x, y: next.y, rotation: next.rotation }, { history: true });
      },
      [id, updateElement]
    );

    const dragIntentRef = useRef(false);

    const handleMouseDown = useCallback(() => {
      dragIntentRef.current = false;
      setActiveSlide(slideIndex);
      const currentActiveId = useEditorStore.getState().activeElementId;
      if (currentActiveId !== id) {
        setActiveElementId(id);
        setEditing(false);
      }
    }, [id, slideIndex, setActiveSlide, setActiveElementId]);

    const handleClick = useCallback(() => {
      setIsTransforming(false);
      if (dragIntentRef.current) return;
      setEditing(true);
      requestAnimationFrame(() => editingRef.current?.focus());
    }, []);

    const effectiveFontSize = isResizing ? tempFontSize : data.fontSize;

    const handleTransformStart = useCallback(
      ({ kind }: { kind: "drag" | "resize" | "rotate" }) => {
        setIsTransforming(true);
        if (kind === "resize") {
          setIsResizing(true);
          handleResizeStart();
        }
      },
      [handleResizeStart]
    );

    const handleTransform = useCallback(
      (next: TextTransformRect, meta: { kind: "drag" | "resize" | "rotate"; handle: string }) => {
        if (meta.kind === "resize") handleResize(next, meta.handle);
      },
      [handleResize]
    );

    const handleTransformEnd = useCallback(
      (next: TextTransformRect, meta: { kind: "drag" | "resize" | "rotate"; handle: string }) => {
        if (meta.kind === "resize") {
          handleResizeStop(next, meta.handle);
          return;
        }
        handleDragStop(next);
      },
      [handleDragStop, handleResizeStop]
    );


    // useEffect(() => {
    //   if (data.fontFamily) loadGoogleFont(data.fontFamily);
    // }, [data.fontFamily]);


    // fontReady change hone par height recalculate 
    useEffect(() => {
      if (!fontReady) return;
      const el = editingRef.current;
      if (!el) return;

      document.fonts.ready.then(() => {
        const d = dataRef.current;
        const fs = typeof d.fontSize === "number" ? d.fontSize : parseFloat(String(d.fontSize));
        const measuredH = measureTextHeight(d.text, fs, d.fontFamily, d.fontWeight, d.fontStyle, d.lineHeight, d.width);
        const h = Math.max(measuredH, getContentScrollHeight(el));
        if (Math.abs(h - lastHeightRef.current) > 2) {
          lastHeightRef.current = h;
          setTempSize((p) => ({ ...p, height: h }));
          updateElement(id, { height: h });
        }
      });
    }, [fontReady, id, updateElement]);







    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const plain = e.clipboardData.getData("text/plain");
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;
        sel.deleteFromDocument();
        const range = sel.getRangeAt(0);
        const textNode = document.createTextNode(plain);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        syncHeightToText();
      },
      [syncHeightToText]
    );

    useEffect(() => {
      let cancelled = false;
      if (!data.fontFamily) {
        const raf = requestAnimationFrame(() => {
          if (!cancelled) setFontReady(true);
        });
        return () => {
          cancelled = true;
          cancelAnimationFrame(raf);
        };
      }
      const raf = requestAnimationFrame(() => {
        if (!cancelled) setFontReady(false);
      });
      loadGoogleFont(data.fontFamily).then(() => {
        if (!cancelled) setFontReady(true);
      }).catch(() => {
        if (!cancelled) setFontReady(true);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }, [data.fontFamily]);

    return (
      <>
        <TextDragAndDrop
          rect={{
            ...toOuterTextRect({
              x: data.x,
              y: data.y,
              width: tempSize.width,
              height: tempSize.height,
              rotation: data.rotation ?? 0,
            }),
          }}
          isSelected={isSelected}
          disabled={editing}
          imageExportMode={imageExportMode}
          onSelect={handleMouseDown}
          onElementClick={handleClick}
          onTransformStart={handleTransformStart}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
          onContainerChange={setTargetEl}
        >
          <div
            ref={editingRef}
            contentEditable={editing}
            suppressContentEditableWarning
            data-element-id={id}
            onBlur={handleBlur}
            onInput={syncHeightToText}
            onPaste={handlePaste}
            onClick={(e) => {
              const anchor = (e.target as HTMLElement).closest("a");
              if (!anchor) return;
              e.preventDefault();
              if (e.ctrlKey || e.metaKey) {
                const href = anchor.getAttribute("href");
                if (href) window.open(href, "_blank");
              }
            }}
            style={{
              width: "100%",
              background: data.backgroundColor || "transparent",
              minHeight: "1em",
              height: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              outline: "none",
              overflow: "hidden",
              textDecoration: data.textDecoration,
              color: data.color,
              fontSize: typeof effectiveFontSize === "number" ? `${effectiveFontSize}px` : effectiveFontSize,
              fontFamily: data.fontFamily,
              textAlign: data.align,
              lineHeight: data.lineHeight,
              letterSpacing: data.letterSpacing,
              fontWeight: data.fontWeight,
              fontStyle: data.fontStyle,
              textTransform: data.textTransform || "none",
              boxSizing: "border-box",
              padding: TEXT_BOX_PADDING,
              position: "relative",
              zIndex: 11,
              opacity: 1,
            }}
          />
        </TextDragAndDrop>

        {isSelected && !imageExportMode && !isResizing && !isTransforming && targetEl && (
          <FloatingToolBar target={targetEl} />
        )}
      </>
    );
  },
  (p, n) =>
    p.id === n.id &&
    p.slideIndex === n.slideIndex &&
    p.data.x === n.data.x &&
    p.data.y === n.data.y &&
    p.data.width === n.data.width &&
    p.data.height === n.data.height &&
    p.data.rotation === n.data.rotation &&
    p.data.text === n.data.text &&
    p.data.html === n.data.html &&
    p.data.fontSize === n.data.fontSize &&
    p.data.fontFamily === n.data.fontFamily &&
    p.data.fontWeight === n.data.fontWeight &&
    p.data.fontStyle === n.data.fontStyle &&
    p.data.textDecoration === n.data.textDecoration &&
    p.data.lineHeight === n.data.lineHeight &&
    p.data.letterSpacing === n.data.letterSpacing &&
    p.data.align === n.data.align &&
    p.data.color === n.data.color &&
    p.data.backgroundColor === n.data.backgroundColor &&
    p.data.opacity === n.data.opacity &&
    // p.data.textTransform === n.data.textTransform
    (p.data.textTransform || "none") === (n.data.textTransform || "none")
);

RenderText.displayName = "RenderText";
export default RenderText;
