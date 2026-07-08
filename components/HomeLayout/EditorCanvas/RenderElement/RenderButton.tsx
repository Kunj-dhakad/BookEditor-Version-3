import React, { useState, memo, useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ButtonData, ElementData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "./CanvasDragDrop";

const SHADOW_MAP: Record<string, string> = {
  none: "none",
  soft: "0 2px 8px rgba(0,0,0,0.15)",
  regular: "0 4px 12px rgba(0,0,0,0.25)",
  retro: "3px 3px 0 rgba(0,0,0,0.8)",
};

const RenderButton: React.FC<{
  id: string;
  data: ElementData;
  slideIndex: number;
}> = memo(({ id, data, slideIndex }) => {
  const btnData = data as ButtonData;

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
  const editingRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const wasSelectedAtDownRef = useRef(false);

  const syncWidthToText = useCallback(() => {
    const el = editingRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const currentText = el.innerText || btnData.text;
      const span = document.createElement("span");
      span.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font-size: ${btnData.fontSize}px;
        font-family: ${btnData.fontFamily};
        font-weight: ${btnData.fontWeight};
      `;
      span.innerText = currentText;
      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      const borderWidth = (btnData.borderWidth || 2) * 2;
      const padding = 32;
      const newWidth = Math.max(textWidth + padding + borderWidth, 80);

      updateElement(id, { width: newWidth });
    });
  }, [id, updateElement, btnData.fontSize, btnData.fontFamily, btnData.fontWeight, btnData.borderWidth, btnData.text]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      updateElement(
        id,
        {
          text: e.currentTarget.innerText,
          height: e.currentTarget.scrollHeight + 4,
        },
        { history: true }
      );
      setEditing(false);
    },
    [id, updateElement]
  );

  const handleSelect = useCallback(() => {
    wasSelectedAtDownRef.current = isSelected;
    if (!isSelected) {
      setActiveSlide(slideIndex);
      setActiveElementId(id);
      setEditing(false);
    }
  }, [id, isSelected, setActiveElementId, setActiveSlide, slideIndex]);

  const handleBodyClick = useCallback(() => {
    if (wasSelectedAtDownRef.current) {
      setEditing(true);
      requestAnimationFrame(() => editingRef.current?.focus());
    }
  }, []);

  if (data.type !== "button") return null;

  const getButtonStyles = (): React.CSSProperties => {
    const hasGradient = !!(btnData.gradientFrom && btnData.gradientTo);
    const gradDir =
      btnData.gradientDirection === "vertical"
        ? "to bottom"
        : btnData.gradientDirection === "horizontal"
          ? "to right"
          : "135deg";

    const shadowVal = SHADOW_MAP[btnData.shadowPreset ?? "none"];

    return {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent:
        btnData.textAlign === "left"
          ? "flex-start"
          : btnData.textAlign === "right"
            ? "flex-end"
            : "center",
      gap: 6,
      padding: "0 16px",
      boxSizing: "border-box",
      overflow: "hidden",
      whiteSpace: "nowrap",
      background: hasGradient
        ? `linear-gradient(${gradDir}, ${btnData.gradientFrom}, ${btnData.gradientTo})`
        : (btnData.backgroundColor ?? "transparent"),
      border: btnData.strokeWidth
        ? `${btnData.strokeWidth}px ${btnData.strokeStyle ?? "solid"} ${btnData.borderColor ?? "#000"}`
        : undefined,
      borderRadius: btnData.borderRadius ?? 0,
      outline: "none",
      boxShadow: shadowVal,
      opacity: btnData.opacity ?? 1,
      fontSize: btnData.fontSize ?? 14,
      fontFamily: btnData.fontFamily ?? "Inter",
      fontWeight: btnData.fontWeight ?? 400,
      color: btnData.textColor ?? "#ffffff",
      fontStyle: btnData.fontStyle ?? "normal",
      textDecoration: btnData.textDecorationLine ?? "none",
      textTransform: btnData.textTransform ?? "none",
      letterSpacing: btnData.letterSpacing ? `${btnData.letterSpacing}px` : undefined,
      cursor: editing ? "text" : "move",
      transition: "all 0.2s ease",
    };
  };

  return (
    <CanvasDragDrop
      id={id}
      rect={{
        x: btnData.x,
        y: btnData.y,
        width: btnData.width,
        height: btnData.height,
        rotation: btnData.rotation ?? 0,
      }}
      isSelected={isSelected}
      imageExportMode={imageExportMode}
      onSelect={handleSelect}
      onElementClick={handleBodyClick}
      onChange={(r) =>
        updateElement(
          id,
          {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            rotation: r.rotation,
          },
          { history: true }
        )
      }
    >
      <div style={{ width: "100%", height: "100%" }}>
        <div
          ref={editingRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onInput={syncWidthToText}
          style={getButtonStyles()}
        >
          {!editing && btnData.icon && btnData.iconPosition === "left" && (
            <span style={{ pointerEvents: "none" }}>{btnData.icon}</span>
          )}
          <span>{btnData.text}</span>
          {!editing && btnData.icon && btnData.iconPosition !== "left" && (
            <span style={{ pointerEvents: "none" }}>{btnData.icon}</span>
          )}
        </div>
      </div>
    </CanvasDragDrop>
  );
}, (p, n) => {
  const a = p.data as ButtonData, b = n.data as ButtonData;
  return (
    p.id === n.id &&
    p.slideIndex === n.slideIndex &&
    a.x === b.x && a.y === b.y &&
    a.width === b.width && a.height === b.height &&
    a.rotation === b.rotation &&
    a.text === b.text &&
    a.fontSize === b.fontSize &&
    a.fontFamily === b.fontFamily &&
    a.fontWeight === b.fontWeight &&
    a.fontStyle === b.fontStyle &&
    a.textColor === b.textColor &&
    a.backgroundColor === b.backgroundColor &&
    a.gradientFrom === b.gradientFrom &&
    a.gradientTo === b.gradientTo &&
    a.gradientDirection === b.gradientDirection &&
    a.borderRadius === b.borderRadius &&
    a.strokeWidth === b.strokeWidth &&
    a.strokeStyle === b.strokeStyle &&
    a.borderColor === b.borderColor &&
    a.shadowPreset === b.shadowPreset &&
    a.opacity === b.opacity &&
    a.textAlign === b.textAlign &&
    a.textDecorationLine === b.textDecorationLine &&
    a.textTransform === b.textTransform &&
    a.letterSpacing === b.letterSpacing &&
    a.icon === b.icon &&
    a.iconPosition === b.iconPosition
  );
});

RenderButton.displayName = "RenderButton";
export default RenderButton;