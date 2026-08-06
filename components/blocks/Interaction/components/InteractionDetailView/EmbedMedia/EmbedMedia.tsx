"use client";
import React, { useState } from "react";
import { ArrowLeft, Link2, Video } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import { parseMediaUrl } from "./media";
import { useAddInteraction } from "../../useAddInteraction";
export default function EmbedMedia({ onBack }: { onBack: () => void }) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState("");
  const { addInteraction } = useAddInteraction();
  const add = () => {
    const media = parseMediaUrl(
      url,
      typeof window === "undefined" ? "localhost" : window.location.hostname,
    );
    if (!media) return setError("Use a supported media URL.");
    addInteraction("embed-media");
    const store = useEditorStore.getState(),
      element = store.slides[store.activeSlide]?.elements.at(-1);
    if (element)
      store.updateElement(
        element.id,
        {
          url: media.originalUrl,
          embedUrl: media.embedUrl,
          provider: media.platformName,
          renderMode: media.renderMode,
          thumbnail: media.thumbnailUrl,
        },
        { history: true },
      );
    onBack();
  };
  return (
    <div className="kd-text-add-panel-container bg-white flex flex-col h-full p-3">
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <span className="kd-toolPanel-heding-text text-gray-900">
          Embed Media
        </span>
      </div>

      <div className="w-full kd-toolPanel-hr-devide-border  border-gray-200" />

      <div className=" pt-4 space-y-3">
        <p className="text-xs text-gray-500">
          Paste a supported media URL to add an interactive embed.
        </p>
        <div className="relative">
          <Link2 size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            autoFocus
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="YouTube, Vimeo, Figma, image..."
            className="w-full border rounded-lg pl-9 p-2.5 text-sm"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={add}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
        >
          <Video size={16} /> Embed media
        </button>
      </div>
    </div>
  );
}
