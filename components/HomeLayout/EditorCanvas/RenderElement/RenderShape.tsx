// // import React, { useState, useRef,useEffect, memo, useCallback } from "react";
// // import { useShallow } from "zustand/shallow";
// // import useEditorStore, { ElementData } from "@/app/Store/editorStore";
// // import { Rnd } from "react-rnd";
// // // import ShapeEditToolbar from "../toolbar/EditTool/ShapeEdit/ShapeEditToolbar";
// // import type { DraggableEvent, DraggableData } from "react-draggable";
// // import useEditorUIStore from "@/app/Store/useEditorUIStore";
// // import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";

// // // ✅ Memo for performance
// // const RenderShape: React.FC<{
// //     id: string;
// //     data: ElementData;
// //     slideIndex: number
// // }> = memo(({ id, data, slideIndex }) => {
// //     const {
// //         updateElement,
// //         activeElementId: selectedId,
// //         setActiveElementId,
// //         setActiveSlide,
// //     } = useEditorStore(
// //         useShallow((s) => ({
// //             updateElement: s.updateElement,
// //             activeElementId: s.activeElementId,
// //             setActiveElementId: s.setActiveElementId,
// //             setActiveSlide: s.setActiveSlide,
// //         }))
// //     );
// //     const imageExportMode = useEditorUIStore((s) => s.imageExportMode);

// //     // const [showToolbar, setShowToolbar] = useState(false);
// //     const [isTransforming, setIsTransforming] = useState(false);
// //     const editingRef = useRef<HTMLImageElement | null>(null);
// //     const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
// //     const [isHover, setIsHover] = useState(false);
// //     const [isResizing, setIsResizing] = useState(false);

// //     useEffect(() => {
// //         if (selectedId === id && editingRef.current) {
// //             setTargetEl(editingRef.current);
// //         } else {
// //             setTargetEl(null);
// //         }
// //     }, [selectedId, id]);

// //     // ✅ useCallback with proper types
// //     const handleContextMenu = useCallback((e: React.MouseEvent) => {
// //         e.preventDefault();
// //         setActiveSlide(slideIndex);
// //         setActiveElementId(id);
// //         // setShowToolbar(true);
// //     }, [slideIndex, id, setActiveSlide, setActiveElementId]);

// //     const handleDragStart = useCallback(() => {
// //         setIsTransforming(true);
// //         // setShowToolbar(false);
// //     }, []);

// //     // const handleResizeStart = useCallback(() => {
// //     //     // setShowToolbar(false);
// //     // }, []);

// //     //   const handleDragStop = useCallback(
// //     //     (_e: MouseEvent | TouchEvent, dragData: { x: number; y: number }) => {
// //     //       setIsTransforming(false);
// //     //       updateElement(id, { x: dragData.x, y: dragData.y }, { history: true });
// //     //     },
// //     //     [id, updateElement]
// //     //   );
// //     const handleDragStop = useCallback(
// //         (_e: DraggableEvent, d: DraggableData) => {
// //             setIsTransforming(false);
// //             updateElement(id, { x: d.x, y: d.y }, { history: true });
// //         },
// //         [id, updateElement]
// //     );

// //     const handleResizeStop = useCallback(
// //         (
// //             _e: MouseEvent | TouchEvent,
// //             _dir: string,
// //             ref: HTMLElement,
// //             _delta: { width: number; height: number },
// //             pos: { x: number; y: number }
// //         ) => {
// //             // setShowToolbar(true);
// //             setIsResizing(false);
// //             updateElement(
// //                 id,
// //                 {
// //                     width: ref.offsetWidth,
// //                     height: ref.offsetHeight,
// //                     x: pos.x,
// //                     y: pos.y,
// //                 },
// //                 { history: true }
// //             );
// //         },
// //         [id, updateElement]
// //     );

// //     const handleMouseDown = useCallback(() => {
// //         setActiveSlide(slideIndex);
// //         setActiveElementId(id);
// //     }, [slideIndex, id, setActiveSlide, setActiveElementId]);



