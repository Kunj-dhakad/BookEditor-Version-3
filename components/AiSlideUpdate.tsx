"use client";
import useEditorStore from "@/app/Store/editorStore";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sparkles } from "lucide-react";
import React, { useState } from "react";

export default function AiSlideUpdate() {
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

      console.log("📊 AI Slide Data received:", aiSlideData);

      if (!aiSlideData || !aiSlideData.elements) {
        throw new Error("Invalid slide data structure");
      }

      // Get fresh state
      const { slides, activeSlide, slideUpdateAI } =
        useEditorStore.getState();

      const activeSlideId = slides[activeSlide].id;

      console.log("🔄 Updating slide:", activeSlideId);

      slideUpdateAI(activeSlideId, aiSlideData);

      console.log("✅ Slide updated successfully");

      setPrompt("");
    } catch (error) {
      console.log("❌ Slide generation error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate slide. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] p-4 kd-popup-main-container rounded-lg">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 kd-text-primary font-medium">
        <Sparkles size={18} className="kd-icon-text" />
        Update or generate slide with AI
      </div>

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Update or Generate Slide with AI"
        className="kd-new-slide-generate-textarea kd-custom-scrollbar w-full"
      />

      {/* Actions */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="kd-btn px-4 py-1 flex items-center gap-2"
        >
          {loading ? (
            <>
              Generating...
              <FontAwesomeIcon
                className="animate-spin"
                icon={faSpinner}
              />
            </>
          ) : (
            <>
              Generate
              <Sparkles size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}