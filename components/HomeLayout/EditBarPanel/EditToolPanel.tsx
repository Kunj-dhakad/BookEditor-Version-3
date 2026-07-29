// "use client";
// import React, { useCallback, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import useEditorStore from "@/app/Store/editorStore";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
// import CanvasBgBar from "./EditToolBar/CanvasSetting/CanvasBgBar";
// import FontFamilyPanel from "@/components/blocks/Text/sidebar/FontFamilyPanel";
// import ItemPostionPanel from "./EditToolBar/Coman/ItemPostionPanel";
// import TextBgColorPanel from "@/components/blocks/Text/sidebar/TextBgColorPanel";
// import ImageCrop from "@/components/blocks/Image/sidebar/panels/ImageCropePanel";
// import ImageEffectsPanel from "@/components/blocks/Image/sidebar/panels/ImageEffectsPanel";
// import ImageStrokeColorPanel from "@/components/blocks/Image/sidebar/panels/ImageStrokeColorPanel";
// import AskAiPanel from "./EditToolBar/CanvasSetting/AskAiPanel";
// import ShapeBgColorPanel from "@/components/blocks/Shape/sidebar/ShapeBgColorPanel";
// import BtnBorderColor from "@/components/blocks/Button/sidebar/BtnBorderColor";
// import BtnMoreSetting from "@/components/blocks/Button/sidebar/BtnMoreSetting";
// import ButtonEditBGColor from "@/components/blocks/Button/sidebar/ButtonEditBGColor";
// import VideoReplacePanel from "@/components/blocks/Video/sidebar/VideoReplacePanel";
// import ImageReplacePanel from "@/components/blocks/Image/sidebar/ImageReplacePanel";
// import TextColorPanel from "@/components/blocks/Text/sidebar/TextColorPanel";
// import TableSettings from "@/components/blocks/Table/sidebar/TableSettings";
// import ChartSettings from "@/components/blocks/Chart/sidebar/ChartSettings";

// // EDIT PANEL KEYS
// const EDIT_PANEL_KEYS = [
//   "TextColorPanel", "CanvasBgBar", "FontFamilyPanel", "ItemPositionPanel", "TextBgColorPanel", "ImageCrop", "ImageEffectsPanel"
//   , "ImageStrokeColorPanel", "AskAiPanel", "BtnMoreSetting",
//   "ShapeBkgColorPanel", "BtnBorderColor", "ButtonEditBGColor", "VideoReplacePanel", "imageReplacePanel", "TableSettings", "ChartSettings"];
// const EDIT_PANEL_TITLES: Record<string, string> = {
//   TextColorPanel: "Text Color",
//   TextBgColorPanel: "Text Background",
//   CanvasBgBar: "Canvas Background",
//   FontFamilyPanel: "Font Family",
//   ItemPositionPanel: "Position",

//   ImageCrop: "Crop Image",
//   ImageEffectsPanel: "Image Effects",
//   ImageStrokeColorPanel: "Stroke Color",
//   AskAiPanel: "Ask AI",

//   // Button
//   BtnMoreSetting: "Button Settings",
//   BtnBorderColor: "Button Border Color",
//   ButtonEditBGColor: "Button Background",

//   // Shape
//   ShapeBkgColorPanel: "Shape Background",

//   // Media
//   VideoReplacePanel: "Replace Video",
//   imageReplacePanel: "Replace Image",
//   TableSettings: "Table Settings",
//   ChartSettings: "Chart Settings",
// };

// const PANEL_TYPES: Record<string, string[]> = {
//   TextColorPanel: ["text"],
//   TextBgColorPanel: ["text"],
//   FontFamilyPanel: ["text"],
//   ImageCrop: ["image"],
//   ImageEffectsPanel: ["image", "video"],
//   ImageStrokeColorPanel: ["image", "shape", "svg", "video"],
//   imageReplacePanel: ["image"],
//   VideoReplacePanel: ["video"],
//   BtnMoreSetting: ["button"],
//   BtnBorderColor: ["button"],
//   ButtonEditBGColor: ["button"],
//   ShapeBkgColorPanel: ["shape"],
//   ItemPositionPanel: ["text", "image", "shape", "svg", "button", "video", "watermark", "table"],
//   TableSettings: ["table"],
//   ChartSettings: ["chart"],
// };