// //     return (
// //         <>
// //             <Rnd
// //                 data-element="true"
// //                 key={id}
// //                 enableResizing={
// //                     selectedId === id
// //                         ? {
// //                             top: true,
// //                             right: true,
// //                             bottom: true,
// //                             left: true,
// //                             topRight: true,
// //                             bottomRight: true,
// //                             bottomLeft: true,
// //                             topLeft: true,
// //                         }
// //                         : false
// //                 }
// //                 resizeHandleStyles={
// //                     selectedId === id && !isTransforming && !imageExportMode
// //                         ? {
// //                             top: {
// //                                 width: "20px",
// //                                 height: "6px",
// //                                 top: "-4px",
// //                                 left: "50%",
// //                                 transform: "translateX(-50%)",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "ns-resize",
// //                             },
// //                             bottom: {
// //                                 width: "20px",
// //                                 height: "6px",
// //                                 bottom: "-4px",
// //                                 left: "50%",
// //                                 transform: "translateX(-50%)",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "ns-resize",
// //                             },
// //                             left: {
// //                                 width: "6px",
// //                                 height: "20px",
// //                                 left: "-4px",
// //                                 top: "50%",
// //                                 transform: "translateY(-50%)",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "ew-resize",
// //                             },
// //                             right: {
// //                                 width: "6px",
// //                                 height: "20px",
// //                                 right: "-4px",
// //                                 top: "50%",
// //                                 transform: "translateY(-50%)",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "ew-resize",
// //                             },
// //                             topLeft: {
// //                                 width: "12px",
// //                                 height: "12px",
// //                                 top: "-6px",
// //                                 left: "-6px",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "nwse-resize",
// //                                 borderRadius: "50%",
// //                             },
// //                             topRight: {
// //                                 width: "12px",
// //                                 height: "12px",
// //                                 top: "-6px",
// //                                 right: "-6px",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "nesw-resize",
// //                                 borderRadius: "50%",
// //                             },
// //                             bottomLeft: {
// //                                 width: "12px",
// //                                 height: "12px",
// //                                 bottom: "-6px",
// //                                 left: "-6px",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "nesw-resize",
// //                                 borderRadius: "50%",
// //                             },
// //                             bottomRight: {
// //                                 width: "12px",
// //                                 height: "12px",
// //                                 bottom: "-6px",
// //                                 right: "-6px",
// //                                 background: `var(--kd-bg-primary)`,
// //                                 border: "1px solid var(--kd-text-primary)",
// //                                 cursor: "nwse-resize",
// //                                 borderRadius: "50%",
// //                             },
// //                         }
// //                         : {}
// //                 }
// //                 onContextMenu={handleContextMenu}
// //                 onDragStart={handleDragStart}
// //                 // onResizeStart={handleResizeStart }
// //                 onResizeStart={() => setIsResizing(true)}
// //                 position={{ x: data.x, y: data.y }}
// //                 size={{ width: data.width, height: data.height }}
// //                 onDragStop={handleDragStop}
// //                 onResizeStop={handleResizeStop}
// //                 onMouseDown={handleMouseDown}
// //                 onMouseEnter={() => setIsHover(true)}
// //                 onMouseLeave={() => setIsHover(false)}
// //                 style={{
// //                     // border: selectedId === id ? "2px solid var(--kd-accent-primary)" : "none",
// //                     border: "2px solid transparent",
// //                     // borderColor:
// //                     //     selectedId === id || isHover
// //                     //         ? "var(--kd-accent-primary)"
// //                     //         : "transparent",

// //                     borderColor:
// //                         !imageExportMode && (selectedId === id || isHover)
// //                             ? "var(--kd-accent-primary)"
// //                             : "transparent",

// //                     display: "flex",
// //                     // borderRadius: 6,
// //                     padding: 4,
// //                     boxSizing: "border-box",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     background: "transparent",
// //                     // zIndex: data.zIndex,
// //                 }}
// //             >
// //                 {data.type === "shape" && (



// //                     <div ref={selectedId === id ? editingRef : null}
// //                         style={{ width: "100%", height: "100%", pointerEvents: "none", color: data.color, }}>
// //                         <svg
// //                             width="100%"
// //                             height="100%"
// //                             viewBox="0 0 100 100"
// //                             preserveAspectRatio="none"
// //                             fill={data.color}

// //                             dangerouslySetInnerHTML={{ __html: data.shape ?? "" }} />
// //                     </div>
// //                 )}
// //             </Rnd>
// //             {selectedId === id && !imageExportMode && !isResizing && !isTransforming && targetEl && (
// //                 <FloatingToolBar target={targetEl} />
// //             )}

