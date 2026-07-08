"use client";
import useEditorStore from "@/app/Store/editorStore";
import { KdAiGenerateMagicIcon, KdAskAiEmptyIcon, KdLoadingIcon, KdSearchIcon } from "@/lib/icon/icons";
import React, { useState } from "react";

const QUICK_PROMPTS = [
    "Story Book",
    "Image & Text page",
    "Professional Page",
    "Corporate",
];

async function generateBookSlide(
    prompt: string,
    pageNum: number,
    totalPages: number,
    width: number,
    height: number,
) {
    const res = await fetch("/api/generate-Ai-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, pageNum, totalPages, width, height }),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.content) {
        throw new Error(data.error || "Slide generation failed");
    }
    return data.content;
}

export default function AiSlideUpdate() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        try {
            const store = useEditorStore.getState();
            const activeSlide = store.slides[store.activeSlide];
            const activeSlideId = activeSlide.id;

            const aiSlideData = await generateBookSlide(
                prompt,
                1,
                1,
                activeSlide.width ?? 350,
                activeSlide.height ?? 434
            );

            store.slideUpdateAI(activeSlideId, aiSlideData);
            setPrompt("");
        } catch (error) {
            console.error("Slide generation error:", error);
            alert(
                error instanceof Error ? error.message : "Failed to generate slide"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[300px] flex flex-col h-full">

            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
                <div className="kd-ask-ai-icon-circle">
                    <KdAskAiEmptyIcon />
                </div>
                <p className="kd-ask-ai-hero-text">
                    Let&apos;s write something <br /> amazing today?
                </p>
            </div>

            <div className="px-3 pb-3flex flex-col gap-2">
                {/* <div className="grid grid-cols-2 gap-2 mb-1">
                    {QUICK_PROMPTS.map((q) => (
                        <button
                            key={q}
                            onClick={() => setPrompt(q)}
                            className="kd-ask-ai-pill"
                        >
                            <KdSearchIcon />
                            <span className="truncate">{q}</span>
                        </button>
                    ))}
                </div> */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {QUICK_PROMPTS.map((q) => (
                        <button
                            key={q}
                            onClick={() => setPrompt(q)}
                            className="kd-ask-ai-pill"
                        >
                            <KdSearchIcon />
                            <span>{q}</span>
                        </button>
                    ))}
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your idea..."
                    className="kd-ai-video-textarea custom-scrollbar w-full h-[130px]"
                />

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className=" kd-ai-video-generate-btn mt-1 mb-3 flex items-center justify-center gap-1 w-full py-2 rounded-md text-[13px] font-semibold cursor-pointer  disabled:cursor-not-allowed hover:opacity-90 "
                >
                    {loading ? (
                        <>
                           
                            Generating… <span className="animate-spin"><KdLoadingIcon /></span>

                        </>
                    ) : (
                        <>
                            < KdAiGenerateMagicIcon />
                            Generate Page
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}