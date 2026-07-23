"use client";
import React, { useEffect, useRef, useState } from "react";
import { VideoData } from "@/app/Store/editorStore";

interface Props {
    data: VideoData;
    updateButton: (patch: Partial<VideoData>) => void;
    targetRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
}


const FlipPanel: React.FC<Props> = ({ data, updateButton, targetRef, onClose }) => {
    const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
    const [mounted, setMounted] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const POPUP_WIDTH = 248;

    // ✅ RAF loop — LinkEditBox jaisa, center aligned
    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        const updatePos = () => {
            const rect = target.getBoundingClientRect();
            setPos({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2 - POPUP_WIDTH / 2, // ✅ center align
                visible: true,
            });
        };

        updatePos();
        let rafId: number;
        const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [targetRef]);

    // ✅ Outside click close — LinkEditBox jaisa
    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                !targetRef.current?.contains(e.target as Node)
            ) onClose();
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose, targetRef]);

    // ✅ Mount animation
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 10);
        return () => clearTimeout(t);
    }, []);

    if (!pos.visible) return null;

    return (
        <div
            ref={popupRef}
            data-element="true"
            className="fixed z-9999"
            style={{
                top: pos.top,
                left: pos.left,
                width: POPUP_WIDTH,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0px)" : "translateY(-6px)",
                transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 flex flex-col gap-0.5">
                <button
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
            ${data.flipX ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
                    onClick={() => updateButton({ flipX: !data.flipX })}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" /><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><line x1="12" y1="20" x2="12" y2="4" />
                    </svg>
                    <span className="flex-1">Flip horizontal</span>
                    {data.flipX && (
                        <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
                    )}
                </button>

                <button
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
            ${data.flipY ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
                    onClick={() => updateButton({ flipY: !data.flipY })}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" /><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" /><line x1="4" y1="12" x2="20" y2="12" />
                    </svg>
                    <span className="flex-1">Flip vertical</span>
                    {data.flipY && (
                        <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
                    )}
                </button>

            </div>
        </div>
    );
};

export default FlipPanel;