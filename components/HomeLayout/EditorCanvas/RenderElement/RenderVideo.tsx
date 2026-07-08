import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData } from "@/app/Store/editorStore";
import { Rnd } from "react-rnd";
import type { DraggableEvent, DraggableData } from "react-draggable";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import VideoEditToolbar from "../toolbar/EditTool/VideoEdit/VideoEditToolbar";
import Image from 'next/image'
import FloatingToolBar from "../toolbar/EditTool/ComanEditTool/FloatingToolBar";


const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
        /(?:(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/|live\/)|youtu\.be\/|music\.youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

const isYoutubeShorts = (url: string) => /youtube\.com\/shorts\//i.test(url);

const YouTubeEmbed: React.FC<{
    src: string;
    youtubeId: string;
    isSelected: boolean;
    isTransforming: boolean;
    isResizing: boolean;
    onDeselect: () => void;
}> = ({ src, youtubeId, isSelected, isTransforming, isResizing }) => {
    const isShorts = isYoutubeShorts(src);
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;

    const showBlockingOverlay = !isSelected || isTransforming || isResizing;

    if (isShorts) {
        return (
            <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, padding: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <Image
                    height={200}
                    width={200}
                    unoptimized
                    src={thumbnailUrl}
                    alt=""
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, filter: "blur(10px)" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span style={{ fontSize: 26, position: "relative", zIndex: 1 }}>🔒</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, position: "relative", zIndex: 1 }}>
                    YouTube Shorts cannot be embedded
                </span>
                <span style={{ color: "#999", fontSize: 11, position: "relative", zIndex: 1, lineHeight: 1.6 }}>
                    Use a regular youtube.com/watch?v= link instead.
                </span>
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "relative", zIndex: 1, background: "#ff0000", color: "#fff", padding: "6px 14px", borderRadius: 4, fontSize: 12, textDecoration: "none", fontWeight: 600 }}
                >
                    ▶ Watch on YouTube
                </a>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <iframe
                src={embedUrl}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
            />


            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    background: "transparent",
                    pointerEvents: showBlockingOverlay ? "all" : "none",
                    cursor: !isSelected ? "move" : "default",
                }}
            />
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────


