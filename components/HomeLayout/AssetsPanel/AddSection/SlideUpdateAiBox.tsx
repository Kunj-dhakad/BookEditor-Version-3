"use client";

import { useEffect, useRef, useState } from "react";
import useEditorStore from "@/app/Store/editorStore";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SendHorizontal, Sparkles, X } from "lucide-react";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
export default function SlideUpdateAiBox() {
    const open = useEditorUIStore((s) => s.slideUpdateAi);
    const setSlideUpdateAi = useEditorUIStore((s) => s.setSlideUpdateAi);

    const popupRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            const target = e.target as Node;

            if (!popupRef.current) return;


            if (popupRef.current.contains(target)) return;


            setSlideUpdateAi(false);
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [setSlideUpdateAi]);

    useEffect(() => {
        if (!open) return;

        function handleOutsideClick(e: MouseEvent) {
            if (!popupRef.current) return;

            if (popupRef.current.contains(e.target as Node)) return;

            setSlideUpdateAi(false);
        }

        function handleScroll(e: Event) {
            if (!popupRef.current) return;

            if (popupRef.current.contains(e.target as Node)) return;

            setSlideUpdateAi(false);
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [open, setSlideUpdateAi]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/generate-Ai-slide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Slide generation failed");
            }

            const aiSlideData = data.content;

            // console.log("📊 AI Slide Data received:", aiSlideData);

            if (!aiSlideData || !aiSlideData.elements) {
                throw new Error("Invalid slide data structure");
            }

            const { slides, activeSlide, slideUpdateAI } = useEditorStore.getState();
            const activeSlideId = slides[activeSlide].id;

            console.log("🔄 Updating slide:", activeSlideId);

            slideUpdateAI(activeSlideId, aiSlideData);

            console.log("✅ Slide updated successfully");

            setPrompt("");
        } catch (error) {
            console.error("❌ Slide generation error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to generate slide. Please try again."
            );
        } finally {
            setLoading(false);
            setSlideUpdateAi(false);
        }
    };


    if (!open) return null;

    return (
        <div ref={popupRef}
            className="bottom-6 right-6  fixed  z-9909 w-[320px] p-3 kd-popup-main-container "

        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 kd-text-primary text-sm">
                    <Sparkles size={18} className="kd-icon-text " />
                   Update or generate slide with AI
                </div>
                <button
                    onClick={() => setSlideUpdateAi(false)}
                    className="">
                    <X size={18} />
                </button>
            </div>
            <div className="kd-ai-generator-inputWrapper">
                <textarea
                    rows={3}
                    placeholder="Describe your slide idea..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="kd-ai-generator-textarea kd-custom-scrollbar text-sm p-1"
                />

                <button
                    onClick={handleGenerate}
                    className="kd-ai-generator-sendBtn"
                >
                    {loading ? (
                        <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                    ) : (
                        <SendHorizontal size={18} />
                    )}
                </button>

            </div>
            {/* <textarea
                value={prompt}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Eg: Create a slide about Startup Pitch Deck with bullet points"
                className="kd-new-slide-generate-textarea kd-custom-scrollbar w-full"
            />


            <div className="flex items-center justify-end gap-2 mt-2">
              

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="kd-btn  px-3 py-1 flex items-center gap-1"
                >
                    {loading ? (
                        <span className="flex items-center gap-1">
                            Generating..<FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                        </span>
                    ) : (
                        "Generate"
                    )}
                </button>
            </div>  */}
        </div>
    );
}