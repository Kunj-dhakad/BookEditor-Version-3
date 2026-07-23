"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import useEditorStore from "@/app/Store/editorStore";
import AddTextPanel from "@/components/blocks/Text/components/AddTextPanel";
import AddImagePanel from "@/components/blocks/Image/components/AddImagePanel";
import SubtitleSlideEditor from "./AddSection/subtitleEditToolbar";
import AddButtonPanel from "@/components/blocks/Button/components/AddButtonPanel";
import AddElementPanel from "./AddSection/Elements";
// import AiSlideUpdate from "../../AiSlideUpdate";
import AddVideoPanel from "@/components/blocks/Video/components/AddVideoPanel";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import TemplateAddPanel from "./Template/TemplateAddPanel";
import WatermarkPanel from "@/components/blocks/Watermark/components";
import InteractionPanel from "@/components/interactions/InteractionPanel";

const MAIN_PANEL_KEYS = [
  "text", "image", "template", "PexelImage", "Elements",
  "AiImage", "UploadImage", "SubtitleTool", "imageReplacePanel",
  "AddButtonPanel", "AddElementPanel", "AiSlideUpdate",
  "AddVideoPanel", "VideoReplacePanel", "TemplateAddPanel", "WatermarkPanel", "AddInteractionsPanel"
];

const ToolPanel: React.FC<{ panel?: string | null }> = ({ panel }) => {
  const storeActive = useEditorStore((s) => s.activeRightPanel);
  const active = panel ?? storeActive;
  const setSiteBarCollapsed = useEditorUIStore((s) => s.setSiteBarCollapsed);
  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
  const setActivePanelType = useEditorUIStore((s) => s.setActivePanelType);
  const setLastMainPanel = useEditorUIStore((s) => s.setLastMainPanel);
  const isMainPanel = active && MAIN_PANEL_KEYS.includes(active);
  const setSidebarWidth = useEditorUIStore((s) => s.setSidebarWidth);

  if (!isMainPanel) return null;
  return (
    <div className="kd-Assets-Panel-wrapper relative h-full flex flex-col">
      <button
        type="button"
        onClick={() => {
          setSiteBarCollapsed(true);
          setSidebarWidth("closed");  
          setActiveRightPanel("");
          setActivePanelType(null);
          setLastMainPanel(null);
        }}
        style={{
          position: "absolute",
          top: "50%",
          right: "-20px",
          transform: "translateY(-50%)",
          zIndex: 50,
          width: "20px",
          height: "56px",
          borderRadius: "0 10px 10px 0",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderLeft: "none",
          boxShadow: "3px 0 8px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#64748b",
          fontSize: "12px",
          padding: 0,
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      <div className="flex-1 h-full">
        {active === "text" && <AddTextPanel />}
        {active === "image" && <AddImagePanel />}
        {active === "SubtitleTool" && <SubtitleSlideEditor />}
        {active === "AddButtonPanel" && <AddButtonPanel />}
        {active === "AddElementPanel" && <AddElementPanel />}
        {/* {active === "AiSlideUpdate" && <AiSlideUpdate />} */}
        {active === "AddVideoPanel" && <AddVideoPanel />}
        {active === "TemplateAddPanel" && <TemplateAddPanel />}
        {active === "WatermarkPanel" && <WatermarkPanel />}
        {active === "AddInteractionsPanel" && <InteractionPanel />}
      </div>
    </div>
  );
};

export default ToolPanel;
