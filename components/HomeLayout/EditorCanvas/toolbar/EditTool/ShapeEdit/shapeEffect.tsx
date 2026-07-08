"use client";
import React, { useEffect, useState } from "react";
import { ImageData } from "@/app/Store/editorStore";

interface ToolbarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  data: ImageData;
  updateButton: (patch: Partial<ImageData>) => void;
}

const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) => {
  const safeValue = value ?? min;

  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1 text-gray-400">
        <span>{label}</span>
        <span>{safeValue}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-gray-700 rounded-full
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
};

const ImageEffect: React.FC<ToolbarProps> = ({
  targetRef,
  data,
  updateButton,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, visible: false });

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const OFFSET = 8;

    const updatePos = () => {
      const rect = target.getBoundingClientRect();
      const parentRect =
        target.offsetParent?.getBoundingClientRect() ?? {
          top: 0,
          left: 0,
        };

      setPos({
        top: rect.bottom - parentRect.top + OFFSET,
        left: rect.left - parentRect.left,
        visible: true,
      });
    };

    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);

    const obs = new MutationObserver(updatePos);
    obs.observe(target, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
      obs.disconnect();
    };
  }, [targetRef]);

  if (!pos.visible) return null;

  return (
    <div
      className="fixed z-9999 pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="w-80 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl text-white text-xs pointer-events-auto">
        <div className="font-semibold mb-3 text-sm">Image Effects</div>

        <div className="grid grid-cols-2 gap-3">
          <Slider
            label="Brightness"
            value={data.brightness}
            min={0}
            max={200}
            onChange={(v) => updateButton({ brightness: v })}
          />

          <Slider
            label="Contrast"
            value={data.contrast}
            min={0}
            max={200}
            onChange={(v) => updateButton({ contrast: v })}
          />

          <Slider
            label="Saturation"
            value={data.saturate}
            min={0}
            max={200}
            onChange={(v) => updateButton({ saturate: v })}
          />

          <Slider
            label="Hue"
            value={data.hueRotate}
            min={0}
            max={360}
            onChange={(v) => updateButton({ hueRotate: v })}
          />

          <Slider
            label="Blur"
            value={data.blur}
            min={0}
            max={20}
            step={0.5}
            onChange={(v) => updateButton({ blur: v })}
          />

          <Slider
            label="Grayscale"
            value={data.grayscale}
            min={0}
            max={100}
            onChange={(v) => updateButton({ grayscale: v })}
          />

          <Slider
            label="Sepia"
            value={data.sepia}
            min={0}
            max={100}
            onChange={(v) => updateButton({ sepia: v })}
          />
        </div>

        <button
          onClick={() =>
            updateButton({
              brightness: 100,
              contrast: 100,
              saturate: 100,
              hueRotate: 0,
              blur: 0,
              grayscale: 0,
              sepia: 0,
            })
          }
          className="mt-3 w-full py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImageEffect;