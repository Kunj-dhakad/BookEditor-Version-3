"use client";
import React from "react";
import useEditorStore, {
  InteractionData,
  isInteractionData,
} from "@/app/Store/editorStore";
import { parseMediaUrl } from "../components/InteractionDetailView/EmbedMedia/media";
export default function EmbedMediaSettings() {
  const slides = useEditorStore((s) => s.slides),
    activeSlide = useEditorStore((s) => s.activeSlide),
    activeId = useEditorStore((s) => s.activeElementId),
    update = useEditorStore((s) => s.updateElement);
  const element = slides[activeSlide]?.elements.find(
    (item) => item.id === activeId,
  );
  if (
    !element ||
    !isInteractionData(element.data) ||
    element.data.interactionKind !== "embed-media"
  )
    return null;
  const data = element.data as InteractionData,
    patch = (value: Partial<InteractionData>) =>
      update(element.id, value, { history: true });
  const setUrl = (url: string) => {
    const media = parseMediaUrl(
      url,
      typeof window === "undefined" ? "localhost" : window.location.hostname,
    );
    patch(
      media
        ? {
            url,
            embedUrl: media.embedUrl,
            provider: media.platformName,
            renderMode: media.renderMode,
            thumbnail: media.thumbnailUrl,
          }
        : { url },
    );
  };
  const number = (
    key: "width" | "height" | "borderRadius" | "padding",
    value: string,
  ) => patch({ [key]: Math.max(0, Number(value) || 0) });
  return (
    <div className="kd-btn-setting-panel w-full h-full p-3 overflow-y-auto">
      <p className="kd-btn-setting-section-title">Embed media</p>
      <label className="kd-btn-setting-label block mb-1">Media URL</label>
      <input
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.url ?? ""}
        placeholder="https://..."
        onChange={(e) => setUrl(e.target.value)}
      />
      <label className="kd-btn-setting-label block mb-1">
        Detected provider
      </label>
      <input
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3 bg-gray-50"
        value={data.provider ?? "Unsupported URL"}
        readOnly
      />
      <div className="grid grid-cols-2 gap-2">
        <label className="kd-btn-setting-label">
          Width
          <input
            type="number"
            className="kd-btn-setting-input mt-1 w-full px-2 py-1.5"
            value={data.width}
            onChange={(e) => number("width", e.target.value)}
          />
        </label>
        <label className="kd-btn-setting-label">
          Height
          <input
            type="number"
            className="kd-btn-setting-input mt-1 w-full px-2 py-1.5"
            value={data.height}
            onChange={(e) => number("height", e.target.value)}
          />
        </label>
      </div>
      <label className="kd-btn-setting-label block mt-3 mb-1">
        Border radius
      </label>
      <input
        type="number"
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.borderRadius ?? 0}
        onChange={(e) => number("borderRadius", e.target.value)}
      />
      <label className="kd-btn-setting-label block mb-1">Background</label>
      <input
        type="color"
        className="w-full h-9 mb-3 cursor-pointer"
        value={data.backgroundColor ?? "#f8fafc"}
        onChange={(e) => patch({ backgroundColor: e.target.value })}
      />
      <label className="kd-btn-setting-label block mb-1">Padding</label>
      <input
        type="number"
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.padding ?? 0}
        onChange={(e) => number("padding", e.target.value)}
      />
      <label className="flex gap-2 text-xs mb-2">
        <input
          type="checkbox"
          checked={!!data.autoplay}
          onChange={(e) => patch({ autoplay: e.target.checked })}
        />
        Autoplay in preview
      </label>
      <label className="flex gap-2 text-xs mb-2">
        <input
          type="checkbox"
          checked={data.controls !== false}
          onChange={(e) => patch({ controls: e.target.checked })}
        />
        Controls
      </label>
      <label className="flex gap-2 text-xs mb-3">
        <input
          type="checkbox"
          checked={data.allowFullscreen !== false}
          onChange={(e) => patch({ allowFullscreen: e.target.checked })}
        />
        Allow fullscreen
      </label>
      <label className="kd-btn-setting-label block mb-1">Replace URL</label>
      <input
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.url ?? ""}
        onChange={(e) => setUrl(e.target.value)}
      />
      {data.thumbnail && (
        <>
          <label className="kd-btn-setting-label block mb-1">
            Preview thumbnail
          </label>
          <img
            src={data.thumbnail}
            alt="Media thumbnail"
            className="w-full h-28 object-cover rounded-md"
            referrerPolicy="no-referrer"
          />
        </>
      )}
    </div>
  );
}
