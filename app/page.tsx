"use client";
import React, { useEffect, useRef } from "react";
import useEditorStore, { TextData } from "@/app/Store/editorStore";
import Header from "@/components/HomeLayout/header/header";
import MainCanvas from "@/components/HomeLayout/EditorCanvas/main";
import useProjectInfoStore from "./Store/projectInfoStore";
import { THEMES } from "@/lib/themes/themes";
import { applyTheme } from "@/lib/themes/applyTheme";
import ToolPanel from "@/components/HomeLayout/AssetsPanel/ToolPanel";
import Preview from "@/components/HomeLayout/Preview/preview";
import TextFormattingToolbar from "@/components/blocks/Text/toolbar/TextFormattingToolbar";
import IndexFormattingToolbar from "@/components/blocks/Index/toolbar/IndexFormattingToolbar";
import useEditorUIStore from "./Store/useEditorUIStore";
import ImageEditPanel from "@/components/blocks/Image/toolbar/ImageEditPanel";
import EditorFooter from "@/components/HomeLayout/EditorCanvas/Footer/EditorFooter";
import CanvasHeaderBar from "@/components/HomeLayout/EditorCanvas/Header/CanvasHeaderBar";
import ButtonEditTopBar from "@/components/blocks/Button/toolbar/ButtonEditTopBar";
import ShapeEditTopBar from "@/components/blocks/Shape/toolbar/ShapeEdit/ShapeEditTopBar";
import VideoEditTopBar from "@/components/blocks/Video/toolbar/VideoEditTopBar";
import Navbar from "@/components/HomeLayout/NavigationPanel/Navbar";
import { LayersPanel } from "@/components/HomeLayout/Preview/Layers/LayersPanel";
import { KdPreviewLayerbtn, KdPreviewPagebtn } from "@/lib/icon/icons";
import SvgElementsEditPanel from "@/components/blocks/Sticker/toolbar/SvgElementsEditPanel";
import EditToolPanel from "@/components/HomeLayout/EditBarPanel/EditToolPanel";
import StylePasteModeOverlay from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/StylePasteModeOverlay";
import TableToolbar from "@/components/blocks/Table/toolbar/TableToolbar";
import ChartToolbar from "@/components/blocks/Chart/toolbar/ChartToolbar";
import InteractionEditTopBar from "@/components/blocks/Interaction/toolbar/InteractionEditTopBar";

