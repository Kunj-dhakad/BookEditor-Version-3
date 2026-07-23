import React, { useCallback, memo, useState } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, ShapeData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "@/components/HomeLayout/EditorCanvas/RenderElement/CanvasDragDrop";
import { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";
import FloatingToolBar from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/FloatingToolBar";


const ShapeRenderer = memo(({ data }: { data: ShapeData }) => {
    return (
        <div
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
    clipBounds?: PageClipBounds;
}> = memo(({ id, data, slideIndex, clipBounds }) => {
    const { updateElement, setActiveElementId, setActiveSlide, toggleSelectedElementId } = useEditorStore(
        useShallow((s) => ({
            updateElement: s.updateElement,
            setActiveElementId: s.setActiveElementId,
            setActiveSlide: s.setActiveSlide,
            toggleSelectedElementId: s.toggleSelectedElementId,
        }))
    );

    const isSelected = useEditorStore(
        useCallback((s) => s.selectedElementIds.includes(id), [id])
    );

    const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
    const [targetEl, setTargetEl] = useState<HTMLDivElement | null>(null);

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
                clipBounds={clipBounds}
                onContainerChange={setTargetEl}
                onSelect={(e) => {
                    setActiveSlide(slideIndex);
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                        toggleSelectedElementId(id);
                    } else {
                        setActiveElementId(id);
                    }
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
            {isSelected && !imageExportMode && targetEl && (
                <FloatingToolBar target={targetEl} />
            )}

            {/* FloatingToolBar â€” CanvasDragDrop ke bahar, selectedId check */}
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
        p.clipBounds?.width === n.clipBounds?.width &&
        p.clipBounds?.height === n.clipBounds?.height &&
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

