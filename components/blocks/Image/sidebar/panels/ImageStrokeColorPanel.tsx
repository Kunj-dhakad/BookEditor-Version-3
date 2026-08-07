
"use client";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import React, { useState, useRef } from "react";

interface Props {
    color?: string;
    label?: string;
}

const PHOTO_COLORS = ["#1a3a1a", "#2d5a2d", "#3d6e3d", "#4a7c4a", "#8ab08a", "#b5ccb5"];

const SOLID_COLORS = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#ffffff",
    "#ff0000", "#ff4444", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff",
    "#9900ff", "#ff00ff", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc",
    "#8e7cc3", "#c27ba0", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c8",
    "#674ea7", "#a64d79", "#85200c", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc",
    "#351c75", "#741b47", "#20124d", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#4a1942",
];

export default function ImageStrokeColorPanel({ color = "#000000" }: Props) {
    const [currentColor, setCurrentColor] = useState(color);
    const [hexInput, setHexInput] = useState(color.replace("#", ""));
    const [opacity, setOpacity] = useState(100);
    const [showAllGrid, setShowAllGrid] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [initialColor] = useState(color);
    const popoverRef = useRef<HTMLDivElement>(null);
    const setPendingTextColor = useEditorUIStore((s) => s.setPendingTextColor);
    const activeElementId = useEditorStore((s) => s.activeElementId);
    const updateElement = useEditorStore((s) => s.updateElement);
    const updateColor = (value: string) => {
        setCurrentColor(value);
        setHexInput(value.replace("#", ""));
        setPendingTextColor(value);

        if (activeElementId) {
            updateElement(activeElementId, { strokeColor: value });
        }
    };

    const handleHexInput = (val: string) => {
        setHexInput(val);
        if (val.length === 6) {
            updateColor("#" + val);
        }
    };

    const handleReset = () => {
        updateColor(initialColor);
    };

    const filteredSolid = SOLID_COLORS.filter((c) =>
        !searchQuery || c.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const visibleSolid = showAllGrid ? filteredSolid : filteredSolid.slice(0, 32);

    return (
        <div className="p-2" ref={popoverRef}>

            {/* SEARCH */}
            <div className="flex items-center gap-1.5 border border-gray-300 rounded-md px-2 py-1.5 mb-3.5 bg-gray-50">
                <span className="text-sm text-gray-400">⌕</span>
                <input
                    type="text"
                    placeholder='Try "blue" or "#00c4cc"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-gray-900 bg-transparent outline-none border-none"
                />
            </div>

            {/* PHOTO COLORS */}
            <div className="text-[11px] font-medium text-gray-400 mb-1.5">Photo colors</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {PHOTO_COLORS.map((c) => (
                    <button
                        key={c}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => updateColor(c)}
                        title={c}
                        className={`w-[26px] h-[26px] rounded 
                            ${currentColor === c
                                ? "border-2 border-[#5B5FA6] outline outline-[#5B5FA6] outline-offset-1"
                                : "border border-black/10"}
                        `}
                        style={{ background: c }}
                    />
                ))}
            </div>

            {/* DEFAULT COLORS */}
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-gray-400">Default solid colors</span>
                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowAllGrid((v) => !v)}
                    className="text-[11px] text-[#5B5FA6]"
                >
                    {showAllGrid ? "See less" : "See all"}
                </button>
            </div>

            <div className="grid grid-cols-8 gap-1.5 mb-3">
                {visibleSolid.map((c) => (
                    <div
                        key={c}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => updateColor(c)}
                        title={c}
                        className={`aspect-square rounded cursor-pointer transition-transform 
                            ${currentColor === c
                                ? "border-2 border-[#5B5FA6] outline outline-[#5B5FA6] outline-offset-1"
                                : "border border-black/10"}
                        `}
                        style={{ background: c }}
                    />
                ))}
            </div>

            {/* DIVIDER */}
            <div className="h-[0.5px] bg-gray-200 my-2.5" />

            {/* HEX INPUT */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-2.5 h-[34px]">
                <div className="w-[34px] h-full shrink-0" style={{ background: currentColor }} />
                <span className="px-1 text-sm text-gray-400">#</span>
                <input
                    type="text"
                    maxLength={6}
                    value={hexInput}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="flex-1 text-xs text-gray-900 bg-transparent outline-none border-none px-1"
                />
                <div className="w-8 h-full border-l border-gray-300 relative cursor-pointer">
                    <div className="w-full h-full" style={{ background: currentColor }} />
                    <input
                        type="color"
                        value={currentColor}
                        onMouseDown={(e) => e.preventDefault()}
                        onChange={(e) => updateColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                </div>
            </div>

            {/* OPACITY */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[11px] text-gray-400 w-12">Opacity</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={opacity}
                    onMouseDown={(e) => e.preventDefault()}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="flex-1 accent-[#5B5FA6]"
                />
                <span className="text-[11px] text-gray-400 w-8 text-right">{opacity}%</span>
            </div>

            {/* RESET */}
            <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleReset}
                className="w-full py-[7px] border border-gray-300 rounded-md bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 transition"
            >
                Reset
            </button>
        </div>
    );
}