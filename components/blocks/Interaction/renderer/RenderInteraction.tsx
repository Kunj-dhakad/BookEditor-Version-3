"use client";

import React, { memo, useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, InteractionData, isInteractionData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "@/components/HomeLayout/EditorCanvas/RenderElement/CanvasDragDrop";
import type { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";
import ElementContextMenu from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/ElementContextMenu";
import { useElementContextMenu } from "@/components/HomeLayout/EditorCanvas/RenderElement/useElementContextMenu";
import { useBookOptional } from "@/app/preview/components/ebook/BookStateContext";
import QuizPopup from "@/components/blocks/Interaction/popups/QuizPopup";
import QuestionPopup from "@/components/blocks/Interaction/popups/QuestionPopup";
import ContactFormPopup from "@/components/blocks/Interaction/popups/ContactFormPopup";

const ENGAGEMENT_HINT: Record<string, string> = {
  quiz: "Click to complete quiz",
  question: "Click to answer",
  "contact-form": "Click to fill form",
};

const RenderInteraction: React.FC<{ id: string; data: ElementData; slideIndex: number; clipBounds?: PageClipBounds }> = memo(({ id, data, slideIndex, clipBounds }) => {
  const interaction = data as InteractionData;
  const { updateElement, setActiveElementId, setActiveSlide, toggleSelectedElementId } = useEditorStore(useShallow((s) => ({ updateElement: s.updateElement, setActiveElementId: s.setActiveElementId, setActiveSlide: s.setActiveSlide, toggleSelectedElementId: s.toggleSelectedElementId })));
  const isSelected = useEditorStore(useCallback((s) => s.selectedElementIds.includes(id), [id]));
  const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { contextMenuPos, handleContextMenu, closeContextMenu } = useElementContextMenu(id, slideIndex);

  // Only present inside the real /preview flipbook. Used to momentarily
  // pause react-pageflip's mouse-drag-to-flip gesture while the reader is
  // clicking a button, so the click reaches our popup instead of being
  // swallowed as the start of a page-flip drag.
  const book = useBookOptional();
  const releaseFlipBlockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!isInteractionData(data)) return null;

  const isEngagement =
    interaction.interactionKind === "quiz" ||
    interaction.interactionKind === "question" ||
    interaction.interactionKind === "contact-form";

  const select = (event: React.PointerEvent) => {
    setActiveSlide(slideIndex);
    if (event.ctrlKey || event.metaKey || event.shiftKey) return toggleSelectedElementId(id);
    if (!isSelected) setActiveElementId(id);
  };

  const holdFlipBlock = () => {
    if (!book || !imageExportMode) return;
    book.setBlockMouseFlip(true);
    if (releaseFlipBlockRef.current) clearTimeout(releaseFlipBlockRef.current);
    // Safety-net release in case pointerup/click never fires (e.g. the
    // gesture turned into a page-flip drag instead of a click).
    releaseFlipBlockRef.current = setTimeout(() => book.setBlockMouseFlip(false), 600);
  };

  const releaseFlipBlock = () => {
    if (!book) return;
    if (releaseFlipBlockRef.current) {
      clearTimeout(releaseFlipBlockRef.current);
      releaseFlipBlockRef.current = null;
    }
    book.setBlockMouseFlip(false);
  };

  const activate = () => {
    releaseFlipBlock();
    // Quiz / Question / Contact form always open the full, working popup —
    // both while editing and in the real Preview.
    if (isEngagement) {
      setPopupOpen(true);
      return;
    }
    // All other interaction kinds (links, social, etc.) only activate inside
    // the real preview, never while editing.
    if (!imageExportMode) return;
    if (interaction.interactionKind === "caption") return setCaptionExpanded((value) => !value);
    const url = interaction.url || interaction.link;
    if (url) window.open(url, interaction.target === "popup" ? "interaction-popup" : (interaction.target ?? "_blank"), interaction.target === "popup" ? "popup=yes,width=800,height=600" : undefined);
  };

  const iconSize = interaction.interactionKind === "link-area" ? 26 : 18;
  // Hide the selection outline / resize / rotate controls while the popup is
  // open — otherwise the quick-controls (portaled near the button) render on
  // top of the popup content instead of behind it.
  const dragDropSelected = isSelected && !popupOpen;

  return <><CanvasDragDrop
    id={id}
    rect={{ x: interaction.x, y: interaction.y, width: interaction.width, height: interaction.height, rotation: interaction.rotation ?? 0 }}
    isSelected={dragDropSelected}
    imageExportMode={imageExportMode}
    clipBounds={clipBounds}
    onContextMenu={handleContextMenu}
    onSelect={select}
    onElementClick={activate}
    onChange={(rect) => updateElement(id, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, rotation: rect.rotation }, { history: true })}
  >
    <div
      title={interaction.tooltip}
      onMouseEnter={() => !imageExportMode && isEngagement && setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
      onPointerDownCapture={holdFlipBlock}
      onPointerUp={releaseFlipBlock}
      style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: interaction.textAlign === "left" ? "flex-start" : interaction.textAlign === "right" ? "flex-end" : "center", gap: 6, padding: "0 14px", boxSizing: "border-box", background: interaction.backgroundColor ?? "transparent", borderRadius: interaction.borderRadius ?? 0, opacity: interaction.opacity ?? 1, cursor: imageExportMode || isEngagement ? "pointer" : "move" }}
    >
      {interaction.svg && (
        <span aria-hidden="true" style={{ color: interaction.iconColor ?? interaction.textColor ?? "#fff", width: iconSize, height: iconSize, flexShrink: 0, display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: interaction.svg }} />
      )}
      {isEngagement && (
        <span
          style={{
            color: interaction.textColor ?? "#fff",
            fontSize: interaction.fontSize ?? 13,
            fontWeight: interaction.fontWeight ?? 700,
            fontFamily: interaction.fontFamily ?? "Inter",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {interaction.text || (interaction.interactionKind === "quiz" ? "TAKE QUIZ" : interaction.interactionKind === "question" ? "ANSWER QUESTION" : "Contact form")}
        </span>
      )}

      {interaction.interactionKind === "caption" && captionExpanded && <span style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", padding: 10, borderRadius: interaction.borderRadius ?? 8, background: interaction.backgroundColor ?? "#4f46e5", color: interaction.textColor ?? "#fff", whiteSpace: "normal", zIndex: 20 }}>{interaction.expandedText || interaction.text}</span>}

      {/* Demo hint shown only while editing (not in the real preview) */}
      {isEngagement && showHint && !imageExportMode && !popupOpen && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111827",
            color: "#fff",
            fontSize: 11,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          {ENGAGEMENT_HINT[interaction.interactionKind]}
        </span>
      )}
    </div>
  </CanvasDragDrop>

  {popupOpen && interaction.interactionKind === "quiz" && (
    <QuizPopup data={interaction} onClose={() => setPopupOpen(false)} />
  )}
  {popupOpen && interaction.interactionKind === "question" && (
    <QuestionPopup data={interaction} onClose={() => setPopupOpen(false)} />
  )}
  {popupOpen && interaction.interactionKind === "contact-form" && (
    <ContactFormPopup data={interaction} onClose={() => setPopupOpen(false)} />
  )}

  <ElementContextMenu position={dragDropSelected ? contextMenuPos : null} elementId={id} onClose={closeContextMenu} /></>;
});

RenderInteraction.displayName = "RenderInteraction";
export default RenderInteraction;
