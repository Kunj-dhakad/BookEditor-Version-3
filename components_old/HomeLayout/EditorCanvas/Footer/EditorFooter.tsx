"use client";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { KdCanvasFooterMinusIcon, KdCanvasFooterPlusIcon, KDFooterPageIcon } from "@/lib/icon/icons";
import React from "react";
interface EditorFooterProps {
    totalSlides?: number;
    currentSlide?: number;
}

export default function EditorFooter({
    totalSlides = 1,
    currentSlide = 1,
}: EditorFooterProps) {
    const zoom = useEditorUIStore((s) => s.MainCanvasScale);
    const setZoom = useEditorUIStore((s) => s.setMainCanvasScale);
    const [showTooltip, setShowTooltip] = React.useState<string | null>(null);

    const zoomPercent = Math.round(zoom * 100);

    const handleZoom = (val: number) => {
        setZoom(Math.min(2, Math.max(0.1, val / 100)));
    };

    const step = (delta: number) => {
        const next = Math.round(zoomPercent / 10) * 10 + delta;
        handleZoom(Math.min(200, Math.max(10, next)));
    };

    return (

        <div className="flex items-center justify-between w-full h-[35px] px-4 bg-[#f3f4f8]">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => step(-10)}
                    className="flex items-center justify-center w-6 h-6">
                    <KdCanvasFooterMinusIcon />
                </button>

                <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={zoomPercent}
                    onChange={(e) => handleZoom(Number(e.target.value))}
                    className="kd-range-slider" 
                    />
                    
                <button

                    onClick={() => step(10)}
                    className=" flex items-center justify-center w-6 h-6">
                    <KdCanvasFooterPlusIcon />

                </button>

                <span className="w-10 text-[10px] text-gray-800 kd-font-jakarta">
                    {zoomPercent}%
                </span>
            </div>

            <div className="flex items-center">
                <button
                    className="kd-tooltip-parent p-2 mx-2 rounded-md transition"
                    onMouseEnter={() => setShowTooltip("Preview")}
                    onMouseLeave={() => setShowTooltip(null)}
                    onClick={() => useEditorUIStore.getState().setPreviewPanelOpen(!useEditorUIStore.getState().previewpanelOpen)}
                >
                    <KDFooterPageIcon />
                    {showTooltip === "Preview" && <span className="kd-tooltip-top">
                        {useEditorUIStore.getState().previewpanelOpen ? "Hide Preview" : "Show Preview"}
                    </span>}
                </button>

                <div className="flex mx-1 items-center overflow-hidden bg-white rounded-md text-xs kd-font-jakarta">

                    <span className="bg-[#e5e4e4] px-2 py-1 text-[10px] font-medium text-black">
                        Page
                    </span>

                    <span className="bg-[#e5e4e4] px-2 py-1 text-[10px] font-medium text-black"> {totalSlides}</span>
                </div>

                <span className="px-1 text-[10px] text-gray-600 kd-font-jakarta">
                    of <span className="ms-2">{currentSlide} / {totalSlides}</span>
                </span>
            </div>
        </div>
    );
}