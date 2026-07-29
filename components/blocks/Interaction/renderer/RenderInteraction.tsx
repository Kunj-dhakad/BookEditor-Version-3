"use client";

import React, { memo, useCallback, useState } from "react";
import { useShallow } from "zustand/shallow";
import useEditorStore, { ElementData, InteractionData, isInteractionData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { CanvasDragDrop } from "@/components/HomeLayout/EditorCanvas/RenderElement/CanvasDragDrop";
import type { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";
import ElementContextMenu from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/ElementContextMenu";
import { useElementContextMenu } from "@/components/HomeLayout/EditorCanvas/RenderElement/useElementContextMenu";

const RenderInteraction: React.FC<{ id: string; data: ElementData; slideIndex: number; clipBounds?: PageClipBounds }> = memo(({ id, data, slideIndex, clipBounds }) => {
  const interaction = data as InteractionData;
  const { updateElement, setActiveElementId, setActiveSlide, toggleSelectedElementId } = useEditorStore(useShallow((s) => ({ updateElement: s.updateElement, setActiveElementId: s.setActiveElementId, setActiveSlide: s.setActiveSlide, toggleSelectedElementId: s.toggleSelectedElementId })));
  const isSelected = useEditorStore(useCallback((s) => s.selectedElementIds.includes(id), [id]));
  const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const { contextMenuPos, handleContextMenu, closeContextMenu } = useElementContextMenu(id, slideIndex);

  if (!isInteractionData(data)) return null;
  const select = (event: React.PointerEvent) => {
    setActiveSlide(slideIndex);
    if (event.ctrlKey || event.metaKey || event.shiftKey) return toggleSelectedElementId(id);
    if (!isSelected) setActiveElementId(id);
  };
  const activate = () => {
    if (!imageExportMode) return;
    if (interaction.interactionKind === "caption") return setCaptionExpanded((value) => !value);
    const url = interaction.url || interaction.link;
    if (url) window.open(url, interaction.target === "popup" ? "interaction-popup" : (interaction.target ?? "_blank"), interaction.target === "popup" ? "popup=yes,width=800,height=600" : undefined);
  };
  const iconSize = interaction.interactionKind === "link-area" ? 26 : 18;

  return <><CanvasDragDrop id={id} rect={{ x: interaction.x, y: interaction.y, width: interaction.width, height: interaction.height, rotation: interaction.rotation ?? 0 }} isSelected={isSelected} imageExportMode={imageExportMode} clipBounds={clipBounds} onContextMenu={handleContextMenu} onSelect={select} onElementClick={activate} onChange={(rect) => updateElement(id, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, rotation: rect.rotation }, { history: true })}>
    <div title={interaction.tooltip} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: interaction.textAlign === "left" ? "flex-start" : interaction.textAlign === "right" ? "flex-end" : "center", padding: "0 16px", boxSizing: "border-box", background: interaction.backgroundColor ?? "transparent", borderRadius: interaction.borderRadius ?? 0, opacity: interaction.opacity ?? 1, cursor: imageExportMode ? "pointer" : "move" }}>
      <span aria-hidden="true" style={{ color: interaction.iconColor ?? interaction.textColor ?? "#fff", width: iconSize, height: iconSize, flexShrink: 0, display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: interaction.svg }} />
      {interaction.interactionKind === "caption" && captionExpanded && <span style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", padding: 10, borderRadius: interaction.borderRadius ?? 8, background: interaction.backgroundColor ?? "#4f46e5", color: interaction.textColor ?? "#fff", whiteSpace: "normal", zIndex: 20 }}>{interaction.expandedText || interaction.text}</span>}
    </div>
  </CanvasDragDrop><ElementContextMenu position={isSelected ? contextMenuPos : null} elementId={id} onClose={closeContextMenu} /></>;
});

RenderInteraction.displayName = "RenderInteraction";
export default RenderInteraction;
