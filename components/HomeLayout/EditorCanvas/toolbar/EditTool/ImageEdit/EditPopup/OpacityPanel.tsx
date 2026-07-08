// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { ImageData } from "@/app/Store/editorStore";

// interface Props {
//     data: ImageData;
//     updateButton: (patch: Partial<ImageData>) => void;
//     targetRef: React.RefObject<HTMLElement | null>;
//     onClose: () => void;
// }


// const OpacityPanel: React.FC<Props> = ({ data, updateButton, targetRef, onClose }) => {
//     const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
//     const [mounted, setMounted] = useState(false);
//     const popupRef = useRef<HTMLDivElement>(null);
//     const POPUP_WIDTH = 248;

//     // ✅ RAF loop — LinkEditBox jaisa, center aligned
//     useEffect(() => {
//         const target = targetRef.current;
//         if (!target) return;

//         const updatePos = () => {
//             const rect = target.getBoundingClientRect();
//             setPos({
//                 top: rect.bottom + 8,
//                 left: rect.left + rect.width / 2 - POPUP_WIDTH / 2, // ✅ center align
//                 visible: true,
//             });
//         };

//         updatePos();
//         let rafId: number;
//         const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
//         rafId = requestAnimationFrame(loop);
//         return () => cancelAnimationFrame(rafId);
//     }, [targetRef]);

//     // ✅ Outside click close — LinkEditBox jaisa
//     useEffect(() => {
//         const handleOutside = (e: MouseEvent) => {
//             if (
//                 popupRef.current &&
//                 !popupRef.current.contains(e.target as Node) &&
//                 !targetRef.current?.contains(e.target as Node)
//             ) onClose();
//         };
//         document.addEventListener("mousedown", handleOutside);
//         return () => document.removeEventListener("mousedown", handleOutside);
//     }, [onClose, targetRef]);

//     // ✅ Mount animation
//     useEffect(() => {
//         const t = setTimeout(() => setMounted(true), 10);
//         return () => clearTimeout(t);
//     }, []);

//     if (!pos.visible) return null;

//     return (
//         <div
//             ref={popupRef}
//             data-element="true"
//             className="fixed z-9999"
//             style={{
//                 top: pos.top,
//                 left: pos.left,
//                 width: POPUP_WIDTH,
//                 opacity: mounted ? 1 : 0,
//                 transform: mounted ? "translateY(0px)" : "translateY(-6px)",
//                 transition: "opacity 0.15s ease, transform 0.15s ease",
//             }}
//             onMouseDown={(e) => e.stopPropagation()}
//         >
//             <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 flex flex-col gap-0.5">
//                 <button
//                     className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
//             ${data.flipX ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
//                     onClick={() => updateButton({ flipX: !data.flipX })}
//                 >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" /><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><line x1="12" y1="20" x2="12" y2="4" />
//                     </svg>
//                     <span className="flex-1">Flip horizontal</span>
//                     {data.flipX && (
//                         <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
//                     )}
//                 </button>

//                 <button
//                     className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition text-sm w-full text-left
//             ${data.flipY ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
//                     onClick={() => updateButton({ flipY: !data.flipY })}
//                 >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" /><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" /><line x1="4" y1="12" x2="20" y2="12" />
//                     </svg>
//                     <span className="flex-1">Flip vertical</span>
//                     {data.flipY && (
//                         <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">On</span>
//                     )}
//                 </button>

//             </div>
//         </div>
//     );
// };

// export default OpacityPanel;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImageData } from "@/app/Store/editorStore";

interface Props {
    data: ImageData;
    updateButton: (patch: Partial<ImageData>) => void;
    targetRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
}

const OpacityPanel: React.FC<Props> = ({ data, updateButton, targetRef, onClose }) => {
    const [pos, setPos] = useState({ top: 0, left: 0, visible: false });
    const [mounted, setMounted] = useState(false);
    const [inputVal, setInputVal] = useState<string>(String(Math.round((data.opacity ?? 1) * 100)));
    const popupRef = useRef<HTMLDivElement>(null);
    const POPUP_WIDTH = 248;

    // opacity 0–1 stored in data, UI shows 0–100
    const opacityPct = Math.round((data.opacity ?? 1) * 100);

    // RAF loop — center aligned
    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;
        const updatePos = () => {
            const rect = target.getBoundingClientRect();
            setPos({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2 - POPUP_WIDTH / 2,
                visible: true,
            });
        };
        updatePos();
        let rafId: number;
        const loop = () => { updatePos(); rafId = requestAnimationFrame(loop); };
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [targetRef]);

    // Outside click close
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

    // Mount animation
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 10);
        return () => clearTimeout(t);
    }, []);

    const commitPct = (pct: number) => {
        const clamped = Math.min(100, Math.max(0, pct));
        updateButton({ opacity: clamped / 100 });
        setInputVal(String(clamped));
    };

    const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        commitPct(Number(e.target.value));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow free typing; only digits
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setInputVal(raw);
    };

    const handleInputBlur = () => {
        commitPct(inputVal === "" ? 100 : Number(inputVal));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { handleInputBlur(); (e.target as HTMLInputElement).blur(); }
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowUp") commitPct(Math.min(100, opacityPct + 1));
        if (e.key === "ArrowDown") commitPct(Math.max(0, opacityPct - 1));
    };

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
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 pt-3 pb-2.5 flex flex-col gap-2.5">

                {/* Label */}
                <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                    Transparency
                </span>

                {/* Slider + Input row */}
                <div className="flex items-center gap-2">
                    {/* Slider */}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={opacityPct}
                        onChange={handleSlider}
                        className="flex-1 accent-violet-600 h-1.5 cursor-pointer"
                    />

                    {/* Number input */}
                    <input
                        type="text"
                        inputMode="numeric"
                        value={inputVal}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        maxLength={3}
                        className="w-12 px-1.5 py-1 text-xs text-center bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-violet-400 focus:bg-white transition text-gray-700 font-medium"
                    />
                </div>

                {/* Quick preset pills */}
                <div className="flex gap-1">
                    {[100, 75, 50, 25].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => commitPct(pct)}
                            className={`
                flex-1 py-1 text-[11px] font-medium rounded-lg border transition
                ${opacityPct === pct
                                    ? "border-violet-500 bg-violet-50 text-violet-700"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"}
              `}
                        >
                            {pct}%
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default OpacityPanel;