"use client";
import React, { useRef, useCallback, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Move, RotateCcw } from "lucide-react";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import useEditorStore from "@/app/Store/editorStore";
import { applyCopiedStyleIfActive } from "@/lib/styleClipboard";
import { getPageClipPath, PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "rotate";

interface Rect { x: number; y: number; width: number; height: number; rotation: number; }

interface Props {
  id: string;
  rect: Rect;
  isSelected: boolean;
  imageExportMode?: boolean;
  onSelect: (e: React.PointerEvent) => void;
  onElementClick?: () => void;
  onChange: (r: Rect) => void;
  onContainerChange?: (el: HTMLDivElement | null) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  clipBounds?: PageClipBounds;
  dragDisabled?: boolean;
  allowTextSelection?: boolean;
  children: React.ReactNode;
}

const DEG = Math.PI / 180;
const MIN_SIZE = 20;

export const CanvasDragDrop: React.FC<Props> = memo(({
  id, rect, isSelected, imageExportMode = false,
  onSelect, onElementClick, onChange, onContainerChange, onContextMenu, clipBounds,
  dragDisabled = false, allowTextSelection = false, children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentClipRef = useRef<HTMLDivElement>(null);
  const quickControlsRef = useRef<HTMLDivElement>(null);
  const liveRect = useRef<Rect>({ ...rect });
  const dragState = useRef<{
    handle: Handle | "drag";
    startX: number;
    startY: number;
    startAngle: number;
    snap: Rect;
    started: boolean;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [controlsPos, setControlsPos] = useState<{ left: number; top: number } | null>(null);
  const [rotationBadge, setRotationBadge] = useState<{ left: number; top: number; value: number } | null>(null);
  const movedRef = useRef(false);
  // Where a read-only (preview/export) press started, so pointer-up can tell a
  // click apart from a scroll/flip gesture that merely passed over the element.
  const readOnlyPressRef = useRef<{ x: number; y: number } | null>(null);
  const lastHandleRef = useRef<Handle | "drag" | null>(null);
  const previousCursorRef = useRef("");
  const zoom = useEditorUIStore((s) => s.MainCanvasScale);
  const selectedCount = useEditorStore((s) => s.selectedElementIds.length);
  const isMultiSelection = selectedCount > 1;

  const formatRotation = useCallback((rotation: number) => {
    const rounded = Math.round(rotation);
    return ((((rounded + 180) % 360) + 360) % 360) - 180;
  }, []);

  const updateControlsPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el || !isSelected || imageExportMode) {
      setControlsPos(null);
      return;
    }
    const box = el.getBoundingClientRect();
    setControlsPos({
      left: box.left + box.width / 2,
      top: box.bottom + 12,
    });
  }, [imageExportMode, isSelected]);

  const setChromeVisible = useCallback((visible: boolean) => {
    if (quickControlsRef.current) {
      quickControlsRef.current.style.display = visible ? "flex" : "none";
    }
    document.querySelectorAll<HTMLElement>(".kd-text-toolbar").forEach((el) => {
      el.style.display = visible ? "" : "none";
    });
  }, []);

  const setGlobalCursor = useCallback((cursor: string | null) => {
    if (typeof document === "undefined") return;
    if (cursor) {
      previousCursorRef.current = document.body.style.cursor;
      document.body.style.cursor = cursor;
    } else {
      document.body.style.cursor = previousCursorRef.current;
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(updateControlsPosition);
    window.addEventListener("scroll", updateControlsPosition, true);
    window.addEventListener("resize", updateControlsPosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateControlsPosition, true);
      window.removeEventListener("resize", updateControlsPosition);
    };
  }, [rect.x, rect.y, rect.width, rect.height, rect.rotation, updateControlsPosition, zoom]);

  const applyRectToDOM = useCallback((r: Rect) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.left = r.x + "px";
    el.style.top = r.y + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
    el.style.transform = `rotate(${r.rotation}deg)`;
    const clipPath = getPageClipPath(r, clipBounds) ?? "";
    if (contentClipRef.current) {
      contentClipRef.current.style.clipPath = clipPath;
      contentClipRef.current.style.setProperty("-webkit-clip-path", clipPath);
    }
  }, [clipBounds]);

  const getPointerAngle = useCallback((clientX: number, clientY: number) => {
    const elRect = containerRef.current?.getBoundingClientRect();
    if (!elRect) return 0;
    const cx = elRect.left + elRect.width / 2;
    const cy = elRect.top + elRect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, handle: Handle | "drag") => {
    e.stopPropagation();
    if (dragDisabled && handle === "drag") return;

    // Preview and export are read-only views of the canvas. A press there may
    // still turn into a click — links, buttons and interactions have to keep
    // working — but it must never move, resize, rotate or select the element.
    // (TextDragAndDrop already did this; without the same guard here every
    // non-text element stayed draggable inside the preview.)
    if (imageExportMode) {
      if (handle === "drag") {
        readOnlyPressRef.current = { x: e.clientX, y: e.clientY };
      }
      return;
    }

    e.preventDefault();
    if (e.button === 0 && applyCopiedStyleIfActive(id)) return;
    if (handle === "drag" && (e.ctrlKey || e.metaKey || e.shiftKey)) {
      onSelect(e);
      return;
    }
    if (!isSelected) onSelect(e);

    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    el.style.transition = "none";
    if (isSelected) {
      setIsTransforming(true);
      setChromeVisible(false);
    }
    if (handle === "rotate") setGlobalCursor("grabbing");
    if (handle === "drag") setGlobalCursor("move");

    liveRect.current = { ...rect };
    dragState.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startAngle: handle === "rotate" ? getPointerAngle(e.clientX, e.clientY) : 0,
      snap: { ...rect },
      started: false,
    };
    lastHandleRef.current = handle;
    movedRef.current = false;

    setIsDragging(true);
  }, [dragDisabled, getPointerAngle, id, imageExportMode, isSelected, onSelect, rect, setChromeVisible, setGlobalCursor]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds) return;

    const safeZoom = zoom || 1;
    const rawDx = e.clientX - ds.startX;
    const rawDy = e.clientY - ds.startY;
    const dx = rawDx / safeZoom;
    const dy = rawDy / safeZoom;

    const passedDragThreshold = Math.abs(rawDx) > 3 || Math.abs(rawDy) > 3;
    if ((ds.handle === "drag" || ds.handle === "rotate") && !ds.started) {
      if (!passedDragThreshold) return;
      ds.started = true;
      movedRef.current = true;
      setChromeVisible(false);
    } else if (passedDragThreshold) {
      movedRef.current = true;
    }

    const s = ds.snap;
    let newRect: Rect;

    if (ds.handle === "drag") {
      newRect = { ...s, x: s.x + dx, y: s.y + dy };

    } else if (ds.handle === "rotate") {
      const angle = getPointerAngle(e.clientX, e.clientY);
      newRect = { ...s, rotation: s.rotation + (angle - ds.startAngle) };
      const box = containerRef.current?.getBoundingClientRect();
      setRotationBadge({
        left: box ? box.left + box.width / 2 : e.clientX,
        top: box ? box.bottom + 44 : e.clientY + 18,
        value: formatRotation(newRect.rotation),
      });

    } else {
      const cos = Math.cos(-s.rotation * DEG);
      const sin = Math.sin(-s.rotation * DEG);
      const ldx = dx * cos - dy * sin;
      const ldy = dx * sin + dy * cos;

      let { x, y, width, height } = s;
      const { rotation } = s;
      switch (ds.handle) {
        case "e": width = Math.max(MIN_SIZE, s.width + ldx); break;
        case "w": width = Math.max(MIN_SIZE, s.width - ldx); x = s.x + s.width - width; break;
        case "s": height = Math.max(MIN_SIZE, s.height + ldy); break;
        case "n": height = Math.max(MIN_SIZE, s.height - ldy); y = s.y + s.height - height; break;
        case "se": width = Math.max(MIN_SIZE, s.width + ldx); height = Math.max(MIN_SIZE, s.height + ldy); break;
        case "sw": width = Math.max(MIN_SIZE, s.width - ldx); height = Math.max(MIN_SIZE, s.height + ldy); x = s.x + s.width - width; break;
        case "ne": width = Math.max(MIN_SIZE, s.width + ldx); height = Math.max(MIN_SIZE, s.height - ldy); y = s.y + s.height - height; break;
        case "nw": width = Math.max(MIN_SIZE, s.width - ldx); height = Math.max(MIN_SIZE, s.height - ldy); x = s.x + s.width - width; y = s.y + s.height - height; break;
        default: return;
      }

      newRect = { x, y, width, height, rotation };
    }

    liveRect.current = newRect;
    applyRectToDOM(newRect);

  }, [applyRectToDOM, formatRotation, getPointerAngle, setChromeVisible, zoom]);

  const onPointerUp = useCallback((e?: React.PointerEvent) => {
    const readOnlyPress = readOnlyPressRef.current;
    if (readOnlyPress) {
      readOnlyPressRef.current = null;
      // Only a press that stayed put is a click; dragging across the element to
      // scroll or flip the page must not activate it.
      const strayed =
        !!e &&
        (Math.abs(e.clientX - readOnlyPress.x) > 4 ||
          Math.abs(e.clientY - readOnlyPress.y) > 4);
      if (!strayed) onElementClick?.();
      return;
    }

    const ds = dragState.current;
    if (!ds) return;
    const handle = lastHandleRef.current;
    const wasMove = movedRef.current;
    const el = containerRef.current;
    if (el) el.style.transition = "";
    dragState.current = null;
    lastHandleRef.current = null;
    setIsDragging(false);
    setChromeVisible(true);
    setRotationBadge(null);
    setGlobalCursor(null);

    if (handle === "drag" && (!wasMove || !ds.started)) {
      setIsTransforming(false);
      onElementClick?.();
      return;
    }

    if (handle === "rotate" && (!wasMove || !ds.started)) {
      setIsTransforming(false);
      return;
    }

    onChange(liveRect.current);
    requestAnimationFrame(() => {
      updateControlsPosition();
      setIsTransforming(false);
    });
  }, [onChange, onElementClick, setChromeVisible, setGlobalCursor, updateControlsPosition]);

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
  const showOutline = isSelected && !imageExportMode;
  const showControls = showOutline && !isMultiSelection && !isTransforming;
  const setContainerRef = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el;
      onContainerChange?.(el);
    },
    [onContainerChange]
  );

  return (
    <div
      ref={setContainerRef}
      data-element="true"
      data-element-id={id}
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerDown={(e) => onPointerDown(e, "drag")}
      onContextMenu={onContextMenu}
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        transform: `rotate(${rect.rotation}deg)`,
        transformOrigin: "center center",
        userSelect: allowTextSelection ? "text" : "none",
        touchAction: "none",
        cursor: isSelected ? "move" : "pointer",
        transition: isDragging ? "none" : undefined,
        overflow: "visible",
        // The /preview page wraps every element in a `pointer-events-none`
        // container (so empty page background doesn't intercept scroll/flip
        // gestures). Elements themselves must explicitly opt back in, or
        // clicks/drags never reach them at all — in the editor this is a
        // harmless no-op since there is no such ancestor.
        pointerEvents: "auto",
      }}
    >
      {isHover && !isSelected && !imageExportMode && (
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid var(--kd-accent-primary)",
          pointerEvents: "none", zIndex: 9,
        }} />
      )}

      {showOutline && (
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid var(--kd-accent-primary)",
          pointerEvents: "none", zIndex: 10,
        }} />
      )}

      <div
        ref={contentClipRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          // Clip only the rendered artwork to the page. The parent wrapper
          // remains unclipped so selection, dragging, resizing, and rotation
          // continue to work even when the element is outside the page.
          clipPath: getPageClipPath(rect, clipBounds),
          WebkitClipPath: getPageClipPath(rect, clipBounds),
        }}
      >
        {children}
      </div>

      {showControls && handles.map(({ h, style }) => (
        <div
          key={h}
          onPointerDown={(e) => onPointerDown(e, h)}
          style={{
            position: "absolute",
            width: isCorner(h) ? 10 : (h === "w" || h === "e" ? 6 : 24),
            height: isCorner(h) ? 10 : (h === "n" || h === "s" ? 6 : 24),
            ...(h === "w" || h === "e" ? { width: 6, height: 20 } : {}),
            background: "var(--kd-control-bg)",
            border: "1px solid var(--kd-text-primary)",
            borderRadius: isCorner(h) ? "50%" : 3,
            zIndex: 20,
            ...style,
          }}
        />
      ))}

      {showControls && controlsPos && typeof document !== "undefined" && createPortal(
        <div
          ref={quickControlsRef}
          data-element="true"
          data-transform-quick-controls="true"
          className="kd-transform-quick-controls"
          style={{
            top: controlsPos.top,
            left: controlsPos.left,
          }}
        >
          <button
            type="button"
            title="Rotate"
            className="kd-transform-control-btn kd-transform-control-btn-rotate"
            onPointerDown={(e) => {
              setChromeVisible(false);
              onPointerDown(e, "rotate");
            }}
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            title="Move"
            className="kd-transform-control-btn kd-transform-control-btn-move"
            onPointerDown={(e) => {
              setChromeVisible(false);
              onPointerDown(e, "drag");
            }}
          >
            <Move size={14} />
          </button>
        </div>,
        document.body
      )}
      {rotationBadge && typeof document !== "undefined" && createPortal(
        <div
          className="kd-transform-rotation-badge"
          style={{
            left: rotationBadge.left,
            top: rotationBadge.top,
          }}
        >
          {rotationBadge.value}&deg;
        </div>,
        document.body
      )}
    </div>
  );
});

CanvasDragDrop.displayName = "CanvasDragDrop";
export default CanvasDragDrop;
