"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import CanvasBgBar from "./EditToolBar/CanvasSetting/CanvasBgBar";
import FontFamilyPanel from "./EditToolBar/TextEdit/FontFamilyPanel";
import ItemPostionPanel from "./EditToolBar/Coman/ItemPostionPanel";
import TextBgColorPanel from "./EditToolBar/TextEdit/TextBgColorPanel";
import ImageCrop from "./EditToolBar/ImageEdit/ImageCropePanel";
import ImageEffectsPanel from "./EditToolBar/ImageEdit/ImageEffectsPanel";
import ImageStrokeColorPanel from "./EditToolBar/ImageEdit/ImageStrokeColorPanel";
import AskAiPanel from "./EditToolBar/CanvasSetting/AskAiPanel";
import ShapeBgColorPanel from "./EditToolBar/shapeEdit/ShapeBgColorPanel";
import BtnBorderColor from "./EditToolBar/ButtonEdit/BtnBorderColor";
import BtnMoreSetting from "./EditToolBar/ButtonEdit/BtnMoreSetting";
import ButtonEditBGColor from "./EditToolBar/ButtonEdit/ButtonEditBGColor";
import VideoReplacePanel from "../AssetsPanel/AddSection/VideoReplace/VideoReplacePanel";
import ImageReplacePanel from "../AssetsPanel/AddSection/imageReplace/ImageReplacePanel";
import TextColorPanel from "./EditToolBar/TextEdit/TextColorPanel";

// EDIT PANEL KEYS
const EDIT_PANEL_KEYS = [
  "TextColorPanel", "CanvasBgBar", "FontFamilyPanel", "ItemPositionPanel", "TextBgColorPanel", "ImageCrop", "ImageEffectsPanel"
  , "ImageStrokeColorPanel", "AskAiPanel", "BtnMoreSetting",
  "ShapeBkgColorPanel", "BtnBorderColor", "ButtonEditBGColor", "VideoReplacePanel", "imageReplacePanel"];
const EDIT_PANEL_TITLES: Record<string, string> = {
  TextColorPanel: "Text Color",
  TextBgColorPanel: "Text Background",
  CanvasBgBar: "Canvas Background",
  FontFamilyPanel: "Font Family",
  ItemPositionPanel: "Position",

  ImageCrop: "Crop Image",
  ImageEffectsPanel: "Image Effects",
  ImageStrokeColorPanel: "Stroke Color",
  AskAiPanel: "Ask AI",

  // Button
  BtnMoreSetting: "Button Settings",
  BtnBorderColor: "Button Border Color",
  ButtonEditBGColor: "Button Background",

  // Shape
  ShapeBkgColorPanel: "Shape Background",

  // Media
  VideoReplacePanel: "Replace Video",
  imageReplacePanel: "Replace Image",
};

const EditToolPanel: React.FC = () => {
  const active = useEditorStore((s) => s.activeRightPanel);
  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
  const panelRef = useRef<HTMLDivElement>(null);
  const setActivePanelType = useEditorUIStore((s) => s.setActivePanelType);
  const lastMainPanel = useEditorUIStore((s) => s.lastMainPanel);
  const setLastMainPanel = useEditorUIStore((s) => s.setLastMainPanel);
  const isEditPanel = active && EDIT_PANEL_KEYS.includes(active);
  const setSidebarWidth = useEditorUIStore((s) => s.setSidebarWidth);
  const closeEditPanel = useCallback(() => {
    if (lastMainPanel) {
      setActiveRightPanel(lastMainPanel);
      setActivePanelType("main");
      setSidebarWidth("main");
    } else {
      setActiveRightPanel("");
      setActivePanelType(null);
      // setSidebarWidth("closed");
    }
    setLastMainPanel(null);
  }, [lastMainPanel, setActiveRightPanel, setActivePanelType,
    setSidebarWidth, setLastMainPanel]);

  useEffect(() => {
    if (!isEditPanel) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeEditPanel();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditPanel, closeEditPanel]);





  if (!isEditPanel) return null;
  return (
    <div
      ref={panelRef}
      className="relative kd-toolPanel-container h-full flex flex-col"
    >

      <div className=" flex items-center justify-between px-4 py-2">
        <h2 className="kd-toolPanel-heding-text">
          {EDIT_PANEL_TITLES[active] ?? ""}
        </h2>
        <button
          type="button"
          onClick={closeEditPanel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="kd-toolPanel-hr-devide-border mb-1 mx-2" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {active === "CanvasBgBar" && <CanvasBgBar />}
        {active === "FontFamilyPanel" && <FontFamilyPanel />}
        {active === "ItemPositionPanel" && <ItemPostionPanel />}
        {active === "ImageCrop" && <ImageCrop />}
        {active === "ImageEffectsPanel" && <ImageEffectsPanel />}
        {active === "ImageStrokeColorPanel" && <ImageStrokeColorPanel />}
        {active === "AskAiPanel" && <AskAiPanel />}
        {active === "BtnMoreSetting" && <BtnMoreSetting />}
        {active === "ShapeBkgColorPanel" && <ShapeBgColorPanel />}
        {active === "VideoReplacePanel" && <VideoReplacePanel />}
        {active === "imageReplacePanel" && <ImageReplacePanel />}
        {active === "BtnBorderColor" && <BtnBorderColor />}
        {active === "ButtonEditBGColor" && <ButtonEditBGColor />}
        {active === "TextColorPanel" && <TextColorPanel />}
        {active === "TextBgColorPanel" && <TextBgColorPanel />}
      </div>
    </div>
  );
};

export default EditToolPanel;