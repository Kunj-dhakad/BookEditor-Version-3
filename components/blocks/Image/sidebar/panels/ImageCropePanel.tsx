"use client";
import React from "react";
import useEditorStore, { ImageData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { cropperControls } from "@/components/blocks/Image/editor/cropperControls";
import useProjectInfoStore from "@/app/Store/projectInfoStore";

const RATIOS = [
  { label: "Full", value: "full", ratio: NaN, shape: "full" },
  { label: "Original", value: "original", ratio: NaN, shape: "square" },
  { label: "1:1", value: "1:1", ratio: 1, shape: "square" },
  { label: "16:9", value: "16:9", ratio: 16 / 9, shape: "wide" },
  { label: "9:16", value: "9:16", ratio: 9 / 16, shape: "tall" },
  { label: "5:4", value: "5:4", ratio: 5 / 4, shape: "wide" },
  { label: "4:5", value: "4:5", ratio: 4 / 5, shape: "tall" },
  { label: "4:3", value: "4:3", ratio: 4 / 3, shape: "wide" },
  { label: "3:4", value: "3:4", ratio: 3 / 4, shape: "tall" },
  { label: "3:2", value: "3:2", ratio: 3 / 2, shape: "wide" },
  { label: "2:3", value: "2:3", ratio: 2 / 3, shape: "tall" },
] as const;


const SHAPE_DIMS: Record<string, { w: number; h: number }> = {
  full: { w: 28, h: 20 },
  square: { w: 20, h: 20 },
  wide: { w: 28, h: 16 },
  tall: { w: 16, h: 26 },
};

const RatioIcon: React.FC<{ shape: string; active: boolean }> = ({ shape, active }) => {
  const { w, h } = SHAPE_DIMS[shape] ?? { w: 20, h: 20 };
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect
        x={(32 - w) / 2}
        y={(32 - h) / 2}
        width={w}
        height={h}
        rx="2"
        stroke={active ? "var(--kd-primary,#7c3aed)" : "currentColor"}
        strokeWidth={active ? 2 : 1.5}
        fill={active ? "var(--kd-primary-light,#ede9fe)" : "transparent"}
        opacity={active ? 1 : 0.6}
      />
    </svg>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ImageCropePanel: React.FC = () => {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const setCropElementId = useEditorUIStore((s) => s.setCropElementId);
  const cropElementId = useEditorUIStore((s) => s.cropElementId);

  const token = useProjectInfoStore((s) => s.token);
  const api_url = useProjectInfoStore((s) => s.api_url);
  const [Apiloading, setApiLoading] = React.useState(false);



  const element = slides[activeSlide]?.elements.find(
    (el) => el.id === activeElementId
  );

  if (!element || element.data.type !== "image") return null;

  const data = element.data as ImageData;
  const activeVal = (data.cropRatio as string) ?? "full";
  const isCropping = cropElementId === activeElementId;

  // â”€â”€ Ratio select â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleRatioClick = (r: (typeof RATIOS)[number]) => {
    // Store mein save karo
    updateElement(element.id, {
      cropRatio: r.value,
    } as Partial<ImageData>);


    if (isCropping) {
      cropperControls.setRatio(isNaN(r.ratio) ? NaN : r.ratio);
    }
  };

  // â”€â”€ Save crop â”€â”€â”€â”€â”€â”€â”€â”€
  // const handleSave = async () => {
  //   const blob = await cropperControls.getCroppedBlob();
  //   if (!blob) return;


  //   if (data.src.startsWith("blob:")) {
  //     URL.revokeObjectURL(data.src);
  //   }

  //   const newUrl = URL.createObjectURL(blob);
  //   updateElement(element.id, { src: newUrl }, { history: true });
  //   setCropElementId(null);
  // };



  const handleSave = async () => {

    setApiLoading(true);
    const blob = await cropperControls.getCroppedBlob();
    if (!blob) return;

    try {
      const formData = new FormData();

      formData.append("image_url", blob, "crop.png");
      formData.append("access_token", token || "");

      const res = await fetch(
        `${api_url}sl_editor_crop_image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status === 1 && data.url) {
        updateElement(
          element.id,
          { src: data.url },
          { history: true }
        );
        setApiLoading(false);
        setCropElementId(null);
      }
    } catch (err) {
      setApiLoading(false);
      console.error("Crop upload failed:", err);
    }
  };











  // â”€â”€ Cancel â”€â”€â”€
  const handleCancel = () => {
    setCropElementId(null);
  };

  // â”€â”€ Start crop â”€â”€â”€
  const handleStartCrop = () => {
    setCropElementId(activeElementId);
  };

  return (
    <div className="flex flex-col gap-4 p-4">

      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">Crop</span>
        <span className="text-xs text-muted-foreground">
          {isCropping
            ? "Drag to crop, select ratio below"
            : "Click Start Crop to begin"}
        </span>
      </div>
      {!isCropping && (
        <button
          onClick={handleStartCrop}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: 8,
            background: "var(--kd-primary,#7c3aed)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          âœ‚ Start Crop
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 6,
        }}
      >
        {RATIOS.map((r) => {
          const isActive = activeVal === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handleRatioClick(r)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "10px 4px",
                borderRadius: 8,
                border: isActive
                  ? "1.5px solid var(--kd-primary,#7c3aed)"
                  : "1.5px solid var(--border,#e2e8f0)",
                background: isActive
                  ? "var(--kd-primary-light,#ede9fe)"
                  : "transparent",
                color: isActive
                  ? "var(--kd-primary,#7c3aed)"
                  : "var(--muted-foreground,#64748b)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <RatioIcon shape={r.shape} active={isActive} />
              <span style={{ fontSize: 11, fontWeight: 500, lineHeight: 1 }}>
                {r.label}
              </span>
            </button>
          );
        })}
      </div>


      {isCropping && (
        <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid var(--border,#e2e8f0)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              background: "#4F8EF7",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {Apiloading ? "Saving..." : "Save Crop"}

          </button>
        </div>
      )}

      {/* Current size */}
      <div
        style={{
          borderTop: "1px solid var(--border,#e2e8f0)",
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--muted-foreground,#64748b)",
            fontWeight: 500,
          }}
        >
          Current Size
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "W", val: data.width },
            { label: "H", val: data.height },
          ].map(({ label, val }) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: "var(--muted-foreground,#64748b)",
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>
                {Math.round(val)}px
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ImageCropePanel;