// //         </>
// //     );
// // }, (prevProps, nextProps) => {
// //     return (
// //         prevProps.id === nextProps.id &&
// //         prevProps.slideIndex === nextProps.slideIndex &&
// //         JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
// //     );
// // });

// // RenderShape.displayName = "RenderShape";

// // export default RenderShape;


// import React, { useState, useRef, useEffect, memo, useCallback } from "react";
// import { useShallow } from "zustand/shallow";
// import useEditorStore, { ElementData, ShapeData } from "@/app/Store/editorStore";
// import { Rnd } from "react-rnd";
// import type { DraggableEvent, DraggableData } from "react-draggable";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";



// const ShapeRenderer = memo(({
//   data,
//   editingRef,
// }: {
//   data: ShapeData;
//   editingRef: React.RefObject<HTMLDivElement | null>;
// }) => (
//   <div
//     ref={editingRef}
//     style={{
//       width: "100%",
//       height: "100%",
//       pointerEvents: "none",
//       opacity: data.opacity ?? 1,
//       // ✅ borderRadius aur border div pe nahi — SVG ke andar jayega
//       transform: [
//         `rotate(${data.rotation ?? 0}deg)`,
//         data.flipX ? "scaleX(-1)" : "",
//         data.flipY ? "scaleY(-1)" : "",
//       ].filter(Boolean).join(" ") || undefined,
//     }}
//   >
//     <svg
//       width="100%"
//       height="100%"
//       viewBox="0 0 100 100"
//       preserveAspectRatio="none"
//       // ✅ SVG pe stroke directly
//       stroke={data.strokeColor ?? "transparent"}
//       strokeWidth={data.strokeWidth ? (data.strokeWidth * 2) : 0}
//       strokeDasharray={
//         data.strokeStyle === "dashed" ? "8 4" :
//         data.strokeStyle === "dotted" ? "2 4" :
//         data.strokeStyle === "inset"  ? "12 6" :
//         undefined
//       }
//       // ✅ stroke andar rahega, bahar nahi jayega
//       style={{ overflow: "visible" }}
//       dangerouslySetInnerHTML={{
//         // ✅ Shape HTML ke andar rect wrap karo borderRadius ke liye
//         __html: `
//           <clipPath id="shape-clip-${data.shape?.length ?? 0}">
//             <rect width="100" height="100" rx="${
//               data.borderRadius
//                 ? parseInt(data.borderRadius)
//                 : 0
//             }" ry="${
//               data.borderRadius
//                 ? parseInt(data.borderRadius)
//                 : 0
//             }"/>
//           </clipPath>
//           <g clip-path="url(#shape-clip-${data.shape?.length ?? 0})" fill="${data.color ?? 'currentColor'}">
//             ${data.shape ?? ""}
//           </g>
//           ${data.strokeWidth ? `
//           <rect
//             width="100" height="100"
//             rx="${data.borderRadius ? parseInt(data.borderRadius) : 0}"
//             ry="${data.borderRadius ? parseInt(data.borderRadius) : 0}"
//             fill="none"
//             stroke="${data.strokeColor ?? '#000'}"
//             stroke-width="${data.strokeWidth * 2}"
//             stroke-dasharray="${
//               data.strokeStyle === "dashed" ? "8 4" :
//               data.strokeStyle === "dotted" ? "2 4" :
//               data.strokeStyle === "inset"  ? "12 6" :
//               "none"
//             }"
//           />` : ""}
//         `
//       }}
//     />
//   </div>
// ));
// ShapeRenderer.displayName = "ShapeRenderer";

// // ✅ Main component
// const RenderShape: React.FC<{
//   id: string;
//   data: ElementData;
//   slideIndex: number;
// }> = memo(({ id, data, slideIndex }) => {
//   const {
//     updateElement,
//     activeElementId: selectedId,
//     setActiveElementId,
//     setActiveSlide,
//   } = useEditorStore(
//     useShallow((s) => ({
//       updateElement: s.updateElement,
//       activeElementId: s.activeElementId,
//       setActiveElementId: s.setActiveElementId,
//       setActiveSlide: s.setActiveSlide,
//     }))
//   );
//   const imageExportMode = useEditorUIStore((s) => s.imageExportMode);

//   const [isTransforming, setIsTransforming] = useState(false);
//   // ✅ HTMLDivElement — shape div ke liye (pehle HTMLImageElement tha, wrong tha)
//   const editingRef = useRef<HTMLDivElement | null>(null);
//   const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
//   const [isHover, setIsHover] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);

