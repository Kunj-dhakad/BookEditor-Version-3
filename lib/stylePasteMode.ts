import type { ElementData } from "@/app/Store/editorStore";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { styleClipboard } from "@/lib/styleClipboard";

export const beginStylePaste = (element: ElementData) => {
  styleClipboard.copyFromElement(element);
  const ui = useEditorUIStore.getState();
  ui.setCopiedStyleSourceType(element.type);
  ui.setStylePasteSourceSlide(useEditorStore.getState().activeSlide);
  ui.setIsCopyStyleMode(true);
};

export const cancelStylePaste = () => {
  const ui = useEditorUIStore.getState();
  ui.setIsCopyStyleMode(false);
  ui.setCopiedStyleSourceType(null);
  ui.setStylePasteSourceSlide(null);
};
