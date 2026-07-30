"use client";
import { create } from "zustand";

type EditorUIStore = {

  imageExportMode: boolean;
  setImageExportMode: (v: boolean) => void;

  slideUpdateAi: boolean;
  setSlideUpdateAi: (v: boolean) => void;

  SiteBarCollapsed: boolean;
  setSiteBarCollapsed: (v: boolean) => void;

  activeTextRef: HTMLElement | null;
  setActiveTextRef: (el: HTMLElement | null) => void;

  MainCanvasScale: number;
  setMainCanvasScale: (v: number) => void;

  previewpanelOpen: boolean;
  setPreviewPanelOpen: (v: boolean) => void;

  pendingTextColor: string | null;
  setPendingTextColor: (color: string | null) => void;

  savedTextRange: Range | null;
  setSavedTextRange: (range: Range | null) => void;



  activePanelType: "main" | "edit" | null;
  setActivePanelType: (v: "main" | "edit" | null) => void;
  editOpenedFromHidden: boolean;

  lastMainPanel: string | null;
  setLastMainPanel: (v: string | null) => void;

  activeElementsCategory: string | null;
  setActiveElementsCategory: (v: string | null) => void;


  cropElementId: string | null;
  setCropElementId: (id: string | null) => void;

  bgRemovingElementId: string | null;
  setBgRemovingElementId: (id: string | null) => void;

  sidebarWidth: "main" | "edit" | "closed";
  setSidebarWidth: (v: "main" | "edit" | "closed") => void;

  // Copy Style Mode state
  isCopyStyleMode: boolean;
  setIsCopyStyleMode: (v: boolean) => void;

  copiedStyleSourceType: string | null;
  setCopiedStyleSourceType: (type: string | null) => void;

  stylePasteSourceSlide: number | null;
  setStylePasteSourceSlide: (index: number | null) => void;

};

const useEditorUIStore = create<EditorUIStore>((set, get) => ({
  pendingTextColor: null,
  setPendingTextColor: (color) => set({ pendingTextColor: color }),

  savedTextRange: null,
  setSavedTextRange: (range) => set({ savedTextRange: range }),

  previewpanelOpen: true,
  setPreviewPanelOpen: (v) => set({ previewpanelOpen: v }),

  MainCanvasScale: 1,
  setMainCanvasScale: (v) => set({ MainCanvasScale: v }),

  imageExportMode: false,
  setImageExportMode: (v) => set({ imageExportMode: v }),

  slideUpdateAi: false,
  setSlideUpdateAi: (v) => set({ slideUpdateAi: v }),

  SiteBarCollapsed: true,
  setSiteBarCollapsed: (v) => set({ SiteBarCollapsed: v }),

  activeTextRef: null,
  setActiveTextRef: (el) => set({ activeTextRef: el }),

  // NEW
  activePanelType: null,
  editOpenedFromHidden: false,
  setActivePanelType: (v) => set({
    activePanelType: v,
    editOpenedFromHidden: v === "edit" ? get().SiteBarCollapsed : false,
  }),

  lastMainPanel: null,
  setLastMainPanel: (v) => set({ lastMainPanel: v }),

  activeElementsCategory: null,
  setActiveElementsCategory: (v) => set({ activeElementsCategory: v }),

  // body:
  cropElementId: null,
  setCropElementId: (id) => set({ cropElementId: id }),

  bgRemovingElementId: null,
  setBgRemovingElementId: (id) => set({ bgRemovingElementId: id }),

  sidebarWidth: "closed",
  setSidebarWidth: (v) => set({ sidebarWidth: v }),

  // Copy Style Mode
  isCopyStyleMode: false,
  setIsCopyStyleMode: (v) => set({ isCopyStyleMode: v }),

  copiedStyleSourceType: null,
  setCopiedStyleSourceType: (type) => set({ copiedStyleSourceType: type }),

  stylePasteSourceSlide: null,
  setStylePasteSourceSlide: (index) => set({ stylePasteSourceSlide: index }),

}));

export default useEditorUIStore;
