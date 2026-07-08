// "use client";
// import React, { useRef, useEffect } from "react";
// import Cropper, { ReactCropperElement } from "react-cropper";
// import useEditorStore, { ImageData } from "@/app/Store/editorStore";
// import useEditorUIStore from "@/app/Store/useEditorUIStore";


// const injectCSS = () => {
//   if (typeof window === "undefined") return;
//   if (document.getElementById("cropperjs-css")) return;
//   const link  = document.createElement("link");
//   link.id     = "cropperjs-css";
//   link.rel    = "stylesheet";
//   link.href   = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css";
//   document.head.appendChild(link);
// };


// export const cropperControls = {
//   setRatio:       (ratio: number) => { void ratio; },
//   getCroppedBlob: (): Promise<Blob | null> => Promise.resolve(null),
// };

// const ImageCropOverlay: React.FC = () => {
//   const cropElementId = useEditorUIStore((s) => s.cropElementId);
//   const slides        = useEditorStore((s) => s.slides);
//   const activeSlide   = useEditorStore((s) => s.activeSlide);
//   const cropperRef    = useRef<ReactCropperElement>(null);

 
//   useEffect(() => {
//     injectCSS();
//   }, []);

//   const element = slides[activeSlide]?.elements.find(
//     (el) => el.id === cropElementId
//   );
//   const imgData = element?.data as ImageData | undefined;

//   if (!imgData) return null;

//   const handleReady = () => {
//     const cropper = cropperRef.current?.cropper;
//     if (!cropper) return;

//     cropperControls.setRatio = (ratio: number) => {
//       cropper.setAspectRatio(ratio);
//     };

//     cropperControls.getCroppedBlob = (): Promise<Blob | null> =>
//       new Promise((resolve) => {
//         const canvas = cropper.getCroppedCanvas({
//           imageSmoothingEnabled: true,
//           imageSmoothingQuality: "high",
//         });
//         if (!canvas) return resolve(null);
//         canvas.toBlob((blob: Blob | null) => resolve(blob), "image/png");
//       });
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         width:    "100%",
//         height:   "100%",
//         zIndex:   1000,
//       }}
//     >
//       <Cropper
//         ref={cropperRef}
//         src={imgData.src}
//         style={{
//           width:  "100%",
//           height: "100%",
//           display: "block",
//         }}
//         dragMode="move"
//         autoCrop
//         autoCropArea={1}
//         background={false}
//         responsive
//         restore={false}
//         cropBoxMovable
//         cropBoxResizable
//         toggleDragModeOnDblclick={false}
//         viewMode={1}
//         crossOrigin="anonymous"
//         ready={handleReady}
//       />
//     </div>
//   );
// };

// export default ImageCropOverlay;


"use client";
import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import useEditorStore, { ImageData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

const injectCSS = () => {
  if (typeof window === "undefined") return;
  if (document.getElementById("cropperjs-css")) return;
  const link  = document.createElement("link");
  link.id     = "cropperjs-css";
  link.rel    = "stylesheet";
  link.href   = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css";
  document.head.appendChild(link);
};

// Inject once at module level — useEffect nahi chahiye
if (typeof window !== "undefined") injectCSS();

export const cropperControls = {
  setRatio:       (_ratio: number) => {},
  getCroppedBlob: (): Promise<Blob | null> => Promise.resolve(null),
};

const ImageCropOverlay: React.FC = () => {
  const cropElementId    = useEditorUIStore((s) => s.cropElementId);
  const setCropElementId = useEditorUIStore((s) => s.setCropElementId);
  const slides           = useEditorStore((s) => s.slides);
  const activeSlide      = useEditorStore((s) => s.activeSlide);

  const cropperRef = useRef<ReactCropperElement>(null);

  // ✅ Key trick — cropElementId change hone pe naya Cropper mount hoga
  // isReady sirf is mount ke liye track karta hai
  const [isReady, setIsReady] = useState(false);

  const element = slides[activeSlide]?.elements.find(
    (el) => el.id === cropElementId
  );
  const imgData = element?.data as ImageData | undefined;

  if (!imgData) return null;

  const handleReady = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropperControls.setRatio = (ratio: number) => {
      cropper.setAspectRatio(ratio);
    };

    cropperControls.getCroppedBlob = (): Promise<Blob | null> =>
      new Promise((resolve) => {
        const canvas = cropper.getCroppedCanvas({
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });
        if (!canvas) return resolve(null);
        canvas.toBlob(
          (blob: Blob | null) => resolve(blob),
          "image/png"
        );
      });

    // ✅ Event handler mein setState — safe hai, no cascading render
    setIsReady(true);
  };

  return (
    <div
      style={{
        position: "relative",
        width:    "100%",
        height:   "100%",
        zIndex:   1000,
      }}
    >
      {/* ── Loader — ready hone tak ── */}
      {!isReady && (
        <div
          style={{
            position:        "absolute",
            inset:           0,
            zIndex:          10,
            display:         "flex",
            flexDirection:   "column",
            alignItems:      "center",
            justifyContent:  "center",
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius:    4,
            gap:             10,
            pointerEvents:   "none",
          }}
        >
          <div
            style={{
              width:        32,
              height:       32,
              border:       "3px solid rgba(255,255,255,0.25)",
              borderTop:    "3px solid #fff",
              borderRadius: "50%",
              animation:    "kd-spin 0.7s linear infinite",
            }}
          />
          <span style={{ color: "#fff", fontSize: 12, opacity: 0.85 }}>
            Loading crop...
          </span>
          <style>{`
            @keyframes kd-spin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* ── Close button ── */}
      <button
        onClick={() => setCropElementId(null)}
        title="Close crop"
        style={{
          position:       "absolute",
          top:            -36,
          right:          0,
          zIndex:         20,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          28,
          height:         28,
          borderRadius:   6,
          background:     "rgba(0,0,0,0.65)",
          border:         "none",
          cursor:         "pointer",
          color:          "#fff",
          fontSize:       16,
          lineHeight:     "1",
        }}
      >
        ✕
      </button>

      {/* ── Cropper — key={cropElementId} ensures fresh mount ── */}
      <Cropper
        key={cropElementId ?? "crop"}   // ✅ cropElementId change = fresh component
        ref={cropperRef}
        src={imgData.src}
        style={{
          width:      "100%",
          height:     "100%",
          display:    "block",
          opacity:    isReady ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        dragMode="move"
        autoCrop
        autoCropArea={1}
        background={false}
        responsive
        restore={false}
        cropBoxMovable
        cropBoxResizable
        toggleDragModeOnDblclick={false}
        viewMode={1}
        crossOrigin="anonymous"
        ready={handleReady}
      />
    </div>
  );
};

export default ImageCropOverlay;