//   useEffect(() => {
//     if (selectedId === id && editingRef.current) {
//       setTargetEl(editingRef.current);
//     } else {
//       setTargetEl(null);
//     }
//   }, [selectedId, id]);

//   const handleContextMenu = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     setActiveSlide(slideIndex);
//     setActiveElementId(id);
//   }, [slideIndex, id, setActiveSlide, setActiveElementId]);

//   const handleDragStart = useCallback(() => {
//     setIsTransforming(true);
//   }, []);

//   const handleDragStop = useCallback(
//     (_e: DraggableEvent, d: DraggableData) => {
//       setIsTransforming(false);
//       updateElement(id, { x: d.x, y: d.y }, { history: true });
//     },
//     [id, updateElement]
//   );

//   const handleResizeStop = useCallback(
//     (
//       _e: MouseEvent | TouchEvent,
//       _dir: string,
//       ref: HTMLElement,
//       _delta: { width: number; height: number },
//       pos: { x: number; y: number }
//     ) => {
//       setIsResizing(false);
//       updateElement(
//         id,
//         { width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y },
//         { history: true }
//       );
//     },
//     [id, updateElement]
//   );

//   const handleMouseDown = useCallback(() => {
//     setActiveSlide(slideIndex);
//     setActiveElementId(id);
//   }, [slideIndex, id, setActiveSlide, setActiveElementId]);

//   return (
//     <>
//       <Rnd
//         data-element="true"
//         key={id}
//         enableResizing={
//           selectedId === id
//             ? { top: true, right: true, bottom: true, left: true,
//                 topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }
//             : false
//         }
//         resizeHandleStyles={
//           selectedId === id && !isTransforming && !imageExportMode
//             ? {
//                 top:    { width: "20px", height: "6px",  top: "-4px",    left: "50%", transform: "translateX(-50%)", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "ns-resize" },
//                 bottom: { width: "20px", height: "6px",  bottom: "-4px", left: "50%", transform: "translateX(-50%)", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "ns-resize" },
//                 left:   { width: "6px",  height: "20px", left: "-4px",   top: "50%",  transform: "translateY(-50%)", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "ew-resize" },
//                 right:  { width: "6px",  height: "20px", right: "-4px",  top: "50%",  transform: "translateY(-50%)", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "ew-resize" },
//                 topLeft:     { width: "12px", height: "12px", top: "-6px",    left: "-6px",  background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "nwse-resize", borderRadius: "50%" },
//                 topRight:    { width: "12px", height: "12px", top: "-6px",    right: "-6px", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "nesw-resize", borderRadius: "50%" },
//                 bottomLeft:  { width: "12px", height: "12px", bottom: "-6px", left: "-6px",  background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "nesw-resize", borderRadius: "50%" },
//                 bottomRight: { width: "12px", height: "12px", bottom: "-6px", right: "-6px", background: "var(--kd-bg-primary)", border: "1px solid var(--kd-text-primary)", cursor: "nwse-resize", borderRadius: "50%" },
//               }
//             : {}
//         }
//         onContextMenu={handleContextMenu}
//         onDragStart={handleDragStart}
//         onResizeStart={() => setIsResizing(true)}
//         position={{ x: data.x, y: data.y }}
//         size={{ width: data.width, height: data.height }}
//         onDragStop={handleDragStop}
//         onResizeStop={handleResizeStop}
//         onMouseDown={handleMouseDown}
//         onMouseEnter={() => setIsHover(true)}
//         onMouseLeave={() => setIsHover(false)}
//         style={{
//           border: "2px solid transparent",
//           borderColor:
//             !imageExportMode && (selectedId === id || isHover)
//               ? "var(--kd-accent-primary)"
//               : "transparent",
//           display: "flex",
//           padding: 4,
//           boxSizing: "border-box",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "transparent",
//         }}
//       >

//         {data.type === "shape" && (
//           <ShapeRenderer
//             data={data}
//             editingRef={editingRef}
//           />
//         )}
//       </Rnd>

//       {selectedId === id && !imageExportMode && !isResizing && !isTransforming && targetEl && (
//         <FloatingToolBar target={targetEl} />
//       )}
//     </>
//   );
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.id === nextProps.id &&
//     prevProps.slideIndex === nextProps.slideIndex &&
//     JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
//   );
// });