const RenderVideo: React.FC<{
    id: string;
    data: ElementData;
    slideIndex: number
}> = memo(({ id, data, slideIndex }) => {
    const {
        updateElement,
        activeElementId: selectedId,
        setActiveElementId,
        setActiveSlide,
    } = useEditorStore(
        useShallow((s) => ({
            updateElement: s.updateElement,
            activeElementId: s.activeElementId,
            setActiveElementId: s.setActiveElementId,
            setActiveSlide: s.setActiveSlide,
        }))
    );
    const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
    const [isTransforming, setIsTransforming] = useState(false);
    const editingRef = useRef<HTMLVideoElement | null>(null);
    const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
    const [isHover, setIsHover] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        if (selectedId === id && editingRef.current) {
            setTargetEl(editingRef.current);
        } else {
            setTargetEl(null);
        }
    }, [selectedId, id]);


    useEffect(() => {
        if (selectedId !== id) return;
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-element='true']")) {
                setActiveElementId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [selectedId, id, setActiveElementId]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setActiveSlide(slideIndex);
        setActiveElementId(id);
    }, [slideIndex, id, setActiveSlide, setActiveElementId]);

    const handleDragStart = useCallback(() => {
        setIsTransforming(true);
    }, []);


    const handleDragStop = useCallback(
        (_e: DraggableEvent, d: DraggableData) => {
            setIsTransforming(false);
            updateElement(id, { x: d.x, y: d.y }, { history: true });
        },
        [id, updateElement]
    );

    const handleResizeStop = useCallback(
        (
            _e: MouseEvent | TouchEvent,
            _dir: string,
            ref: HTMLElement,
            _delta: { width: number; height: number },
            pos: { x: number; y: number }
        ) => {
            setIsResizing(false);
            updateElement(
                id,
                {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: pos.x,
                    y: pos.y,
                },
                { history: true }
            );
        },
        [id, updateElement]
    );

    const handleMouseDown = useCallback(() => {
        setActiveSlide(slideIndex);
        setActiveElementId(id);
    }, [slideIndex, id, setActiveSlide, setActiveElementId]);


    const togglePlay = () => {
        if (!editingRef.current) return;

        if (isPlaying) {
            editingRef.current.pause();
        } else {
            editingRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    return (
        <>
            <Rnd
                data-element="true"
                key={id}
                enableResizing={
                    selectedId === id
                        ? {
                            top: true,
                            right: true,
                            bottom: true,
                            left: true,
                            topRight: true,
                            bottomRight: true,
                            bottomLeft: true,
                            topLeft: true,
                        }
                        : false
                }
                resizeHandleStyles={
                    selectedId === id && !isTransforming && !imageExportMode
                        ? {
                            top: {
                                width: "20px",
                                height: "6px",
                                top: "-4px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "ns-resize",
                            },
                            bottom: {
                                width: "20px",
                                height: "6px",
                                bottom: "-4px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "ns-resize",
                            },
                            left: {
                                width: "6px",
                                height: "20px",
                                left: "-4px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "ew-resize",
                            },
                            right: {
                                width: "6px",
                                height: "20px",
                                right: "-4px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "ew-resize",
                            },
                            topLeft: {
                                width: "12px",
                                height: "12px",
                                top: "-6px",
                                left: "-6px",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "nwse-resize",
                                borderRadius: "50%",
                            },
                            topRight: {
                                width: "12px",
                                height: "12px",
                                top: "-6px",
                                right: "-6px",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "nesw-resize",
                                borderRadius: "50%",
                            },
                            bottomLeft: {
                                width: "12px",
                                height: "12px",
                                bottom: "-6px",
                                left: "-6px",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "nesw-resize",
                                borderRadius: "50%",
                            },
                            bottomRight: {
                                width: "12px",
                                height: "12px",
                                bottom: "-6px",
                                right: "-6px",
                                background: `var(--kd-bg-primary)`,
                                border: "1px solid var(--kd-text-primary)",
                                cursor: "nwse-resize",
                                borderRadius: "50%",
                            },
                        }
                        : {}
                }
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onResizeStart={() => setIsResizing(true)}
                position={{ x: data.x, y: data.y }}
                size={{ width: data.width, height: data.height }}
                onDragStop={handleDragStop}
                onResizeStop={handleResizeStop}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    border: "2px solid transparent",
                    borderColor:
                        !imageExportMode && (selectedId === id || isHover)
                            ? "var(--kd-accent-primary)"
                            : "transparent",
                    display: "flex",
                    padding: 4,
                    boxSizing: "border-box",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                }}
            >
                {data.type === "video" && (
                    <>
                        {getYoutubeId(data.src) ? (
                            <YouTubeEmbed
                                src={data.src}
                                youtubeId={getYoutubeId(data.src)!}
                                isSelected={selectedId === id}
                                isTransforming={isTransforming}
                                isResizing={isResizing}
                                onDeselect={() => setActiveElementId(null)}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",

                                }}>
                                <video
                                    ref={selectedId === id ? editingRef : null}
                                    src={data.src}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        userSelect: "none",
                                        transform: `
                                        scaleX(${data.flipX ? -1 : 1})
                                        scaleY(${data.flipY ? -1 : 1})
                                    `,
                                        border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
                                        opacity: data.opacity ?? 100 / 100,
                                        borderRadius: data.borderRadius || 0,
                                        filter: `
                                            contrast(${data.contrast ?? 100}%)
                                            brightness(${data.brightness ?? 100}%)
                                            saturate(${data.saturate ?? 100}%)
                                            blur(${data.blur ?? 0}px)
                                            grayscale(${data.grayscale ?? 0}%)
                                            sepia(${data.sepia ?? 0}%)
                                            hue-rotate(${data.hueRotate ?? 0}deg)
                                            `,
                                    }}
                                />

                                <button
                                    onClick={togglePlay}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        background: "rgba(0,0,0,0.6)",
                                        border: "none",
                                        color: "white",
                                        fontSize: "22px",
                                        padding: "12px 16px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                    }}
                                >
                                    {isPlaying ? "❚❚" : "▶"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Rnd>
            {selectedId === id && !imageExportMode && !isResizing && !isTransforming && targetEl && (
                <FloatingToolBar target={targetEl} />
            )}
        </>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.slideIndex === nextProps.slideIndex &&
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    );
});

RenderVideo.displayName = "RenderVideo";

export default RenderVideo;