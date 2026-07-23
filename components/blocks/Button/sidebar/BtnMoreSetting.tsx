"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronDown as ChevronDownIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from "lucide-react";
import {
  KdbuttonEditSettingArrowUpLeftIcon,
  KdbuttonEditSettingArrowUpRightIcon,
  KdbuttonEditSettingVerticalIcon,
  KdbuttonEditSettingArrowDownLeftIcon,
  KdbuttonEditSettingArrowDownRightIcon

} from "@/lib/icon/icons"

import useEditorStore, { ButtonData } from "@/app/Store/editorStore";

const FONT_FAMILIES = ["Geist", "Inter", "Poppins", "Roboto", "Montserrat", "Playfair Display", "Lato", "Nunito", "Raleway", "Oswald"];
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 30, 36, 48];
const FONT_WEIGHTS = [
  { label: "Thin", value: 100 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "SemiBold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extra Bold", value: 800 },
  { label: "Black", value: 900 },
];
const LINE_STYLES = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
  { label: "Double", value: "double" },
];
const SHADOW_PRESETS: { label: string; value: "none" | "soft" | "regular" | "retro"; shadow: string }[] = [
  { label: "None", value: "none", shadow: "none" },
  { label: "Soft", value: "soft", shadow: "0 2px 8px rgba(0,0,0,0.15)" },
  { label: "Regular", value: "regular", shadow: "0 4px 12px rgba(0,0,0,0.25)" },
  { label: "Retro", value: "retro", shadow: "3px 3px 0 rgba(0,0,0,0.8)" },
];
const ALIGN_OPTIONS = [
  { v: "left", Icon: AlignLeft },
  { v: "center", Icon: AlignCenter },
  { v: "right", Icon: AlignRight },
] as const;
const VALIGN_OPTIONS = [
  { v: "top", Icon: AlignVerticalJustifyStart },
  { v: "middle", Icon: AlignVerticalJustifyCenter },
  { v: "bottom", Icon: AlignVerticalJustifyEnd },
] as const;
const CASE_OPTIONS = [
  { v: "none", label: "—" },
  { v: "capitalize", label: "Ag" },
  { v: "lowercase", label: "ag" },
  { v: "uppercase", label: "AG" },
] as const;

const DIRECTION_OPTIONS = [
  { v: "diagonal-up-left", Icon: KdbuttonEditSettingArrowUpLeftIcon },
  { v: "diagonal-up-right", Icon: KdbuttonEditSettingArrowUpRightIcon },
  { v: "vertical", Icon: KdbuttonEditSettingVerticalIcon },
  { v: "diagonal-down-left", Icon: KdbuttonEditSettingArrowDownLeftIcon },
  { v: "diagonal-down-right", Icon: KdbuttonEditSettingArrowDownRightIcon },
] as const;

const BORDER_RADIUS_OPTIONS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 999];
interface ExtendedButtonData extends Omit<ButtonData, "gradientDirection"> {
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textAlign?: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";
  borderStyle?: "dashed" | "dotted" | "double" | "none" | "solid";
  shadowPreset?: "none" | "soft" | "regular" | "retro";
  opacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
  // gradientDirection?: "horizontal" | "vertical" | "diagonal" | "diagonal-reverse";
  gradientDirection?: "diagonal-up-left" | "diagonal-up-right" | "vertical" | "diagonal-down-left" | "diagonal-down-right";
}
const LETTER_SPACING_OPTIONS = [-5, -2, -1, 0, 1, 2, 3, 5, 10, 15, 20];
interface DropdownOption {
  label: string;
  value: string | number;
}

