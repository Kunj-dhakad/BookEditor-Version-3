"use client";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { KdGradBgIcon } from "@/lib/icon/icons";
import { Sparkles } from "lucide-react";
const CanvasHeaderBar: React.FC = () => {
  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);

  return (
    <div>
      <div
        data-copy-style-toolbar="true"
        className="kd-canvasheader-container h-10 mt-4 flex items-center justify-between px-1 py-1 rounded-lg"
      >
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) {
              useEditorUIStore.getState().setLastMainPanel(currentActive);
            }
            setActiveRightPanel("AskAiPanel");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-all"
        >
          <Sparkles size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-gray-800">Ask AI</span>
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) {
              useEditorUIStore.getState().setLastMainPanel(currentActive);
            }
            setActiveRightPanel("CanvasBgBar");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}
          className="flex items-center px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <KdGradBgIcon />
        </div>
      </div>
    </div>
  );
};

export default CanvasHeaderBar;
