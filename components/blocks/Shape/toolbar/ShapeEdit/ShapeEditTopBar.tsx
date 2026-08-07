"use client";
import React, { useEffect, useRef, useState } from "react";
import useEditorStore, { ShapeData } from "@/app/Store/editorStore";
import LinkEditBox from "./EditPopup/linkEditBox";
import ImageEditSetting from "./ShapeEditSetting";
import {
  KdEditToolBorderIcon,
  KdFlipIcon, KdGradBgIcon, KdLinkAddIcon,
  KdStrokeIcon,
} from "@/lib/icon/icons";
import { MdBlurOn } from "react-icons/md";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import ImageTransformPanel from "./EditPopup/ImageTransformPanel";
import FlipPanel from "./EditPopup/FlipPanel";
import ImageStrokePanel from "./EditPopup/ImageStrokePanel";
import OpacityPanel from "./EditPopup/OpacityPanel";
import BorderRadiusPanel from "./EditPopup/BorderRadiusPanel";

interface ToolbarProps {
  target: HTMLElement | null;
}

type ActivePopup =
  | "none" | "Editsetting" | "link" | "transform"
  | "Flip" | "stroke" | "Opacity" | "borderRadius";

const iconBtn = "kd-tool-btn kd-icon-btn-main p-1.5 rounded-md";

