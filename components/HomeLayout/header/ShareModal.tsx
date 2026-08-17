"use client";
import Image from 'next/image'
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
// generateSlidesZip is imported lazily in handleZip — a static import puts
// jszip, file-saver and html-to-image in the initial bundle for a rare click.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faDownload } from '@fortawesome/free-solid-svg-icons'
import clsx from "clsx";

/* ---------------- TYPES ---------------- */

interface ShareModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}



export default function ShareModal({ open, setOpen }: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const slides = useEditorStore((s) => s.slides);
  // const { setImageExportMode } = useEditorUIStore.getState();

  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  /* ---------- EXPORT HANDLERS ---------- */
  const startLoading = (key: string) => {
    setLoadingItems((prev) => [...prev, key]);
  };

  const stopLoading = (key: string) => {
    setLoadingItems((prev) => prev.filter((item) => item !== key));
  };

  const handlePpt = async () => {
    try {
      startLoading("ppt");
      const res = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      if (!res.ok) throw new Error("Failed to generate PPT");

      const data = await res.json();

      const a = document.createElement("a");
      a.href = data.url;
      a.download = "presentation.pptx";

      a.click();
    } catch (err) {
      console.error("PPT download error:", err);
    } finally {
      stopLoading("ppt");
    }
  };

  const handlePdf = async () => {
    try {
      startLoading("pdf");

      // const res = await fetch("/api/generate-pdf", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ slides }),
      // });

      const res = await fetch(
        "https://uz290192ig.execute-api.us-east-1.amazonaws.com/default/kd-pdf-generator-lambda",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slides,
            apiKey: "kdf3Ewo3hsfm8@hEb1",
          }),
        }
      );



      const a = document.createElement("a");
      const data = await res.json();
      a.href = data.url;
      a.download = ".pdf";
      a.click();
    } finally {
      stopLoading("pdf");
    }
  };

  const handleZip = async () => {
    try {
      startLoading("pngs");
      const { generateSlidesZip } = await import(
        "@/lib/outputGenerateLibrary/generateZip"
      );
      await generateSlidesZip();
    } finally {
      stopLoading("pngs");
    }
  };

  const handlejson = async () => {
    try {
      startLoading("json");
      const jsonData = JSON.stringify({ slides }, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Template.json";
      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("JSON export error:", err);
    } finally {
      stopLoading("json");
    }
  };

  /* ---------- OUTSIDE CLICK ---------- */

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  if (!open) return null;

  /* ---------- UI ---------- */

  return (
    <div className="playfair.className kd-export-window-black  fixed inset-0 z-9999 flex items-center justify-center  ">
      <div
        ref={modalRef}
        className="w-full max-w-xl kd-export-container rounded-2xl shadow-xl p-6 animate-[fadeIn_0.2s_ease]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Export
          </h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5 " />
          </button>
        </div>
        <div className="h-px w-full mt-2" />
        {/* OPTIONS */}
        <div className="mt-3 space-y-3">
          <ExportItem
            icon={"https://kd-presentation-editor.s3.us-east-1.amazonaws.com/File/icons/Pdf.png"}
            label="Export To PDF"
            onClick={handlePdf}
            active={loadingItems.includes("pdf")} />

          <ExportItem
            icon={"https://kd-presentation-editor.s3.us-east-1.amazonaws.com/File/icons/Ppt.png"}
            label="Export To PowerPoint"
            onClick={handlePpt}
            active={loadingItems.includes("ppt")}
          />

          <ExportItem
            icon={"https://kd-presentation-editor.s3.us-east-1.amazonaws.com/File/icons/iamge.png"}
            label="Export as PNGs"
            onClick={handleZip}
            active={loadingItems.includes("pngs")}
          />


          <ExportItem
            icon={"https://kd-presentation-editor.s3.us-east-1.amazonaws.com/File/icons/iamge.png"}
            label="Export as Json"
            onClick={handlejson}
            active={loadingItems.includes("json")}
          />

          {/* <ExportItem
            icon={<Images className="text-indigo-500" />}
            label="Export Current Slide (PNG)"
            onClick={handleCurrentSlideImage}
            active={loadingItem === "current-png"}
          /> */}
        </div>
      </div>
    </div>
  );
}


function ExportItem({
  icon,
  label,
  onClick,
  active,
  // loading,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "kd-export-item",
        // active && "kd-export-item-active"
      )}
    >
      {/* LEFT SIDE (ICON AREA) */}
      <div className="kd-export-left">
        <div className="kd-export-icon">
          <Image
            src={icon}
            width={42}
            height={42}
            unoptimized
            alt="export icon"
          />
        </div>
      </div>

      {/* RIGHT SIDE (CONTENT AREA) */}
      <div className="kd-export-content">
        <span className="kd-export-label">{label}</span>

        <button
          className="kd-export-btn"
        // onClick={(e) => e.stopPropagation()}
        >
          {active ? (
            <>
              Download...
              <FontAwesomeIcon
                className="animate-spin"
                icon={faCircleNotch}
              />
            </>
          ) : (
            <>
              Download
              <FontAwesomeIcon icon={faDownload} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}