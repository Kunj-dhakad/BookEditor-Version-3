import React from "react";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { ButtonIcon, ElementsIcon, ImageIcon, KdWaterMarkIcon, TemplateIcon, TextIcon, VideoIcon } from "@/lib/icon/icons";

const NAV_ITEMS = [
    { panel: "TemplateAddPanel", icon: <TemplateIcon />, label: "Template" },
    { panel: "text", icon: <TextIcon />, label: "Text" },
    { panel: "image", icon: <ImageIcon />, label: "Images" },
    { panel: "AddButtonPanel", icon: <ButtonIcon />, label: "Buttons" },
    { panel: "AddElementPanel", icon: <ElementsIcon />, label: "Elements" },
    { panel: "AddInteractionsPanel", icon: <ElementsIcon />, label: "Interactions" },
    { panel: "AddVideoPanel", icon: <VideoIcon />, label: "Videos" },
    { panel: "WatermarkPanel", icon: <KdWaterMarkIcon />, label: "WaterMark" },
];

const Navbar: React.FC = () => {
    const active = useEditorStore((s) => s.activeRightPanel);
    const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
    const setSiteBarCollapsed = useEditorUIStore((s) => s.setSiteBarCollapsed);
    const setActivePanelType = useEditorUIStore((s) => s.setActivePanelType);
    const setLastMainPanel = useEditorUIStore((s) => s.setLastMainPanel);
    const activePanelType = useEditorUIStore((s) => s.activePanelType);
    const setSidebarWidth = useEditorUIStore((s) => s.setSidebarWidth);
    const togglePanel = (panel: string) => {
        if (active === panel && activePanelType === "main") {
            setActiveRightPanel(null);
            setActivePanelType(null);
            setSiteBarCollapsed(true);
            setSidebarWidth("closed");
            setLastMainPanel(null);
            return;
        }
        setLastMainPanel(panel);
        setActiveRightPanel(panel);
        setActivePanelType("main");
        setSiteBarCollapsed(false);
        setSidebarWidth("main");
    };

    return (
        <aside className="flex flex-col items-center w-full h-full kd-nav-btn-container">
            <div className="flex flex-col h-full p-1 gap-1.5 mt-2">
                {NAV_ITEMS.map(({ panel, icon, label }) => {
                    const isActive = active === panel;
                    return (
                        <div
                            key={panel}
                            className={`kd-nav-btn-wrapper ${isActive ? "kd-nav-btn-wrapper-active" : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePanel(panel);
                            }}
                        >
                            <button className={`kd-nav-btn ${isActive ? "kd-nav-btn-active" : ""}`}>
                                {icon}
                            </button>
                            <span className="kd-nav-btn-label">{label}</span>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Navbar;