export default function Home() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const selectedElementIds = useEditorStore((s) => s.selectedElementIds);
  const selectedElementCount = selectedElementIds.length;
  const activePanelType = useEditorUIStore((s) => s.activePanelType);
  const setMainCanvasScale = useEditorUIStore((s) => s.setMainCanvasScale);
  const addSlide = useEditorStore((s) => s.addSlide);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const setAll = useProjectInfoStore.getState().setAll;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previewpanelOpen = useEditorUIStore((s) => s.previewpanelOpen);
  const [PreviewTab, setPreviewTab] = React.useState<"pages" | "layers">(
    "pages",
  );
  const sidebarWidth = useEditorUIStore((s) => s.sidebarWidth);
  const editOpenedFromHidden = useEditorUIStore((s) => s.editOpenedFromHidden);
  const activeRightPanel = useEditorStore((s) => s.activeRightPanel);

  const currentSlideElements = slides[activeSlide]?.elements ?? [];
  const selectedElements = currentSlideElements.filter((el) =>
    selectedElementIds.includes(el.id),
  );
  const selectedTypes = new Set(selectedElements.map((el) => el.data.type));
  const isSameTypeSelection =
    selectedElementCount > 1 && selectedTypes.size === 1;
  const activeElement =
    selectedElementCount <= 1
      ? currentSlideElements.find((el) => el.id === activeElementId)
      : isSameTypeSelection
        ? (currentSlideElements.find((el) => el.id === activeElementId) ??
          selectedElements[0])
        : null;
  async function loadTemplate(url: string) {
    try {
      const res = await fetch(url);
      let json = await res.json();

      if (typeof json === "string") {
        try {
          json = JSON.parse(json);
        } catch (e) {
          console.error("Inner JSON parse failed", e);
        }
      }

      const modern = json;

      if (!modern?.slides) {
        console.error("Invalid template structure", json);
        return;
      }
      console.log("Template loaded successfully:", modern.slides);
      useEditorStore.getState().applyFullTemplate(modern.slides);
    } catch (err) {
      console.error("Error loading template:", err);
    }
  }

  useEffect(() => {
    useEditorStore.persist.rehydrate();

    setMainCanvasScale(window.innerWidth >= 1920 ? 1.5 : 1);

    parent.postMessage({ type: "REACT_READY" }, "*");
  }, [setMainCanvasScale]);

  useEffect(() => {
    async function handleMessage(e: MessageEvent) {
      if (e.data.type === "LOAD_TEMPLATE") {
        await loadTemplate(e.data.templateUrl);
      }

      if (e.data.type === "INIT_DATA") {
        setAll({
          id: e.data.id,
          name: e.data.name,
          token: e.data.token,
          projectName: e.data.projectID,
          api_url: e.data.URL,
        });

        const theme = THEMES[e.data.projectID];

        if (theme) {
          applyTheme(theme);
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setAll]);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <StylePasteModeOverlay />

      {/* Top Header */}
      <div className="w-full h-[6.5%] shrink-0">
        <Header />
      </div>

      {/* Main Layout */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[5%] shrink-0 h-full">
          <Navbar />
        </div>

        {/* Tool Panel */}

        <div
          className={`transition-all duration-300 h-full shrink-0 ${
            sidebarWidth === "closed" ||
            (activePanelType === "edit" && editOpenedFromHidden)
              ? "w-0"
              : "w-[21.75%]"
          }`}
        >
          {activePanelType === "main" && <ToolPanel />}
          {activePanelType === "edit" && !editOpenedFromHidden && (
            <EditToolPanel key={activeRightPanel} />
          )}
        </div>

        {activePanelType === "edit" && editOpenedFromHidden && (
          <aside className="absolute left-[5%] top-0 bottom-0 z-40 w-[21.75%] border-r border-slate-200 bg-white shadow-xl">
            <EditToolPanel key={activeRightPanel} />
          </aside>
        )}

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
              <div className="h-[8%] shrink-0 flex items-center justify-center">
                {!activeElement && <CanvasHeaderBar />}
                {activeElement?.data?.type === "text" &&
                  ((activeElement.data as TextData).bookRole === "index" ? (
                    <IndexFormattingToolbar />
                  ) : (
                    <TextFormattingToolbar />
                  ))}
                {activeElement?.data?.type === "image" && (
                  <ImageEditPanel target={containerRef.current} />
                )}
                {activeElement?.data?.type === "button" && (
                  <ButtonEditTopBar target={containerRef.current} />
                )}
                {activeElement?.data?.type === "interaction" && (
                  <InteractionEditTopBar />
                )}
                {activeElement?.data?.type === "shape" && (
                  <ShapeEditTopBar target={containerRef.current} />
                )}
                {activeElement?.data?.type === "svg" && (
                  <SvgElementsEditPanel target={containerRef.current} />
                )}
                {activeElement?.data?.type === "video" && (
                  <VideoEditTopBar target={containerRef.current} />
                )}
                {activeElement?.data?.type === "table" && <TableToolbar />}
                {activeElement?.data?.type === "chart" && <ChartToolbar />}
              </div>

              <div className="flex-1 min-h-0 min-w-0 overflow-hidden flex items-center justify-center">
                <MainCanvas containerRef={containerRef} />
              </div>
            </div>

            {previewpanelOpen && (
              <div className=" shrink-0 kd-preview-section-container w-[172px] h-full  flex flex-col">
                <div className="flex items-center kd-preview-section-tap-btn-container justify-center mx-2 mt-2 overflow-hidden">
                  <button
                    onClick={() => {
                      setPreviewTab("pages");
                    }}
                    className={`flex items-center justify-center  gap-0.5 w-full h-full 
                                            cursor-pointer transition-all duration-300 
                                            font-medium text-xs ${
                                              PreviewTab === "pages"
                                                ? "kd-preview-section-tab-btn-active"
                                                : "kd-preview-section-tab-btn"
                                            }`}
                  >
                    <KdPreviewPagebtn />

                    <span className="truncate">Pages</span>
                  </button>
                  <button
                    onClick={() => {
                      setPreviewTab("layers");
                    }}
                    className={`flex items-center justify-center gap-0.5 w-full h-full 
                                            cursor-pointer transition-all duration-300
                                             font-medium text-xs ${
                                               PreviewTab === "layers"
                                                 ? "kd-preview-section-tab-btn-active"
                                                 : "kd-preview-section-tab-btn"
                                             }`}
                  >
                    <KdPreviewLayerbtn />
                    <span className="truncate">Layers</span>
                  </button>
                </div>

                <div className="flex flex-col items-center mt-2 gap-1 flex-1 min-h-0 overflow-hidden w-full">
                  {PreviewTab === "pages" && (
                    <Preview
                      activeSlide={activeSlide}
                      addSlide={addSlide}
                      jumpToSlide={(i) => {
                        setActiveSlide(i);
                        const container = containerRef.current;
                        if (!container) return;
                        const allSlides =
                          container.querySelectorAll(".kd-slide-scroll");
                        const targetSlide = allSlides[i] as HTMLElement;

                        if (targetSlide) {
                          const containerTop =
                            container.getBoundingClientRect().top;
                          const slideTop =
                            targetSlide.getBoundingClientRect().top;
                          const scrollOffset =
                            container.scrollTop + (slideTop - containerTop);
                          container.scrollTo({
                            top: scrollOffset,
                            behavior: "smooth",
                          });
                        }
                      }}
                    />
                  )}
                  {PreviewTab === "layers" && <LayersPanel />}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="h-[6%] shrink-0">
            <EditorFooter
              totalSlides={slides.length}
              currentSlide={activeSlide + 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
