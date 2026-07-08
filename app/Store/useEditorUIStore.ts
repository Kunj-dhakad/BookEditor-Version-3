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

  lastMainPanel: string | null;
  setLastMainPanel: (v: string | null) => void;


  cropElementId: string | null;
  setCropElementId: (id: string | null) => void;

  bgRemovingElementId: string | null;
  setBgRemovingElementId: (id: string | null) => void;

  sidebarWidth: "main" | "edit" | "closed";
  setSidebarWidth: (v: "main" | "edit" | "closed") => void;

};

const useEditorUIStore = create<EditorUIStore>((set) => ({
  pendingTextColor: null,
  setPendingTextColor: (color) => set({ pendingTextColor: color }),

  savedTextRange: null,
  setSavedTextRange: (range) => set({ savedTextRange: range }),

  previewpanelOpen: true,
  setPreviewPanelOpen: (v) => set({ previewpanelOpen: v }),

  // MainCanvasScale: 1,
  MainCanvasScale: typeof window !== "undefined" && window.innerWidth >= 1920 ? 1.5 : 1,
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
  setActivePanelType: (v) => set({ activePanelType: v }),

  lastMainPanel: null,
  setLastMainPanel: (v) => set({ lastMainPanel: v }),

  // body:
  cropElementId: null,
  setCropElementId: (id) => set({ cropElementId: id }),

  bgRemovingElementId: null,
  setBgRemovingElementId: (id) => set({ bgRemovingElementId: id }),

  sidebarWidth: "closed",
  setSidebarWidth: (v) => set({ sidebarWidth: v }),

}));

export default useEditorUIStore;
