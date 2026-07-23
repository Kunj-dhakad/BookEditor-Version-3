"use client";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { ImageSearchIcon, KdColorPlusIcon } from "@/lib/icon/icons";
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

export default function TextColorPanel({ color = "#ffffff" }: Props) {
    const [currentColor, setCurrentColor] = useState(color);
    const [searchQuery, setSearchQuery] = useState("");
    const [initialColor] = useState(color);
    const [recentColors, setRecentColors] = useState<string[]>(RECENT_COLORS);
    const popoverRef = useRef<HTMLDivElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const setPendingTextColor = useEditorUIStore((s) => s.setPendingTextColor);

    const updateColor = (value: string) => {
        setCurrentColor(value);
        setPendingTextColor(value);
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

            <hr className="hr-border mb-4" />

            {/* SOLID COLORS */}
            <div className="mb-4">

                <div className="grid grid-cols-7 gap-2">
                    {SOLID_COLORS.map((c, index) => (
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

            <hr className="hr-border mb-4" />


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