// const CANVAS_LEVEL_PANELS = ["CanvasBgBar", "AskAiPanel"];
// const EditToolPanel: React.FC = () => {
//   const active = useEditorStore((s) => s.activeRightPanel);
//   const slides = useEditorStore((s) => s.slides);
//   const activeSlide = useEditorStore((s) => s.activeSlide);
//   const selectedElementIds = useEditorStore((s) => s.selectedElementIds);
//   const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
//   const setActivePanelType = useEditorUIStore((s) => s.setActivePanelType);
//   const isEditPanel = active && EDIT_PANEL_KEYS.includes(active);
//   const selectedElements = (slides[activeSlide]?.elements ?? []).filter((el) => selectedElementIds.includes(el.id));
//   const selectedTypes = Array.from(new Set(selectedElements.map((el) => el.data.type)));
//   const isMixedSelection = selectedElementIds.length > 1 && selectedTypes.length > 1;
//   const sameType = selectedTypes[0];
//   const panelTypes = active ? PANEL_TYPES[active] : undefined;
//   const isPanelAllowedForSelection =
//     selectedElementIds.length <= 1 ||
//     (!isMixedSelection && sameType && (!panelTypes || panelTypes.includes(sameType)));
//   const setSidebarWidth = useEditorUIStore((s) => s.setSidebarWidth);
//   const closeEditPanel = useCallback(() => {
//     const mainPanel = useEditorUIStore.getState().lastMainPanel;
//     const restoredPanel = mainPanel || "text";
//     setActiveRightPanel(restoredPanel);
//     setActivePanelType("main");
//     setSidebarWidth("main");
//   }, [setActiveRightPanel, setActivePanelType, setSidebarWidth]);
//   useEffect(() => {
//     const requiresElementSelection = active && !CANVAS_LEVEL_PANELS.includes(active);
//     if (isEditPanel && requiresElementSelection && selectedElementIds.length === 0) {
//       closeEditPanel();
//     }
//   }, [active, closeEditPanel, isEditPanel, selectedElementIds.length]);

//   if (!isEditPanel) return null;

//   if (isMixedSelection || !isPanelAllowedForSelection) return null;

//   return (
//     <div
//       className="relative kd-toolPanel-container h-full flex flex-col"
//     >

//       <div className=" flex items-center justify-between px-4 py-2">
//         <h2 className="kd-toolPanel-heding-text">
//           {EDIT_PANEL_TITLES[active] ?? ""}
//         </h2>
//         <button
//           type="button"
//           onClick={closeEditPanel}
//           className="text-gray-400 hover:text-gray-600 transition-colors"
//         >
//           <FontAwesomeIcon icon={faXmark} />
//         </button>
//       </div>
//       <div className="kd-toolPanel-hr-devide-border mb-1 mx-2" />

//       {/* Content */}
//       <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain kd-custom-scrollbar">
//         {active === "CanvasBgBar" && <CanvasBgBar />}
//         {active === "FontFamilyPanel" && <FontFamilyPanel />}
//         {active === "ItemPositionPanel" && <ItemPostionPanel />}
//         {active === "ImageCrop" && <ImageCrop />}
//         {active === "ImageEffectsPanel" && <ImageEffectsPanel />}
//         {active === "ImageStrokeColorPanel" && <ImageStrokeColorPanel />}
//         {active === "AskAiPanel" && <AskAiPanel />}
//         {active === "BtnMoreSetting" && <BtnMoreSetting />}
//         {active === "ShapeBkgColorPanel" && <ShapeBgColorPanel />}
//         {active === "VideoReplacePanel" && <VideoReplacePanel />}
//         {active === "imageReplacePanel" && <ImageReplacePanel />}
//         {active === "BtnBorderColor" && <BtnBorderColor />}
//         {active === "ButtonEditBGColor" && <ButtonEditBGColor />}
//         {active === "TextColorPanel" && <TextColorPanel />}
//         {active === "TextBgColorPanel" && <TextBgColorPanel />}
//         {active === "TableSettings" && <TableSettings />}
//         {active === "ChartSettings" && <ChartSettings />}
//       </div>
//     </div> 
//   );
// };

// export default EditToolPanel;
"use client";
import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import CanvasBgBar from "./EditToolBar/CanvasSetting/CanvasBgBar";
import FontFamilyPanel from "@/components/blocks/Text/sidebar/FontFamilyPanel";
import ItemPostionPanel from "./EditToolBar/Coman/ItemPostionPanel";
import TextBgColorPanel from "@/components/blocks/Text/sidebar/TextBgColorPanel";
import ImageCrop from "@/components/blocks/Image/sidebar/panels/ImageCropePanel";
import ImageEffectsPanel from "@/components/blocks/Image/sidebar/panels/ImageEffectsPanel";
import ImageStrokeColorPanel from "@/components/blocks/Image/sidebar/panels/ImageStrokeColorPanel";
import AskAiPanel from "./EditToolBar/CanvasSetting/AskAiPanel";
import ShapeBgColorPanel from "@/components/blocks/Shape/sidebar/ShapeBgColorPanel";
import BtnBorderColor from "@/components/blocks/Button/sidebar/BtnBorderColor";
import BtnMoreSetting from "@/components/blocks/Button/sidebar/BtnMoreSetting";
import InteractionSettings from "@/components/blocks/Interaction/sidebar/InteractionSettings";
import ButtonEditBGColor from "@/components/blocks/Button/sidebar/ButtonEditBGColor";
import VideoReplacePanel from "@/components/blocks/Video/sidebar/VideoReplacePanel";
import ImageReplacePanel from "@/components/blocks/Image/sidebar/ImageReplacePanel";
import TextColorPanel from "@/components/blocks/Text/sidebar/TextColorPanel";
import TableSettings from "@/components/blocks/Table/sidebar/TableSettings";
import ChartSettings from "@/components/blocks/Chart/sidebar/ChartSettings";

