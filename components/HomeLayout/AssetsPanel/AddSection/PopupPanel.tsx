// "use client";
// import React, { useEffect, useRef } from "react";
// import useEditorStore from "@/app/Store/editorStore";
// import AddTextPanel from "@/blocks/Text/components/AddTextPanel";
// import AddImagePanel from "@/blocks/Image/components/AddImagePanel";
// // import AddTemplate from "./AddTemplate";
// import PexelImage from "@/blocks/Image/components/PexelImage";
// // import Elements from "./Elements";
// import AiImage from "@/blocks/Image/components/AiImage";
// import UploadImage from "@/blocks/Image/components/uploadImage";
// import SubtitleSlideEditor from "./subtitleEditToolbar";
// import ImageReplacePanel from "@/blocks/Image/sidebar/ImageReplacePanel";
// import AddButtonPanel from "@/blocks/Button/components/AddButtonPanel";
// import AddElementPanel from "./AddElementPanel";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
// // import AiSlideUpdate from "../../../AiSlideUpdate";
// import AddVideoPanel from "@/blocks/Video/components/AddVideoPanel";
// import VideoReplacePanel from "@/blocks/Video/sidebar/VideoReplacePanel";

// const PopupPanel = () => {
//   const active = useEditorStore((s) => s.activeRightPanel);
//   const setActive = useEditorStore((s) => s.setActiveRightPanel);
//   const panelRef = useRef<HTMLDivElement>(null);


//   useEffect(() => {
//     if (!active) return;

//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         panelRef.current &&
//         !panelRef.current.contains(e.target as Node)
//       ) {
//         setActive(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [active, setActive]);



//   // console.log("active panel:", active);
//   if (!active) return null;

//   return (
//     <div
//       ref={panelRef}

//       className="
//       kd-popup-main-container
//       fixed 
//        right-19
//        top-1/2
//       -translate-y-1/2
//       w-80 max-h-[83vh]
//       rounded-xl
//       overflow-hidden
//       z-9999
//     "
//       onMouseDown={(e) => e.stopPropagation()}
//     >
//       <div
//         className="kd-popup-header flex items-center justify-between px-4 py-3"
//       >
//         <h2
//           className="text-base font-semibold capitalize kd-text-primary"
//         >

//           {active === "text" && "Text Style"}
//           {active === "image" && "Images"}
//           {active === "template" && "template"}
//           {active === "Elements" && "Elements"}
//           {active === "SubtitleTool" && "Agent Narration Content"}
//           {active === "imageReplacePanel" && "Image Replace"}
//           {active === "AddButtonPanel" && "Button Library"}
//           {active === "AddElementPanel" && "Element Library"}
//           {active === "AddVideoPanel" && "Videos"}
//           {active === "VideoReplacePanel" && "Video Replace"}
//         </h2>
//         <button
//           onClick={() => setActive(null)}
//           className="kd-popup-close w-7 h-7 rounded-md flex items-center justify-center transition-colors"
//         >
//           <FontAwesomeIcon icon={faXmark} />
//         </button>
//       </div>

//       {/* CONTENT */}
//       <div
//         // className="p-4 overflow-y-auto max-h-[70vh] space-y-6"
//         className="max-h-[80vh] "
//       >
//         {active === "text" && <AddTextPanel />}
//         {active === "image" && <AddImagePanel />}
//         {/* {active === "template" && <AddTemplate />} */}
//         {active === "PexelImage" && <PexelImage />}
        
//         {/* {active === "Elements" && <Elements />} */}

//         {active === "AiImage" && <AiImage />}
//         {active === "UploadImage" && <UploadImage />}
//         {active === "SubtitleTool" && <SubtitleSlideEditor />}
//         {active === "imageReplacePanel" && <ImageReplacePanel />}
//         {active === "AddButtonPanel" && <AddButtonPanel />}
//         {active === "AddElementPanel" && <AddElementPanel />}
//         {/* {active === "AiSlideUpdate" && <AiSlideUpdate />} */}
//         {active === "AddVideoPanel" && <AddVideoPanel />}
//         {active === "VideoReplacePanel" && <VideoReplacePanel />}
//       </div>
//     </div>
//   );
// };

// export default PopupPanel;