const ShapeEditTopBar: React.FC<ToolbarProps> = ({ target }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
  const [activePopup, setActivePopup] = useState<ActivePopup>("none");

  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const LinkBtnRef = useRef<HTMLButtonElement | null>(null);
  const strokeBtnRef = useRef<HTMLButtonElement | null>(null);
  const flipBtnRef = useRef<HTMLButtonElement | null>(null);
  const transformBtnRef = useRef<HTMLButtonElement | null>(null);
  const opacityBtnRef = useRef<HTMLButtonElement | null>(null);
  const borderRadiusBtnRef = useRef<HTMLButtonElement | null>(null);
  const strokeColorBtnRef = useRef<HTMLButtonElement | null>(null);
  const alignBtnRef = useRef<HTMLButtonElement | null>(null);

  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);

  const element = slides[activeSlide]?.elements.find(
    (el) => el.id === activeElementId
  );

  // ✅ EditableElementData — panels ke saath exactly match karta hai
  const Shapeupdate = (patch: Partial<ShapeData>) => {
    if (!element || element.data.type !== "shape") return;
    updateElement(element.id, patch);
  };

  useEffect(() => {
    if (!target) return;
    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      const top = rect.top > 70 ? rect.top - 60 : rect.bottom + 10;
      setPos({ top, left: rect.left + rect.width / 2, visible: true });
    };
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [target]);

  // ✅ Type guard — shape confirm karo, toh hi render karo
  if (!pos.visible || !element || element.data.type !== "shape") return null;

  // ✅ Safe cast — type guard ke baad ShapeData guarantee hai
  const data = element.data as ShapeData;

  const openRightPanel = (panelName: string) => {
    const currentActive = useEditorStore.getState().activeRightPanel;
    const currentType = useEditorUIStore.getState().activePanelType;
    if (currentType === "main" && currentActive)
      useEditorUIStore.getState().setLastMainPanel(currentActive);
    setActiveRightPanel(panelName);
    useEditorUIStore.getState().setActivePanelType("edit");
    if (useEditorUIStore.getState().sidebarWidth === "closed") {
      useEditorUIStore.getState().setSidebarWidth("edit");
    }
  };

  return (
    <div
      data-element="true"
      data-copy-style-toolbar="true"
      className="kd-canvasheader-container h-10 mt-4 flex items-center justify-between px-1 py-1 rounded-lg"
    >
      <div className="flex items-center gap-1">



        {/*Stroke border color */}
        <button
          ref={alignBtnRef}
          // className="kd-tooltip-parent kd-icon-btn-main"
          className={` kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseDown={(e) => {
            e.preventDefault();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target && target.contains(sel.anchorNode)) {
              useEditorUIStore.getState().setSavedTextRange(sel.getRangeAt(0).cloneRange());
            } else {
              useEditorUIStore.getState().setSavedTextRange(null);
            }
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) useEditorUIStore.getState().setLastMainPanel(currentActive);
            setActiveRightPanel("ShapeBkgColorPanel");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}
          onMouseEnter={() => setShowTooltip("BackgroundColor")}
          onMouseLeave={() => setShowTooltip(null)}

        >
          <KdGradBgIcon />
          {showTooltip === "BackgroundColor" && <span className="kd-tooltip-bottom">Background Color</span>}
        </button>





        {/* Stroke Color → Right Panel */}
        <button
          ref={strokeColorBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseDown={(e) => { e.preventDefault(); openRightPanel("ImageStrokeColorPanel"); }}
          onMouseEnter={() => setShowTooltip("StrokeColor")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          {/* <KdGradBgIcon /> */}
          <KdEditToolBorderIcon />
          {showTooltip === "StrokeColor" && <span className="kd-tooltip-bottom">Stroke Color</span>}
        </button>

        {/* Stroke Panel */}
        <button
          ref={strokeBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "stroke" ? "none" : "stroke")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("Stroke")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <KdStrokeIcon />
          {showTooltip === "Stroke" && <span className="kd-tooltip-bottom">Stroke & Border</span>}
        </button>

        {/* Border Radius */}
        {/* <button
          ref={borderRadiusBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "borderRadius" ? "none" : "borderRadius")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("BorderRadius")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <KdRadiusIcon />
          {showTooltip === "BorderRadius" && <span className="kd-tooltip-bottom">Border Radius</span>}
        </button> */}

        {/* Transform */}
        {/* <button
          ref={transformBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "transform" ? "none" : "transform")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("Transform")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <KdUndoIcon />
          {showTooltip === "Transform" && <span className="kd-tooltip-bottom">Transform</span>}
        </button> */}

        {/* Flip */}
        <button
          ref={flipBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "Flip" ? "none" : "Flip")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("Flip")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <KdFlipIcon />
          {showTooltip === "Flip" && <span className="kd-tooltip-bottom">Flip</span>}
        </button>

        {/* Opacity */}
        <button
          ref={opacityBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "Opacity" ? "none" : "Opacity")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("Opacity")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <MdBlurOn />
          {showTooltip === "Opacity" && <span className="kd-tooltip-bottom">Opacity</span>}
        </button>

        {/* Link */}
        <button
          ref={LinkBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onClick={() => { setActivePopup((p) => (p === "link" ? "none" : "link")); setShowTooltip(null); }}
          onMouseEnter={() => setShowTooltip("Link")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <KdLinkAddIcon />
          {showTooltip === "Link" && <span className="kd-tooltip-bottom">Link</span>}
        </button>

        {/* Position → Right Panel */}
        <button
          ref={alignBtnRef}
          className="kd-tooltip-parent kd-canvasheader-button-all px-3 py-1 rounded-md text-sm cursor-pointer transition-all duration-200"
          onMouseDown={(e) => { e.preventDefault(); openRightPanel("ItemPositionPanel"); }}
          onMouseEnter={() => setShowTooltip("Align")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          position
          {showTooltip === "Align" && <span className="kd-tooltip-bottom">Alignment</span>}
        </button>

      </div>

      {/* ===== POPUPS — sab properly typed, zero any ===== */}
      {activePopup === "link" && (
        <LinkEditBox
          targetRef={LinkBtnRef}
          data={data}
          updateButton={Shapeupdate}
          onClose={() => setActivePopup("none")}
        />
      )}
      {activePopup === "transform" && (
        <ImageTransformPanel
          targetRef={transformBtnRef}
          onClose={() => setActivePopup("none")}
          data={data}
          updateButton={Shapeupdate}
        />
      )}
      {activePopup === "Flip" && (
        <FlipPanel
          targetRef={flipBtnRef}
          onClose={() => setActivePopup("none")}
          data={data}
          updateButton={Shapeupdate}
        />
      )}
      {activePopup === "stroke" && (
        <ImageStrokePanel
          targetRef={strokeBtnRef}
          onClose={() => setActivePopup("none")}
          data={data}
          updateButton={Shapeupdate}
        />
      )}
      {activePopup === "Opacity" && (
        <OpacityPanel
          targetRef={opacityBtnRef}
          onClose={() => setActivePopup("none")}
          data={data}
          updateButton={Shapeupdate}
        />
      )}
      {activePopup === "borderRadius" && (
        <BorderRadiusPanel
          targetRef={borderRadiusBtnRef}
          onClose={() => setActivePopup("none")}
          data={data}
          updateButton={Shapeupdate}
        />
      )}
      {activePopup === "Editsetting" && (
        <ImageEditSetting targetRef={moreBtnRef} />
      )}
    </div>
  );
};

export default ShapeEditTopBar;