function CustomDropdown({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string | number;
  options: DropdownOption[];
  onChange: (val: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="kd-btn-setting-input kd-btn-setting-dropdown-trigger w-full px-2.5 py-1.5 flex items-center justify-between"
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <ChevronDownIcon
          size={13}
          className={`kd-text-muted shrink-0 ml-1 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="kd-btn-setting-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(String(opt.value));
                setOpen(false);
              }}
              className={`kd-btn-setting-dropdown-option ${String(opt.value) === String(value) ? "kd-btn-setting-dropdown-option-active" : ""
                }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BtnMoreSetting() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);

  const slide = slides[activeSlide];
  const activeElement = slide?.elements.find((el) => el.id === activeElementId);
  const data = activeElement?.data as ExtendedButtonData | undefined;

  const hasGradient = !!(data?.gradientFrom && data?.gradientTo);
  const [fillMode, setFillMode] = useState<"solid" | "gradient">(hasGradient ? "gradient" : "solid");
  const [borderEnabled, setBorderEnabled] = useState(!!(data?.borderWidth && data.borderWidth > 0));
  const textColorInputRef = useRef<HTMLInputElement>(null);
  const BorderColorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);
  const gradientFromRef = useRef<HTMLInputElement>(null);
  const gradientToRef = useRef<HTMLInputElement>(null);



  const patch = (p: Partial<ExtendedButtonData>) => {
    if (!activeElementId) return;
    updateElement(activeElementId, p as Partial<ButtonData>, { history: true });
  };
  if (!data) return null;
  const bgColor = data.backgroundColor ?? "#6d28d9";
  const gradientFrom = data.gradientFrom ?? bgColor;
  const gradientTo = data.gradientTo ?? "#a855f7";
  // const gradientDirection = data.gradientDirection ?? "horizontal";
  const gradientDirection = data.gradientDirection ?? "vertical";
  const textColor = data.textColor ?? "#000000";
  const borderColor = data.borderColor ?? "#000000";
  const borderWidth = data.borderWidth ?? 2;
  const borderRadius = data.borderRadius ?? 8;
  const borderStyle = data.borderStyle ?? "solid";
  const fontSize = data.fontSize ?? 16;
  const fontFamily = data.fontFamily ?? "Geist";
  const fontWeight = (data.fontWeight as number) ?? 400;
  const letterSpacing = data.letterSpacing ?? 0;
  const textTransform = data.textTransform ?? "none";
  const textAlign = data.textAlign ?? "left";
  const verticalAlign = data.verticalAlign ?? "top";
  const opacityVal = (data.opacity ?? 1) * 100;
  const shadowPreset = data.shadowPreset ?? "none";
  const fillPreview =
    fillMode === "gradient"
      ? `linear-gradient(${gradientDirection === "vertical"
        ? "to bottom"
        : gradientDirection === "diagonal-up-left"
          ? "to top left"
          : gradientDirection === "diagonal-up-right"
            ? "to top right"
            : gradientDirection === "diagonal-down-left"
              ? "to bottom left"
              : "to bottom right"
      }, ${gradientFrom}, ${gradientTo})`
      : bgColor;
  return (
    <div className="kd-btn-setting-panel w-full h-full flex flex-col">
      <div className="shrink-0 p-3 pb-0">
        {/* ══ FILL MODE TABS ══ */}
        <div className="flex gap-1 kd-btn-setting-tabs  mb-2">
          <button
            onClick={() => setFillMode("solid")}
            className={`kd-btn-setting-tab rounded-s-md  ${fillMode === "solid" ? "kd-btn-setting-tab-active" : ""}`}
          >
            Solid
          </button>
          <button
            onClick={() => setFillMode("gradient")}
            className={`kd-btn-setting-tab rounded-e-md  ${fillMode === "gradient" ? "kd-btn-setting-tab-active" : ""}`}
          >
            Gradient
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto kd-custom-scrollbar px-3 pb-3">
        {/* ══ FONT ══ */}
        <p className="kd-btn-setting-section-title">Font</p>

        <CustomDropdown
          value={fontFamily}
          options={FONT_FAMILIES.map((f) => ({ label: f, value: f }))}
          onChange={(v) => patch({ fontFamily: v })}
          className="w-full mb-2"
        />

        <div className="flex items-center gap-2 mb-3">
          <CustomDropdown
            value={fontSize}
            options={FONT_SIZES.map((s) => ({ label: `${s}px`, value: s }))}
            onChange={(v) => patch({ fontSize: parseInt(v) })}
            className="flex-1"
          />
          <CustomDropdown
            value={fontWeight}
            options={FONT_WEIGHTS.map((w) => ({ label: w.label, value: w.value }))}
            onChange={(v) => patch({ fontWeight: parseInt(v) })}
            className="flex-1"
          />
        </div>

        {/* align + vertical align icons */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex gap-1 kd-btn-setting-align-btn-container p-1">
            {ALIGN_OPTIONS.map(({ v, Icon }) => (
              <button
                key={v}
                onClick={() => patch({ textAlign: v })}
                className={`kd-btn-setting-align-btn px-3 py-1.5 ${textAlign === v ? "kd-btn-setting-align-btn-active" : ""}`}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>
          <div className="flex kd-btn-setting-align-btn-container p-1">
            {VALIGN_OPTIONS.map(({ v, Icon }) => (
              <button
                key={v}
                onClick={() => patch({ verticalAlign: v })}
                className={`kd-btn-setting-align-btn px-3 py-1.5 ${verticalAlign === v ? "kd-btn-setting-align-btn-active" : ""}`}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>
        </div>


        {/* letter spacing + case (side by side row) */}
        <div className="flex items-start gap-3 py-2">
          <div className="flex-1">
            <span className="kd-btn-setting-label block mb-1.5">Letter Spacing</span>
            <CustomDropdown
              value={letterSpacing}
              options={LETTER_SPACING_OPTIONS.map((v) => ({ label: `${v}%`, value: v }))}
              onChange={(v) => patch({ letterSpacing: parseFloat(v) })}
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <span className="kd-btn-setting-label block mb-1.5">Case</span>
            <div className="flex p-1 kd-btn-setting-align-btn-container">
              {CASE_OPTIONS.map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => patch({ textTransform: v })}
                  className={`kd-btn-setting-case-btn px-2 py-0.5 ${textTransform === v ? "kd-btn-setting-case-btn-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* text color */}

        <div className="space-y-1">
          <span className="kd-btn-setting-label">Text Color</span>
          <div className="Kd-btn-Setting-Select flex py-0.5 items-center justify-between px-3">
            <input
              type="text"
              value={textColor}
              onChange={(e) => {
                const val = e.target.value;
                patch({ textColor: val.startsWith("#") ? val : `#${val}` });
              }}
              className="text-xs bg-transparent outline-none w-full"
            />
            <div
              className="Kd-btn-Setting-Color py-1.5 px-5 cursor-pointer"
              style={{ backgroundColor: textColor }}
              onClick={() => textColorInputRef.current?.click()}
            />
            <input
              ref={textColorInputRef}
              type="color"
              value={textColor}
              onChange={(e) => patch({ textColor: e.target.value })}
              className="bg-transparent outline-none flex-1 min-w-0"
            />
          </div>
        </div>

        <div className="w-full kd-toolPanel-hr-devide-border mt-4 mb-3" />

        {/* ══ FILL ══ */}
        {fillMode === "solid" ? (
          <div className="space-y-1">
            <span className="kd-btn-setting-label">Background Color</span>
            <div className="Kd-btn-Setting-Select flex py-1.5 items-center justify-between px-3">
              <input
                type="text"
                value={bgColor}
                onChange={(e) => {
                  const val = e.target.value;
                  patch({ backgroundColor: val.startsWith("#") ? val : `#${val}` });
                }}
                className="KdbuttonEditSettingHex flex-1 bg-transparent outline-none"
              />
              <div
                className="Kd-btn-Setting-Color py-1.5 px-5 cursor-pointer"
                style={{ backgroundColor: bgColor }}
                onClick={() => bgColorInputRef.current?.click()}
              />
              <input
                ref={bgColorInputRef}
                type="color"
                value={bgColor}
                onChange={(e) => patch({ backgroundColor: e.target.value })}
                className="sr-only"
              />
            </div>
          </div>

        ) : (
          <div className="space-y-1">
            <p className="kd-btn-setting-label">Background Gradient Color</p>

            <div className="kd-btn-edit-seting-bg-gradient-color-Container flex items-center justify-between">
              <div className="kd-btn-setting-labe-gradient-color h-full px-5 py-2.5">From</div>
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1 px-2 py-1 ">
                  <span className="text-xs kd-text-muted">#</span>
                  <input
                    type="text"
                    value={gradientFrom.replace("#", "")}
                    maxLength={6}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                      if (val.length === 6) patch({ gradientFrom: `#${val}` });
                    }}
                    className="text-xs bg-transparent outline-none w-full"
                  />
                </div>
                <div
                  className="Kd-btn-Setting-Color py-1.5 px-5 cursor-pointer"
                  style={{ backgroundColor: gradientFrom }}
                  onClick={() => gradientFromRef.current?.click()}
                />
                <input
                  ref={gradientFromRef}
                  type="color"
                  value={gradientFrom}
                  onChange={(e) => patch({ gradientFrom: e.target.value })}
                  className="bg-transparent  outline-none flex-1 min-w-0"
                />
              </div>
            </div>

            <div className="kd-btn-edit-seting-bg-gradient-color-Container flex items-center justify-between my-1.5">
              <div className="kd-btn-setting-labe-gradient-color h-full px-7 py-2.5">To</div>
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1 px-2 py-1 ">
                  <span className="text-xs kd-text-muted">#</span>
                  <input
                    type="text"
                    value={gradientTo.replace("#", "")}
                    maxLength={6}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9a-fA-F]/g, "");
                      if (val.length === 6) patch({ gradientTo: `#${val}` });
                    }}
                    className="text-xs bg-transparent outline-none w-full"
                  />
                </div>
                <div
                  className="Kd-btn-Setting-Color py-1.5 px-5 cursor-pointer"
                  style={{ backgroundColor: gradientTo }}
                  onClick={() => gradientToRef.current?.click()}
                />
                <input
                  ref={gradientToRef}
                  type="color"
                  value={gradientTo}
                  onChange={(e) => patch({ gradientTo: e.target.value })}
                  className="bg-transparent  outline-none flex-1 min-w-0"
                />
              </div>
            </div>
           
            <div className="kd-btn-edit-seting-bg-gradient-color-Container flex items-center justify-between">
              <div className="kd-btn-setting-labe-gradient-color h-full px-2 py-2.5">Direction</div>
              <div className="flex items-center justify-between flex-1 mx-3 ">
                {DIRECTION_OPTIONS.map(({ v, Icon }) => (
                  <button
                    key={v}
                    onClick={() => patch({ gradientDirection: v })}
                    className={`kd-btn-setting-direction-btn flex items-center w-8 h-6 justify-center px-1.5 py-1 min-w-2.5 ${gradientDirection === v ? "kd-btn-setting-direction-btn-active" : ""
                      }`}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>
            <div className="kd-btn-setting-gradient-preview py-3 w-full my-2.5" style={{ background: fillPreview }} />
          </div>
        )}


        {/* ══ BORDER ══ */}
        <div className="flex items-center justify-between py-2">
          <span className="kd-btn-setting-label">Border</span>
          <button
            onClick={() => {
              setBorderEnabled(!borderEnabled);
              patch({ borderWidth: !borderEnabled ? borderWidth || 2 : 0 });
            }}
            className={`kd-btn-setting-toggle ${borderEnabled ? "kd-btn-setting-toggle-on" : ""}`}
          >
            <span className="kd-btn-setting-toggle-thumb" />
          </button>
        </div>

        {borderEnabled && (
          <div className="kd-btn-setting-border-box p-2 mb-3">
            <div className="items-center justify-between pb-2">
              <span className="kd-btn-setting-label">Border Color</span>

              <div className="Kd-btn-Setting-Select flex py-0.5 items-center justify-between px-3">
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    patch({ borderColor: val.startsWith("#") ? val : `#${val}` });
                  }}
                  className="text-xs bg-transparent outline-none w-full"
                />
                <div
                  className="Kd-btn-Setting-Color py-1.5 px-5 cursor-pointer"
                  style={{ backgroundColor: borderColor }}
                  onClick={() => BorderColorInputRef.current?.click()}
                />
                <input
                  ref={BorderColorInputRef}
                  type="color"
                  value={borderColor}
                  onChange={(e) => patch({ borderColor: e.target.value })}
                  className=" bg-transparent outline-none flex-1 min-w-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1">
                <p className="kd-btn-setting-label mb-1">Width</p>
                <div className="kd-btn-setting-input flex items-center w-full overflow-hidden">
                  <input
                    type="number"
                    value={borderWidth}
                    onChange={(e) => patch({ borderWidth: parseFloat(e.target.value) || 0 })}
                    className="flex-1 text-xs text-center bg-transparent outline-none px-1 py-1.5 w-0"
                  />
                  {/* <div className="flex flex-col border-l kd-btn-more-setting-border">
                    <button onClick={() => patch({ borderWidth: Math.min(50, borderWidth + 1) })} className="px-1 hover:kd-bg-hover">
                      <ChevronUp size={10} className="kd-text-muted" />
                    </button>
                    <button
                      onClick={() => patch({ borderWidth: Math.max(0, borderWidth - 1) })}
                      className="px-1 hover:kd-bg-hover border-t kd-btn-more-setting-border"
                    >
                      <ChevronDown size={10} className="kd-text-muted" />
                    </button>
                  </div> */}
                </div>
              </div>
              <div className="flex-1">
                <p className="kd-btn-setting-label mb-1">Line Style</p>
                <CustomDropdown
                  value={borderStyle}
                  options={LINE_STYLES}
                  onChange={(v) =>
                    patch({
                      borderStyle: v as ExtendedButtonData["borderStyle"],
                      strokeStyle: v as ButtonData["strokeStyle"],
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-full kd-toolPanel-hr-devide-border mb-2" />


        {/* ══ OPACITY + CORNER ══ */}

        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1">
            <p className="kd-btn-setting-label mb-1">Opacity</p>
            <div className="kd-btn-setting-input flex items-center w-full overflow-hidden">
              <input
                type="number"
                min={0}
                max={100}
                value={Math.round(opacityVal)}
                onChange={(e) => patch({ opacity: parseInt(e.target.value) / 100 })}
                className="flex-1 text-xs text-center bg-transparent outline-none px-1 py-1.5 w-0"
              />
            </div>

          </div>
          <div className="flex-1">
            <p className="kd-btn-setting-label mb-1">Corner Rounded</p>
            <CustomDropdown
              value={borderRadius}
              options={BORDER_RADIUS_OPTIONS.map((r) => ({
                label: r === 999 ? "Full" : `${r}px`,
                value: r,
              }))}
              onChange={(v) => patch({ borderRadius: parseInt(v) })}
              className="w-full"
            />
          </div>
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mb-2" />

        {/* ══ SHADOW ══ */}
        <p className="kd-btn-setting-section-title">Shadow</p>
        <div className="grid grid-cols-4 gap-1.5 mb-1">
          {SHADOW_PRESETS.map(({ label, value, shadow }) => (
            <button
              key={label}
              onClick={() => patch({ shadowPreset: value })}
              className={`kd-btn-setting-shadow-btn ${shadowPreset === value ? "kd-btn-setting-shadow-btn-active" : ""}`}
            >
              <span className="kd-btn-setting-shadow-swatch" style={{ boxShadow: shadow }} />
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}