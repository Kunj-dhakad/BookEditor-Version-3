"use client";

import React from "react";
import useEditorStore, {
  InteractionData,
  isInteractionData,
} from "@/app/Store/editorStore";

export default function InteractionSettings() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const element = slides[activeSlide]?.elements.find(
    (item) => item.id === activeElementId,
  );
  if (!element || !isInteractionData(element.data)) return null;
  const data = element.data as InteractionData;
  const patch = (value: Partial<InteractionData>) =>
    updateElement(element.id, value, { history: true });
  return (
    <div className="kd-btn-setting-panel w-full h-full p-3">
      <p className="kd-btn-setting-section-title">Interaction</p>
      <label className="kd-btn-setting-label block mb-1">URL</label>
      <input
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.url ?? data.link ?? ""}
        placeholder="https://example.com"
        onChange={(event) =>
          patch({ url: event.target.value, link: event.target.value })
        }
      />
      <label className="kd-btn-setting-label block mb-1">Link type</label>
      <select
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.target ?? "_blank"}
        onChange={(event) =>
          patch({ target: event.target.value as InteractionData["target"] })
        }
      >
        <option value="_self">Current tab</option>
        <option value="_blank">New tab</option>
        <option value="popup">Popup</option>
      </select>
      <label className="kd-btn-setting-label block mb-1">Icon color</label>
      <input
        type="color"
        className="w-full h-9 mb-3 cursor-pointer"
        value={data.iconColor ?? data.textColor ?? "#ffffff"}
        onChange={(event) =>
          patch({
            iconColor: event.target.value,
            textColor: event.target.value,
          })
        }
      />
      <label className="kd-btn-setting-label block mb-1">
        Background color
      </label>
      <input
        type="color"
        className="w-full h-9 cursor-pointer"
        value={data.backgroundColor ?? "#4f46e5"}
        onChange={(event) => patch({ backgroundColor: event.target.value })}
      />
    </div>
  );
}
