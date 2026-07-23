import React, { useCallback, useEffect, useRef, useState } from "react";
import ShareModal from "./ShareModal";
import useEditorStore from "../../../app/Store/editorStore";
import useProjectInfoStore from "../../../app/Store/projectInfoStore";
// import { getFirstSlideImage } from "@/lib/outputGenerateLibrary/getFirstSlideImage";
// import { getFirstSlideRef } from "@/lib/outputGenerateLibrary/slideRefRegistry";
import Image from 'next/image'
// import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  // const { setImageExportMode } = useEditorUIStore.getState();
  const [open, setOpen] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const slides = useEditorStore((s) => s.slides);

  const id = useProjectInfoStore((s) => s.id);
  const token = useProjectInfoStore((s) => s.token);
  const api_url = useProjectInfoStore((s) => s.api_url);
  const ppt_name = useProjectInfoStore((s) => s.name);


  const setName = useProjectInfoStore((s) => s.setName);
  const handleEditTitle = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(titleRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  };


  const handleSaveTitle = async () => {
    const newTitle = titleRef.current?.innerText?.trim() || "";
    setIsEditingTitle(false);
    if (!newTitle || newTitle === ppt_name) return;
    setName(newTitle);
    try {
      const formData = new FormData();
      formData.append("access_token", token || "");
      formData.append("id", id || "");
      formData.append("title", newTitle);
      const res = await fetch(`${api_url}sl_editor_video_title_update`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Title update failed");
    } catch (err) {
      console.error("Title update error:", err);
      setName(ppt_name || "");
      if (titleRef.current) titleRef.current.innerText = ppt_name || "";
    }
  };
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleRef.current?.blur();
    }
    if (e.key === "Escape") {
      if (titleRef.current) titleRef.current.innerText = ppt_name || "";
      setIsEditingTitle(false);
      titleRef.current?.blur();
    }
  };




  const showLoader = () => {
    window.parent.postMessage({ type: "LOADER_ON" }, "*");
  };

  const hideLoader = () => {
    window.parent.postMessage({ type: "LOADER_OFF" }, "*");
  };



  const handlePublish = async () => {
    try {
      showLoader();

      // const slideEl = getFirstSlideRef();
      // if (!slideEl) {
      //   throw new Error("First slide not found");
      // }
      // setImageExportMode(true);
      // const [pptData, thumbnailBase64] = await Promise.all([

      //   fetch("/api/generate-ppt", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ slides }),
      //   }).then((res) => {
      //     if (!res.ok) throw new Error("PPT generation failed");
      //     return res.json();
      //   }),


      //   getFirstSlideImage(slideEl),
      // ]);
      // setImageExportMode(false);
      // const thumbnailBlob = await fetch(thumbnailBase64).then((r) => r.blob());
      const slidesForUpload = {
        slides: slides.map((sl) => ({
          id: sl.id,
          height: sl.height,
          width: sl.width,
          background: sl.background,
          subtitle_url: sl.subtitle_url || "",
          subtitle_text: sl.subtitle_text || "",
          subtitle_json: sl.subtitle_json || "",
          thumbnail: sl.thumbnail || "",

          elements: sl.elements.map((el) => ({
            id: el.id,
            data: el.data
          }))

        }))
      };
      // console.log("ID:", id);
      // console.log("TOKEN:", token);
      // 🔹 prepare upload
      const formData = new FormData();
      formData.append("id", id || "");
      formData.append("access_token", token || "");
      formData.append("name", "");
      // formData.append("thumbnail", thumbnailBlob, "thumbnail.png");
      // formData.append("thumbnail", "thumbnail.com");
      formData.append("json", JSON.stringify(slidesForUpload));
      // formData.append("ppt_file", pptData.url);
      // formData.append("ppt_file", "ppt_file.demo.com");

      // console.log("⬆ Uploading everything together...");

      const uploadRes = await fetch(
        `${api_url}sl_editor_json_ppt_upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      if (uploadData.status === 1) {
        window.parent.postMessage(
          {
            type: "PUBLISH_CLICKED",
          },
          "*"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Publish Failed!");
    } finally {
      hideLoader();
    }
  };


  const autoSave = useCallback(async () => {
    try {
      const slidesForUpload = {
        slides: slides.map((sl) => ({
          id: sl.id,
          height: sl.height,
          width: sl.width,
          background: sl.background,
          subtitle_url: sl.subtitle_url || "",
          subtitle_text: sl.subtitle_text || "",
          subtitle_json: sl.subtitle_json || "",
          thumbnail: sl.thumbnail || "",

          elements: sl.elements.map((el) => ({
            id: el.id,
            data: el.data
          }))
        }))
      };
      const formData = new FormData();

      formData.append("id", id || "");
      formData.append("access_token", token || "");
      formData.append("json", JSON.stringify(slidesForUpload));

      await fetch(`${api_url}sl_editor_json_auto_save_upload`, {
        method: "POST",
        body: formData,
      });

      console.log("Auto saved");
    } catch (error) {
      console.error("Auto save failed:", error);
    }
  }, [slides, id, token, api_url]);

  useEffect(() => {
    const interval = setInterval(autoSave, 60000);
    return () => clearInterval(interval);
  }, [autoSave]);






  return (
    <header className="kd-header relative w-full h-full flex items-center justify-between px-4.5">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="kd-header-logo w-8 h-8 rounded-lg flex items-center justify-center">
          <a
          >
            <Image
              src={`${api_url}app/assets/images/favicon.png`}
              width={10}
              height={10}
              alt=""
              unoptimized
            />
          </a>
        </div>
      </div>



      <div>
        {/* <CanvasSizeSelector /> */}
      </div>

      {/* 
      <div
        className="kd-header-text-box absolute left-1/2 -translate-x-1/2 px-3 py-[5px] rounded-sm lg:text-[10px] md:text-[10px] text-[10px] font-semibold kd-glass-title kd-font-jakarta whitespace-nowrap"
      >
        <p className=" ">{ppt_name ?? "Foundations of Information Technology"}</p>
      </div> */}

      <div className="kd-header-text-box absolute left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-sm lg:text-[12px] md:text-[10px] text-[10px] font-semibold kd-glass-title kd-font-jakarta whitespace-nowrap flex items-center gap-1.5 group">
        <span
          ref={titleRef}
          contentEditable={isEditingTitle}
          suppressContentEditableWarning
          onKeyDown={handleTitleKeyDown}
          className={`outline-none min-w-44 ${isEditingTitle ? " pb-px cursor-text" : "cursor-default"}`}
        >
          {ppt_name ?? "Foundations of Information Technology"}
        </span>

        {!isEditingTitle && (
          <button
            onClick={handleEditTitle}
            title="Edit title"
            className="transition-opacity duration-150 flex items-center justify-center "
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}



        {isEditingTitle && (
          <button
            onClick={handleSaveTitle}
            title="Edit title"
            className="transition-opacity duration-150 flex items-center justify-center text-white"
          >
            <MdOutlineDownloadDone className="h-4 w-4" />

          </button>
        )}


      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => router.push("/preview")}
          className="kd-header-action-btn kd-header-btn kd-font-jakarta"
        >
          Preview
        </button>
        <button onClick={undo} className="kd-header-btn kd-header-icon-btn">
          <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
            <path
              d="M3.59067 1.70083H6.42539C7.62829 1.70083 8.78193 2.17868 9.63251 3.02926C10.4831 3.87984 10.9609 5.03347 10.9609 6.23638C10.9609 7.43928 10.4831 8.59291 9.63251 9.44349C8.78193 10.2941 7.62829 10.7719 6.42539 10.7719H1.13392V8.50415H6.42539C7.02684 8.50415 7.60366 8.26523 8.02895 7.83993C8.45424 7.41465 8.69316 6.83783 8.69316 6.23638C8.69316 5.63493 8.45424 5.05811 8.02895 4.63282C7.60366 4.20753 7.02684 3.9686 6.42539 3.9686H3.59067V5.66943L0 2.83472L3.59067 0V1.70083Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button onClick={redo} className="kd-header-btn kd-header-icon-btn">
          <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
            <path
              d="M7.37026 1.70083H4.53555C3.33264 1.70083 2.17901 2.17868 1.32843 3.02926C0.477851 3.87984 0 5.03347 0 6.23638C0 7.43928 0.477851 8.59291 1.32843 9.44349C2.17901 10.2941 3.33264 10.7719 4.53555 10.7719H9.82702V8.50415H4.53555C3.9341 8.50415 3.35728 8.26523 2.93199 7.83993C2.5067 7.41465 2.26777 6.83783 2.26777 6.23638C2.26777 5.63493 2.5067 5.05811 2.93199 4.63282C3.35728 4.20753 3.9341 3.9686 4.53555 3.9686H7.37026V5.66943L10.9609 2.83472L7.37026 0V1.70083Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {(token === "GAoWFzwbAUldXxsYChoLBgEWKwIBRF9B" ||
        token === "GAoWFzwbAUlTXxsYChoLBgEWKwIBRFtO" ||
          token === "GAoWFzwbAUlYXxsYChoLBgEWKwIBRF9N") && (
            <button
              onClick={() => setOpen(true)}
              className="kd-header-action-btn kd-header-btn kd-font-jakarta"
            >
              Export
              <svg width="13" height="13" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_868_26825)">
                  <path d="M6.00195 1.33374C6.00195 0.96481 5.70389 0.666748 5.33496 0.666748C4.96603 0.666748 4.66797 0.96481 4.66797 1.33374V6.39246L3.13806 4.86255C2.87751 4.602 2.45439 4.602 2.19384 4.86255C1.9333 5.12309 1.9333 5.54621 2.19384 5.80676L4.86181 8.47473C5.12236 8.73527 5.54548 8.73527 5.80602 8.47473L8.47399 5.80676C8.73454 5.54621 8.73454 5.12309 8.47399 4.86255C8.21345 4.602 7.79033 4.602 7.52978 4.86255L6.00195 6.39246V1.33374ZM1.33301 8.00366C0.597232 8.00366 -0.000976562 8.60187 -0.000976562 9.33765V10.0046C-0.000976562 10.7404 0.597232 11.3386 1.33301 11.3386H9.33691C10.0727 11.3386 10.6709 10.7404 10.6709 10.0046V9.33765C10.6709 8.60187 10.0727 8.00366 9.33691 8.00366H7.2213L6.27709 8.94787C5.756 9.46896 4.91184 9.46896 4.39075 8.94787L3.44862 8.00366H1.33301ZM9.00342 9.1709C9.13609 9.1709 9.26333 9.2236 9.35714 9.31742C9.45096 9.41123 9.50366 9.53847 9.50366 9.67114C9.50366 9.80382 9.45096 9.93105 9.35714 10.0249C9.26333 10.1187 9.13609 10.1714 9.00342 10.1714C8.87074 10.1714 8.74351 10.1187 8.64969 10.0249C8.55588 9.93105 8.50317 9.80382 8.50317 9.67114C8.50317 9.53847 8.55588 9.41123 8.64969 9.31742C8.74351 9.2236 8.87074 9.1709 9.00342 9.1709Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_868_26825">
                    <rect width="10.6719" height="10.6719" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}

        <ShareModal open={open} setOpen={setOpen} />
        <button
          onClick={handlePublish}
          className="kd-header-action-btn kd-header-btn kd-font-jakarta"
        >
          Save & Next
        </button>

      </div>
    </header>
  )
}
export default Header;
