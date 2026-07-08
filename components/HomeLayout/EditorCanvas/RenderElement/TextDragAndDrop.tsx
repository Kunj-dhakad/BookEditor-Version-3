"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Move, RotateCcw } from "lucide-react";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "rotate";
type TransformKind = "drag" | "resize" | "rotate";

export type TextTransformRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type TransformMeta = {
  kind: TransformKind;
  handle: Handle | "drag";
};

interface Props {
  rect: TextTransformRect;
  isSelected: boolean;
  disabled?: boolean;
  imageExportMode?: boolean;
  onSelect: () => void;
  onElementClick?: () => void;
  onTransformStart?: (meta: TransformMeta) => void;
  onTransform?: (rect: TextTransformRect, meta: TransformMeta) => void;
  onTransformEnd: (rect: TextTransformRect, meta: TransformMeta) => void;
  onContainerChange?: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

const DEG = Math.PI / 180;
const MIN_SIZE = 20;

const getKind = (handle: Handle | "drag"): TransformKind => {
  if (handle === "drag") return "drag";
  if (handle === "rotate") return "rotate";
  return "resize";
};

const TextDragAndDrop: React.FC<Props> = memo(
  ({
    rect,
    isSelected,
    disabled = false,
    imageExportMode = false,
    onSelect,
    onElementClick,
    onTransformStart,
    onTransform,
    onTransformEnd,
    onContainerChange,
    children,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const quickControlsRef = useRef<HTMLDivElement>(null);
    const liveRect = useRef<TextTransformRect>({ ...rect });
    const dragState = useRef<{
      handle: Handle | "drag";
      startX: number;
      startY: number;
      startAngle: number;
      snap: TextTransformRect;
      started: boolean;
      wasSelected: boolean;
    } | null>(null);
    const movedRef = useRef(false);
    const lastMetaRef = useRef<TransformMeta | null>(null);
    const previousCursorRef = useRef<string>("");
    const [isHover, setIsHover] = useState(false);
    const [controlsPos, setControlsPos] = useState<{ left: number; top: number } | null>(null);
    const [rotationBadge, setRotationBadge] = useState<{ left: number; top: number; value: number } | null>(null);
    const zoom = useEditorUIStore((s) => s.MainCanvasScale);

    const formatRotation = useCallback((rotation: number) => {
      const rounded = Math.round(rotation);
      return ((((rounded + 180) % 360) + 360) % 360) - 180;
    }, []);

    const updateControlsPosition = useCallback(() => {
      const el = containerRef.current;
      if (!el || !isSelected || disabled || imageExportMode) {
        setControlsPos(null);
        return;
      }
      const box = el.getBoundingClientRect();
      setControlsPos({
        left: box.left + box.width / 2,
        top: box.bottom + 12,
      });
    }, [disabled, imageExportMode, isSelected]);

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

    const applyRectToDOM = useCallback((next: TextTransformRect) => {
      const el = containerRef.current;
      if (!el) return;
      el.style.left = `${next.x}px`;
      el.style.top = `${next.y}px`;
      el.style.width = `${next.width}px`;
      el.style.height = `${next.height}px`;
      el.style.transform = `rotate(${next.rotation}deg)`;
    }, []);

    const buildResizeRect = useCallback(
      (
        handle: Handle,
        snap: TextTransformRect,
        dx: number,
        dy: number
      ): TextTransformRect => {
        const cos = Math.cos(-snap.rotation * DEG);
        const sin = Math.sin(-snap.rotation * DEG);
        const ldx = dx * cos - dy * sin;
        const ldy = dx * sin + dy * cos;

        let { x, y, width, height } = snap;

        switch (handle) {
          case "e":
            width = Math.max(MIN_SIZE, snap.width + ldx);
            break;
          case "w":
            width = Math.max(MIN_SIZE, snap.width - ldx);
            x = snap.x + snap.width - width;
            break;
          case "s":
            height = Math.max(MIN_SIZE, snap.height + ldy);
            break;
          case "n":
            height = Math.max(MIN_SIZE, snap.height - ldy);
            y = snap.y + snap.height - height;
            break;
          case "se":
            width = Math.max(MIN_SIZE, snap.width + ldx);
            height = Math.max(MIN_SIZE, snap.height + ldy);
            break;
          case "sw":
            width = Math.max(MIN_SIZE, snap.width - ldx);
            height = Math.max(MIN_SIZE, snap.height + ldy);
            x = snap.x + snap.width - width;
            break;
          case "ne":
            width = Math.max(MIN_SIZE, snap.width + ldx);
            height = Math.max(MIN_SIZE, snap.height - ldy);
            y = snap.y + snap.height - height;
            break;
          case "nw":
            width = Math.max(MIN_SIZE, snap.width - ldx);
            height = Math.max(MIN_SIZE, snap.height - ldy);
            x = snap.x + snap.width - width;
            y = snap.y + snap.height - height;
            break;
        }

        return { x, y, width, height, rotation: snap.rotation };
      },
      []
    );

    const getPointerAngle = useCallback((clientX: number, clientY: number) => {
      const elRect = containerRef.current?.getBoundingClientRect();
      if (!elRect) return 0;
      const cx = elRect.left + elRect.width / 2;
      const cy = elRect.top + elRect.height / 2;
      return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    }, []);

    const onPointerDown = useCallback(
      (e: React.PointerEvent, handle: Handle | "drag") => {
        if (disabled || imageExportMode) return;
        e.stopPropagation();
        e.preventDefault();
        if (!isSelected) onSelect();

        const el = containerRef.current;
        if (!el) return;
        el.setPointerCapture(e.pointerId);
        el.style.transition = "none";
        if (isSelected) setChromeVisible(false);
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
          wasSelected: isSelected,
        };
        movedRef.current = false;
        const meta = { kind: getKind(handle), handle };
        lastMetaRef.current = meta;
        if (meta.kind === "resize") {
          dragState.current.started = true;
          setChromeVisible(false);
          onTransformStart?.(meta);
        }
      },
      [disabled, getPointerAngle, imageExportMode, isSelected, onSelect, onTransformStart, rect, setChromeVisible, setGlobalCursor]
    );

    const onPointerMove = useCallback(
      (e: React.PointerEvent) => {
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

        let next: TextTransformRect;
        const meta = lastMetaRef.current ?? { kind: getKind(ds.handle), handle: ds.handle };

        if (ds.handle === "drag") {
          next = { ...ds.snap, x: ds.snap.x + dx, y: ds.snap.y + dy };
        } else if (ds.handle === "rotate") {
          const angle = getPointerAngle(e.clientX, e.clientY);
          next = { ...ds.snap, rotation: ds.snap.rotation + (angle - ds.startAngle) };
          const box = containerRef.current?.getBoundingClientRect();
          setRotationBadge({
            left: box ? box.left + box.width / 2 : e.clientX,
            top: box ? box.bottom + 44 : e.clientY + 18,
            value: formatRotation(next.rotation),
          });
        } else {
          next = buildResizeRect(ds.handle, ds.snap, dx, dy);
        }

        liveRect.current = next;
        applyRectToDOM(next);
        if (meta.kind === "resize") {
          onTransform?.(next, meta);
        }
      },
      [applyRectToDOM, buildResizeRect, formatRotation, getPointerAngle, onTransform, setChromeVisible, zoom]
    );

    const onPointerUp = useCallback(() => {
      const ds = dragState.current;
      if (!ds) return;

      const meta = lastMetaRef.current ?? { kind: getKind(ds.handle), handle: ds.handle };
      const wasMove = movedRef.current;
      const el = containerRef.current;
      if (el) {
        el.style.transition = "";
      }
      dragState.current = null;
      lastMetaRef.current = null;
      setChromeVisible(true);
      setRotationBadge(null);
      setGlobalCursor(null);

      if (meta.kind === "drag" && (!wasMove || !ds.started)) {
        if (ds.wasSelected) onElementClick?.();
        return;
      }

      if (meta.kind === "rotate" && (!wasMove || !ds.started)) {
        return;
      }

      onTransformEnd(liveRect.current, meta);
      requestAnimationFrame(updateControlsPosition);
    }, [onElementClick, onTransformEnd, setChromeVisible, setGlobalCursor, updateControlsPosition]);

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
    const showControls = showOutline && !disabled;

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
        data-text-transform-box="true"
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerDown={(e) => onPointerDown(e, "drag")}
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          transform: `rotate(${rect.rotation}deg)`,
          transformOrigin: "center center",
          userSelect: disabled ? "text" : "none",
          touchAction: "none",
          cursor: disabled ? "text" : isSelected ? "move" : "pointer",
          overflow: "visible",
        }}
      >
        {isHover && !isSelected && !imageExportMode && !disabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid var(--kd-accent-primary)",
              pointerEvents: "none",
              zIndex: 9,
            }}
          />
        )}

        {showOutline && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid var(--kd-accent-primary)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}

        <div style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {children}
        </div>

        {showControls &&
          handles.map(({ h, style }) => (
            <div
              key={h}
              onPointerDown={(e) => onPointerDown(e, h)}
              style={{
                position: "absolute",
                width: isCorner(h) ? 10 : h === "w" || h === "e" ? 6 : 24,
                height: isCorner(h) ? 10 : h === "n" || h === "s" ? 6 : 24,
                ...(h === "w" || h === "e" ? { width: 6, height: 20 } : {}),
                background: "var(--kd-bg-primary, #fff)",
                border: "1px solid var(--kd-text-primary, #7c3aed)",
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
            data-text-quick-controls="true"
            style={{
              position: "fixed",
              top: controlsPos.top,
              left: controlsPos.left,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 24,
            }}
          >
            <button
              type="button"
              title="Rotate"
              onPointerDown={(e) => {
                setChromeVisible(false);
                onPointerDown(e, "rotate");
              }}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "white",
                border: "1px solid rgba(15, 23, 42, 0.16)",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--kd-accent-primary)",
                cursor: "grab",
                padding: 0,
              }}
            >
              <RotateCcw size={14} />
            </button>

            <button
              type="button"
              title="Move"
              onPointerDown={(e) => {
                setChromeVisible(false);
                onPointerDown(e, "drag");
              }}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "white",
                border: "1px solid rgba(15, 23, 42, 0.16)",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--kd-accent-primary)",
                cursor: "move",
                padding: 0,
              }}
            >
              <Move size={14} />
            </button>
          </div>,
          document.body
        )}
        {rotationBadge && typeof document !== "undefined" && createPortal(
          <div
            style={{
              position: "fixed",
              left: rotationBadge.left,
              top: rotationBadge.top,
              transform: "translateX(-50%)",
              borderRadius: 9,
              background: "#111827",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              lineHeight: "16px",
              padding: "6px 8px",
              zIndex: 10000,
              pointerEvents: "none",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            {rotationBadge.value}°
          </div>,
          document.body
        )}
      </div>
    );
  }
);

TextDragAndDrop.displayName = "TextDragAndDrop";
export default TextDragAndDrop;
