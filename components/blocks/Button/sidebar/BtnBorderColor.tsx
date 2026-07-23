"use client";
import useEditorStore from "@/app/Store/editorStore";
import { ImageSearchIcon, KdColorPlusIcon } from "@/lib/icon/icons";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
import React, { useState, useRef } from "react";

interface Props {
    color?: string;
    label?: string;
}

const RECENT_COLORS = [
    "#000000", "#8B5CF6", "#5EEAD4", "#4FC3F7", "#F4A261",
    "#fdb57c", "#3B82F6", "#E76F51", "#FF0000", "#F4C2D7",
    "#52C41A", "#FF6B6B",
];

const SOLID_COLORS = [
    "#000000", "#545454", "#737373", "#A6A6A6", "#B4B4B4", "#D9D9D9", "#FFFFFF",
    "#FE8B3B", "#FDC162", "#6A29EE", "#866BFD", "#9E57FC", "#C866EF", "#FC6470",
    "#2D83DD", "#3AB6FD", "#2DC2C5", "#0D547E", "#5297A3", "#222FA7", "#1C5CE8",
    "#06823D", "#0CB960", "#6EC436", "#87E896", "#905636", "#DE923E", "#F6561A",
    "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c8", "#674ea7",
    "#a64d79", "#85200c", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc",
    "#351c75", "#741b47", "#20124d", "#7f6000", "#274e13", "#0c343d", "#1c4587",
];

const GRADIENT_COLORS = [
    "linear-gradient(135deg, #FFC7B2 0%, #B40F00 100%)",
    "linear-gradient(135deg, #5B03F2 0%, #7D71FF 100%)",
    "linear-gradient(135deg, #F95769 0%, #3DBAFA 100%)",
    "linear-gradient(135deg, #FC6173 0%, #695BEF 100%)",
    "linear-gradient(135deg, #61E3FA 0%, #5F19CD 100%)",
    "linear-gradient(135deg, #FCAA7C 0%, #28A6F5 100%)",
    "linear-gradient(135deg, #FFB0B9 0%, #FF3349 100%)",
    "linear-gradient(135deg, #1CBB5C 0%, #057638 100%)",
    "linear-gradient(135deg, #D56D07 0%, #873301 100%)",
    "linear-gradient(135deg, #85BDFC 0%, #2463D7 100%)",
    "linear-gradient(135deg, #60E4FB 0%, #01A5CE 100%)",
    "linear-gradient(135deg, #A65BFC 0%, #520EC3 100%)",
    "linear-gradient(135deg, #AA96FD 0%, #6A5EF0 100%)",
    "linear-gradient(135deg, #FBC841 0%, #EE9308 100%)",
    "linear-gradient(135deg, #28F09C 0%, #04A976 100%)",
    "linear-gradient(135deg, #ADFF1A 0%, #2B4506 100%)",
    "linear-gradient(135deg, #A8FF41 0%, #FFFF00 100%)",
    "linear-gradient(135deg, #FFB3E7 0%, #A302B2 100%)",
    "linear-gradient(135deg, #5F9AFC 0%, #1B46D6 100%)",
    "linear-gradient(135deg, #054F6D 0%, #4CD4CB 100%)",
    "linear-gradient(135deg, #FF7947 0%, #5C1F08 100%)",
];

const SOLID_PREVIEW_LIMIT = 14; 
const GRADIENT_PREVIEW_LIMIT = 14;

export default function BtnBorderColor({ color = "#ffffff" }: Props) {
    const [currentColor, setCurrentColor] = useState(color);
    const [showAllSolid, setShowAllSolid] = useState(false);
    const [showAllGradient, setShowAllGradient] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [initialColor] = useState(color);
    const [recentColors, setRecentColors] = useState<string[]>(RECENT_COLORS);
    const popoverRef = useRef<HTMLDivElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const updateElement = useEditorStore((s) => s.updateElement);
    const activeElementId = useEditorStore((s) => s.activeElementId);

    const updateColor = (value: string) => {
        setCurrentColor(value);
        if (activeElementId) {
            updateElement(activeElementId, { borderColor: value });
        }
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateColor(value);
        setRecentColors((prev) => {
            const filtered = prev.filter((c) => c !== value);
            return [value, ...filtered].slice(0, 12);
        });
    };

    const handleReset = () => {
        updateColor(initialColor);
    };

    const filteredSolid = SOLID_COLORS.filter(
        (c) => !searchQuery || c.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredGradient = GRADIENT_COLORS; 

    const visibleSolid = showAllSolid ? filteredSolid : filteredSolid.slice(0, SOLID_PREVIEW_LIMIT);
    const visibleGradient = showAllGradient ? filteredGradient : filteredGradient.slice(0, GRADIENT_PREVIEW_LIMIT);

    return (
        <div className="p-2" ref={popoverRef}>

            {/* SEARCH */}
            <div className="relative mb-5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="kd-imageTool-searchWrapper w-full rounded-lg text-sm outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 kdColorTextTitle">
                    <ImageSearchIcon />
                </div>
            </div>

            {/* RECENT COLORS */}
            <div className="mb-4">
                <p className="kdColorTextTitle text-xs font-semibold mb-2">Color Recent</p>
                <div className="grid grid-cols-7 gap-2">
                    <button
                        type="button"
                        onClick={() => colorInputRef.current?.click()}
                        className="kdColorPlusIcon-backbg w-7 h-7 rounded-lg flex items-center justify-center relative"
                        title="Custom color"
                    >
                        <div className="kdColorPlusIcon-bg w-5 h-5 rounded-sm flex items-center justify-center">
                            <KdColorPlusIcon />
                        </div>
                        <input
                            ref={colorInputRef}
                            type="color"
                            value={currentColor}
                            onChange={handleCustomColorChange}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            tabIndex={-1}
                        />
                    </button>

                    {recentColors.map((c, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => updateColor(c)}
                            className={`kd-color-box ${currentColor === c ? "selected" : ""}`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            <div className="hr-border mb-4" />

            {/* SOLID COLORS */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="kdColorTextTitle text-xs font-semibold">Solid Color</p>
                    <button
                        type="button"
                        className="text-xs cursor-pointer"
                        onClick={() => setShowAllSolid((v) => !v)}
                    >
                        {showAllSolid ? "See less" : "See all"}
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {visibleSolid.map((c, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => updateColor(c)}
                            className={`kd-color-box ${currentColor === c ? "selected" : ""}`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            <div className="hr-border mb-4" />

            {/* GRADIENT COLORS */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="kdColorTextTitle text-xs font-semibold">Gradient Colors</p>
                    <button
                        type="button"
                        className="text-xs cursor-pointer"
                        onClick={() => setShowAllGradient((v) => !v)}
                    >
                        {showAllGradient ? "See less" : "See all"}
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {visibleGradient.map((gradient, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => updateColor(gradient)} 
                            className={`kd-color-box ${currentColor === gradient ? "selected" : ""}`}
                            style={{ background: gradient }}
                            title={`Gradient ${index + 1}`}
                        />
                    ))}
                </div>
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