// EDIT PANEL KEYS
const EDIT_PANEL_KEYS = [
  "TextColorPanel", "CanvasBgBar", "FontFamilyPanel", "ItemPositionPanel", "TextBgColorPanel", "ImageCrop", "ImageEffectsPanel"
  , "ImageStrokeColorPanel", "AskAiPanel", "BtnMoreSetting", "InteractionSettings",
  "ShapeBkgColorPanel", "BtnBorderColor", "ButtonEditBGColor", "VideoReplacePanel", "imageReplacePanel", "TableSettings", "ChartSettings"];
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
  InteractionSettings: "Interaction Settings",
  BtnBorderColor: "Button Border Color",
  ButtonEditBGColor: "Button Background",

  // Shape
  ShapeBkgColorPanel: "Shape Background",

  // Media
  VideoReplacePanel: "Replace Video",
  imageReplacePanel: "Replace Image",
  TableSettings: "Table Settings",
  ChartSettings: "Chart Settings",
};

const PANEL_TYPES: Record<string, string[]> = {
  TextColorPanel: ["text"],
  TextBgColorPanel: ["text"],
  FontFamilyPanel: ["text"],
  ImageCrop: ["image"],
  ImageEffectsPanel: ["image", "video"],
  ImageStrokeColorPanel: ["image", "shape", "svg", "video"],
  imageReplacePanel: ["image"],
  VideoReplacePanel: ["video"],
  BtnMoreSetting: ["button"],
  InteractionSettings: ["interaction"],
  BtnBorderColor: ["button"],
  ButtonEditBGColor: ["button"],
  ShapeBkgColorPanel: ["shape"],
  ItemPositionPanel: ["text", "image", "shape", "svg", "button", "interaction", "video", "watermark", "table"],
  TableSettings: ["table"],
  ChartSettings: ["chart"],
};

const CANVAS_LEVEL_PANELS = ["CanvasBgBar", "AskAiPanel"];
const EditToolPanel: React.FC = () => {
  const active = useEditorStore((s) => s.activeRightPanel);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const selectedElementIds = useEditorStore((s) => s.selectedElementIds);
  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
  const setActivePanelType = useEditorUIStore((s) => s.setActivePanelType);
  const isEditPanel = active && EDIT_PANEL_KEYS.includes(active);
  const selectedElements = (slides[activeSlide]?.elements ?? []).filter((el) => selectedElementIds.includes(el.id));
  const selectedTypes = Array.from(new Set(selectedElements.map((el) => el.data.type)));
  const isMixedSelection = selectedElementIds.length > 1 && selectedTypes.length > 1;
  const sameType = selectedTypes[0];
  const panelTypes = active ? PANEL_TYPES[active] : undefined;
  const isPanelAllowedForSelection =
    selectedElementIds.length <= 1 ||
    (!isMixedSelection && sameType && (!panelTypes || panelTypes.includes(sameType)));
  const setSidebarWidth = useEditorUIStore((s) => s.setSidebarWidth);
  const closeEditPanel = useCallback(() => {
    const mainPanel = useEditorUIStore.getState().lastMainPanel;
    const restoredPanel = mainPanel || "text";
    setActiveRightPanel(restoredPanel);
    setActivePanelType("main");
    setSidebarWidth("main");
  }, [setActiveRightPanel, setActivePanelType, setSidebarWidth]);
  useEffect(() => {
    const requiresElementSelection = active && !CANVAS_LEVEL_PANELS.includes(active);
    if (isEditPanel && requiresElementSelection && selectedElementIds.length === 0) {
      closeEditPanel();
    }
  }, [active, closeEditPanel, isEditPanel, selectedElementIds.length]);

  if (!isEditPanel) return null;

  if (isMixedSelection || !isPanelAllowedForSelection) return null;

  return (
    <div
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
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain kd-custom-scrollbar">
        {active === "CanvasBgBar" && <CanvasBgBar />}
        {active === "FontFamilyPanel" && <FontFamilyPanel />}
        {active === "ItemPositionPanel" && <ItemPostionPanel />}
        {active === "ImageCrop" && <ImageCrop />}
        {active === "ImageEffectsPanel" && <ImageEffectsPanel />}
        {active === "ImageStrokeColorPanel" && <ImageStrokeColorPanel />}
        {active === "AskAiPanel" && <AskAiPanel />}
        {active === "BtnMoreSetting" && <BtnMoreSetting />}
        {active === "InteractionSettings" && <InteractionSettings />}
        {active === "ShapeBkgColorPanel" && <ShapeBgColorPanel />}
        {active === "VideoReplacePanel" && <VideoReplacePanel />}
        {active === "imageReplacePanel" && <ImageReplacePanel />}
        {active === "BtnBorderColor" && <BtnBorderColor />}
        {active === "ButtonEditBGColor" && <ButtonEditBGColor />}
        {active === "TextColorPanel" && <TextColorPanel />}
        {active === "TextBgColorPanel" && <TextBgColorPanel />}
        {active === "TableSettings" && <TableSettings />}
        {active === "ChartSettings" && <ChartSettings />}
      </div>
    </div> 
  );
};

export default EditToolPanel;