// RenderShape.displayName = "RenderShape";

// export default RenderShape;













import React, { useCallback, memo } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, ShapeData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "./CanvasDragDrop";
// import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";


const ShapeRenderer = memo(({ data }: { data: ShapeData }) => {
    return (
        <div
            // ref={editingRef}
            style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                opacity: data.opacity ?? 1,
                transform: [
                    `rotate(${data.rotation ?? 0}deg)`,
                    data.flipX ? "scaleX(-1)" : "",
                    data.flipY ? "scaleY(-1)" : "",
                ].filter(Boolean).join(" ") || undefined,
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                stroke={data.strokeColor ?? "transparent"}
                strokeWidth={data.strokeWidth ? (data.strokeWidth * 2) : 0}
                strokeDasharray={
                    data.strokeStyle === "dashed" ? "8 4" :
                        data.strokeStyle === "dotted" ? "2 4" :
                            data.strokeStyle === "inset" ? "12 6" :
                                undefined
                }
                style={{ overflow: "visible" }}
                dangerouslySetInnerHTML={{
                    __html: `
          <clipPath id="shape-clip-${data.shape?.length ?? 0}">
            <rect width="100" height="100" rx="${data.borderRadius
                            ? parseInt(data.borderRadius)
                            : 0
                        }" ry="${data.borderRadius
                            ? parseInt(data.borderRadius)
                            : 0
                        }"/>
          </clipPath>
          <g clip-path="url(#shape-clip-${data.shape?.length ?? 0})" fill="${data.color ?? 'currentColor'}">
            ${data.shape ?? ""}
          </g>
          ${data.strokeWidth ? `
          <rect
            width="100" height="100"
            rx="${data.borderRadius ? parseInt(data.borderRadius) : 0}"
            ry="${data.borderRadius ? parseInt(data.borderRadius) : 0}"
            fill="none"
            stroke="${data.strokeColor ?? '#000'}"
            stroke-width="${data.strokeWidth * 2}"
            stroke-dasharray="${data.strokeStyle === "dashed" ? "8 4" :
                                data.strokeStyle === "dotted" ? "2 4" :
                                    data.strokeStyle === "inset" ? "12 6" :
                                        "none"
                            }"
          />` : ""}
        `
                }}
            />
        </div>
    );
});
ShapeRenderer.displayName = "ShapeRenderer";

const RenderShape: React.FC<{
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

    if (data.type !== "shape") return null;
    const shapeData = data as ShapeData;

    return (
        <>
            <CanvasDragDrop
                id={id}
                rect={{
                    x: shapeData.x,
                    y: shapeData.y,
                    width: shapeData.width,
                    height: shapeData.height,
                    rotation: shapeData.rotation ?? 0,
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
                {data.type === "shape" && (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            color: data.color,
                            opacity: data.opacity ?? 1,

                        }}>
                        <svg
                            width="100%"
                            height="100%"
                            style={{
                                transform: `
                                    scaleX(${data.flipX ? -1 : 1})
                                    scaleY(${data.flipY ? -1 : 1})
                                `,
                                border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
                            }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            fill={data.color}
                            dangerouslySetInnerHTML={{ __html: data.shape ?? "" }} />
                    </div>
                )}
            </CanvasDragDrop>

            {/* FloatingToolBar — CanvasDragDrop ke bahar, selectedId check */}
            {/* {isSelected && !imageExportMode && (
                <FloatingToolBarWrapper id={id} shapeData={shapeData} />
            )} */}
        </>
    );
}, (p, n) => {
    const a = p.data as ShapeData, b = n.data as ShapeData;
    return (
        p.id === n.id &&
        p.slideIndex === n.slideIndex &&
        a.x === b.x && a.y === b.y &&
        a.width === b.width && a.height === b.height &&
        a.rotation === b.rotation &&
        a.color === b.color &&
        a.shape === b.shape &&
        a.opacity === b.opacity &&
        a.flipX === b.flipX && a.flipY === b.flipY &&
        a.borderRadius === b.borderRadius &&
        a.strokeWidth === b.strokeWidth &&
        a.strokeStyle === b.strokeStyle &&
        a.strokeColor === b.strokeColor
    );
});

RenderShape.displayName = "RenderShape";
export default RenderShape;

