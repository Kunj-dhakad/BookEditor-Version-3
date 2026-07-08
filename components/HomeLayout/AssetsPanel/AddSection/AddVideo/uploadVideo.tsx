// import React, { useRef, useState, useEffect } from "react";
// import useEditorStore from "@/app/Store/editorStore";
// import useProjectInfoStore from "@/app/Store/projectInfoStore";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner, faTrash, faPlay } from "@fortawesome/free-solid-svg-icons";
// import Image from "next/image";
// import { KdMediaUpladIcon, KdMediaUploadLinkIcon } from "@/lib/icon/icons";

// interface UploadedVideo {
//     id: string;
//     image_url?: string;
//     url?: string;
//     thumbnail_url?: string;
//     height?: number;
//     width?: number;
// }

// const UploadVideo: React.FC<{ Addtype?: string }> = ({ Addtype }) => {
//     const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [listLoading, setListLoading] = useState(true);
//     const [refreshlist, setRefreshlist] = useState(false);
//     const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
//     const [isDragOver, setIsDragOver] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const addElement = useEditorStore((s) => s.addElement);
//     const selectedId = useEditorStore((s) => s.activeElementId);
//     const updateElement = useEditorStore((s) => s.updateElement);
//     const token = useProjectInfoStore((s) => s.token);
//     const api_url = useProjectInfoStore((s) => s.api_url);
//     const { slides, activeSlide } = useEditorStore();
//     const canvasWidth = slides[activeSlide]?.width;
//     const canvasHeight = slides[activeSlide]?.height;
//     const defaultX = canvasWidth ? canvasWidth / 2 : 100;
//     const defaultY = canvasHeight ? canvasHeight / 2 : 100;
//   const [VideoUrlInput, setVideoUrlInput] = useState("");
//   const [urlLoading, setUrlLoading] = useState(false);
//     const addVideoToCanvas = (src: string, height: number, width: number) => {
//         if (!src) return;

//         const maxWidth = canvasWidth || 300;
//         const maxHeight = canvasHeight || 200;
//         const scale = Math.min(maxWidth / width, maxHeight / height);
//         const newWidth = width * scale;
//         const newHeight = height * scale;

//         if (Addtype === "replace") {
//             if (!selectedId) return;
//             updateElement(selectedId, { src });
//             return;
//         }

//         addElement({
//             type: "video",
//             src,
//             x: defaultX - newWidth / 2,
//             y: defaultY - newHeight / 2,
//             width: newWidth,
//             height: newHeight,
//             rotation: 0,
//             opacity: 1,
//             zIndex: 1,
//             stroke: "",
//             strokeWidth: 0,
//             borderRadius: "0",
//             offsetX: 0,
//             offsetY: 0,
//             color: "rgba(0,0,0,0)",
//             isDragging: false,
//             animationType: "None",
//         });
//     };

//     useEffect(() => {
//         const fetchVideos = async () => {
//             setListLoading(true);
//             try {
//                 const formData = new FormData();
//                 formData.append("access_token", token || "");
//                 const res = await fetch(`${api_url}sl_editor_video_listing`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const data = await res.json();
//                 setUploadedVideos(data?.result || []);
//             } catch (err) {
//                 console.error("List Error:", err);
//             } finally {
//                 setListLoading(false);
//             }
//         };

//         fetchVideos();
//     }, [token, api_url, refreshlist]);

//     const uploadFile = async (file: File) => {
//         if (!file.type.startsWith("video/")) {
//             alert("Please upload a video file (mp4, webm, etc.)");
//             return;
//         }

//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("video", file);
//             formData.append("access_token", token || "");

//             const res = await fetch(`${api_url}sl_editor_video_upload`, {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await res.json();
//             console.log("Video Uploaded:", data);

//             setRefreshlist((prev) => !prev);
//         } catch (err) {
//             console.error("Upload Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragOver(false);
//         const file = e.dataTransfer.files?.[0];
//         if (!file) return;
//         uploadFile(file);
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragOver(true);
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragOver(false);
//     };

//     const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         uploadFile(file);
//         e.target.value = "";
//     };

//     const deleteVideo = async (id: string) => {
//         try {
//             const formData = new FormData();
//             formData.append("access_token", token || "");
//             formData.append("video_id", id);

//             await fetch(`${api_url}uploadVideoDelete`, {
//                 method: "POST",
//                 body: formData,
//             });

//             setRefreshlist((prev) => !prev);
//         } catch (err) {
//             console.error("Delete Error:", err);
//         }
//     };

//     return (
//         <div className="flex flex-col px-2">
//             <div className="kd-media-upload-card">
//                 <div className="kd-media-upload-header">
//                     {KdMediaUpladIcon(18, 18)}
//                     <h3 className="kd-media-upload-title">Upload Video</h3>
//                 </div>

//                 <input
//                     ref={fileInputRef}
//                     type="file"
//                      accept="video/mp4, video/webm, .mp4, .webm"
//                     className="hidden"
//                     onChange={handleUpload}
//                 />

//                 <p className="kd-media-upload-subtitle">
//                     Upload a video file from your device.
//                 </p>

//                 <div
//                     className={`kd-media-upload-dropbox ${isDragOver ? "kd-media-upload-dragover" : ""}`}
//                     onClick={() => fileInputRef.current?.click()}
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                 >
//                     <div className="kd-media-upload-main-icon">
//                         {loading ? (
//                             <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
//                         ) : (
//                             KdMediaUpladIcon(30, 30)
//                         )}
//                     </div>

//                     <p className="kd-media-upload-drop-text">
//                         {loading ? "Uploading..." : "Drag & drop a video here"}
//                     </p>

//                     <p className="kd-media-upload-file-info">
//                         MP4, WebM up to 10MB
//                     </p>
                    
//                 </div>


//  <div className="kd-media-upload-divider">
//           <span />
//           <p>OR</p>
//           <span />
//         </div>

//         <div className="kd-media-upload-url-label">
//           <KdMediaUploadLinkIcon />
//           <label>Paste video URL</label>
//         </div>

//         <input
//           type="text"
//           className="kd-media-upload-url-input"
//           placeholder="https://example.com/video.mp4"
//           value={VideoUrlInput}
//           onChange={(e) => setVideoUrlInput(e.target.value)}
//         />

//         <button
//           type="button"
//           className="kd-media-upload-load-btn"
//           onClick={handleLoadFromUrl}
//           disabled={!VideoUrlInput.trim() || urlLoading}
//         >
//           {urlLoading ? (
//             <>
//               <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...
//             </>
//           ) : (
//             "Load Video"
//           )}
//         </button>











//             </div>











//             <div
//                 style={{
//                     maxHeight:
//                         Addtype === "replace"
//                             ? "calc(100vh - 560px)"
//                             : "calc(100vh - 480px)",
//                 }}
//                 className="grid grid-cols-2 gap-2.5 mt-3 overflow-y-auto kd-custom-scrollbar"
//             >
//                 {listLoading &&
//                     Array.from({ length: 4 }).map((_, i) => (
//                         <div
//                             key={i}
//                             className="kd-media-upload-gallery-skeleton aspect-square rounded-[10px] animate-pulse"
//                         />
//                     ))}

//                 {!listLoading &&
//                     uploadedVideos.map((item, index) => {
//                         const thumb = item.image_url;
//                         const videoUrl = item.url;
//                         const video_height = item.height;
//                         const video_width = item.width;

//                         if (!videoUrl || !video_height || !video_width) return null;

//                         return (
//                             <div
//                                 key={index}
//                                 className="kd-media-upload-gallery-card relative overflow-hidden cursor-pointer aspect-square rounded-[10px] transition-transform duration-200"
//                                 onClick={() => addVideoToCanvas(videoUrl, video_height, video_width)}
//                                 onMouseEnter={() => setHoveredVideo(item.id)}
//                                 onMouseLeave={() => setHoveredVideo(null)}
//                                 draggable
//                                 onDragStart={(e) => {
//                                     e.dataTransfer.setData("application/element", "video");
//                                     e.dataTransfer.setData("application/video-src", videoUrl);
//                                 }}
//                             >
//                                 {hoveredVideo === item.id && (
//                                     <button
//                                         className="kd-media-upload-delete-btn absolute top-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] z-10"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             deleteVideo(item.id);
//                                         }}
//                                     >
//                                         <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                 )}

//                                 {thumb ? (
//                                     <Image
//                                         src={thumb}
//                                         width={200}
//                                         height={200}
//                                         unoptimized
//                                         className="w-full h-full object-cover rounded-[10px]"
//                                         alt="video thumbnail"
//                                     />
//                                 ) : (
//                                     <video
//                                         src={videoUrl}
//                                         preload="metadata"
//                                         className="w-full h-full object-cover rounded-[10px]"
//                                         onLoadedMetadata={(e) => {
//                                             (e.target as HTMLVideoElement).currentTime = 0.1;
//                                         }}
//                                     />
//                                 )}

//                                 <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg opacity-85 pointer-events-none">
//                                     <FontAwesomeIcon icon={faPlay} />
//                                 </span>
//                             </div>
//                         );
//                     })}

//                 {!listLoading && uploadedVideos.length === 0 && (
//                     <div className="col-span-2 text-center kd-text-muted text-sm py-8">
//                         No videos uploaded yet
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadVideo;


import React, { useRef, useState, useEffect } from "react";
import useEditorStore from "@/app/Store/editorStore";
import useProjectInfoStore from "@/app/Store/projectInfoStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash, faPlay } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { KdMediaUpladIcon, KdMediaUploadLinkIcon } from "@/lib/icon/icons";

interface UploadedVideo {
    id: string;
    image_url?: string;
    url?: string;
    thumbnail_url?: string;
    height?: number;
    width?: number;
}

const UploadVideo: React.FC<{ Addtype?: string }> = ({ Addtype }) => {
    const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [refreshlist, setRefreshlist] = useState(false);
    const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addElement = useEditorStore((s) => s.addElement);
    const selectedId = useEditorStore((s) => s.activeElementId);
    const updateElement = useEditorStore((s) => s.updateElement);
    const token = useProjectInfoStore((s) => s.token);
    const api_url = useProjectInfoStore((s) => s.api_url);
    const { slides, activeSlide } = useEditorStore();
    const canvasWidth = slides[activeSlide]?.width;
    const canvasHeight = slides[activeSlide]?.height;
    const defaultX = canvasWidth ? canvasWidth / 2 : 100;
    const defaultY = canvasHeight ? canvasHeight / 2 : 100;
    const [VideoUrlInput, setVideoUrlInput] = useState("");
    const [urlLoading, setUrlLoading] = useState(false);

    const addVideoToCanvas = (
        src: string,
        height: number,
        width: number,
        thumbnail: string = ""
    ) => {
        if (!src) return;

        const maxWidth = canvasWidth || 300;
        const maxHeight = canvasHeight || 200;
        const scale = Math.min(maxWidth / width, maxHeight / height);
        const newWidth = width * scale;
        const newHeight = height * scale;

        if (Addtype === "replace") {
            if (!selectedId) return;
            updateElement(selectedId, { src, thumbnail });
            return;
        }

        addElement({
            type: "video",
            src,
            thumbnail,
            x: defaultX - newWidth / 2,
            y: defaultY - newHeight / 2,
            width: newWidth,
            height: newHeight,
            rotation: 0,
            opacity: 1,
            zIndex: 1,
            stroke: "",
            strokeWidth: 0,
            borderRadius: "0",
            offsetX: 0,
            offsetY: 0,
            color: "rgba(0,0,0,0)",
            isDragging: false,
            animationType: "None",
        });
    };

    // ---- Link detection helpers ----
    const getYoutubeThumbnail = (url: string) => {
        const regExp =
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/;
        const match = url.match(regExp);
        if (!match) return null;
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    };

    const isDirectVideoFile = (url: string) =>
        /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);

    const handleLoadFromUrl = () => {
        const url = VideoUrlInput.trim();
        if (!url) return;

        setUrlLoading(true);

        // Case 1: YouTube (or other platform) link -> no real dimensions, use default 16:9 box
        const youtubeThumb = getYoutubeThumbnail(url);
        if (youtubeThumb) {
            addVideoToCanvas(url, 250, 400, youtubeThumb);
            setVideoUrlInput("");
            setUrlLoading(false);
            return;
        }

        // Case 2: Direct video file link (mp4/webm/etc) -> read real dimensions
        if (isDirectVideoFile(url)) {
            const videoEl = document.createElement("video");
            videoEl.preload = "metadata";
            videoEl.crossOrigin = "anonymous";

            videoEl.onloadedmetadata = () => {
                addVideoToCanvas(url, videoEl.videoHeight || 250, videoEl.videoWidth || 400);
                setVideoUrlInput("");
                setUrlLoading(false);
            };
            videoEl.onerror = () => {
                console.error("Invalid video URL");
                setUrlLoading(false);
            };

            videoEl.src = url;
            return;
        }

        // Case 3: Unknown/other platform link -> add as-is with default size
        addVideoToCanvas(url, 250, 400);
        setVideoUrlInput("");
        setUrlLoading(false);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            setListLoading(true);
            try {
                const formData = new FormData();
                formData.append("access_token", token || "");
                const res = await fetch(`${api_url}sl_editor_video_listing`, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                setUploadedVideos(data?.result || []);
            } catch (err) {
                console.error("List Error:", err);
            } finally {
                setListLoading(false);
            }
        };

        fetchVideos();
    }, [token, api_url, refreshlist]);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("video/")) {
            alert("Please upload a video file (mp4, webm, etc.)");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("video", file);
            formData.append("access_token", token || "");

            const res = await fetch(`${api_url}sl_editor_video_upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("Video Uploaded:", data);

            setRefreshlist((prev) => !prev);
        } catch (err) {
            console.error("Upload Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        uploadFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file);
        e.target.value = "";
    };

    const deleteVideo = async (id: string) => {
        try {
            const formData = new FormData();
            formData.append("access_token", token || "");
            formData.append("video_id", id);

            await fetch(`${api_url}uploadVideoDelete`, {
                method: "POST",
                body: formData,
            });

            setRefreshlist((prev) => !prev);
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    return (
        <div className="flex flex-col px-2">
            <div className="kd-media-upload-card">
                <div className="kd-media-upload-header">
                    {KdMediaUpladIcon(18, 18)}
                    <h3 className="kd-media-upload-title">Upload Video</h3>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4, video/webm, .mp4, .webm"
                    className="hidden"
                    onChange={handleUpload}
                />

                <p className="kd-media-upload-subtitle">
                    Upload a video file from your device.
                </p>

                <div
                    className={`kd-media-upload-dropbox ${isDragOver ? "kd-media-upload-dragover" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="kd-media-upload-main-icon">
                        {loading ? (
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                            KdMediaUpladIcon(30, 30)
                        )}
                    </div>

                    <p className="kd-media-upload-drop-text">
                        {loading ? "Uploading..." : "Drag & drop a video here"}
                    </p>

                    <p className="kd-media-upload-file-info">
                        MP4, WebM up to 10MB
                    </p>
                </div>

                <div className="kd-media-upload-divider">
                    <span />
                    <p>OR</p>
                    <span />
                </div>

                <div className="kd-media-upload-url-label">
                    <KdMediaUploadLinkIcon />
                    <label>Paste video URL</label>
                </div>

                <input
                    type="text"
                    className="kd-media-upload-url-input"
                    placeholder="https://example.com/video.mp4 or YouTube link"
                    value={VideoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                />

                <button
                    type="button"
                    className="kd-media-upload-load-btn"
                    onClick={handleLoadFromUrl}
                    disabled={!VideoUrlInput.trim() || urlLoading}
                >
                    {urlLoading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...
                        </>
                    ) : (
                        "Load Video"
                    )}
                </button>
            </div>

            <div
                style={{
                    maxHeight:
                        Addtype === "replace"
                            ? "calc(100vh - 560px)"
                            : "calc(100vh - 480px)",
                }}
                className="grid grid-cols-2 gap-2.5 mt-3 overflow-y-auto kd-custom-scrollbar"
            >
                {listLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="kd-media-upload-gallery-skeleton aspect-square rounded-[10px] animate-pulse"
                        />
                    ))}

                {!listLoading &&
                    uploadedVideos.map((item, index) => {
                        const thumb = item.image_url;
                        const videoUrl = item.url;
                        const video_height = item.height;
                        const video_width = item.width;

                        if (!videoUrl || !video_height || !video_width) return null;

                        return (
                            <div
                                key={index}
                                className="kd-media-upload-gallery-card relative overflow-hidden cursor-pointer aspect-square rounded-[10px] transition-transform duration-200"
                                onClick={() => addVideoToCanvas(videoUrl, video_height, video_width)}
                                onMouseEnter={() => setHoveredVideo(item.id)}
                                onMouseLeave={() => setHoveredVideo(null)}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("application/element", "video");
                                    e.dataTransfer.setData("application/video-src", videoUrl);
                                }}
                            >
                                {hoveredVideo === item.id && (
                                    <button
                                        className="kd-media-upload-delete-btn absolute top-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[10px] z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteVideo(item.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}

                                {thumb ? (
                                    <Image
                                        src={thumb}
                                        width={200}
                                        height={200}
                                        unoptimized
                                        className="w-full h-full object-cover rounded-[10px]"
                                        alt="video thumbnail"
                                    />
                                ) : (
                                    <video
                                        src={videoUrl}
                                        preload="metadata"
                                        className="w-full h-full object-cover rounded-[10px]"
                                        onLoadedMetadata={(e) => {
                                            (e.target as HTMLVideoElement).currentTime = 0.1;
                                        }}
                                    />
                                )}

                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg opacity-85 pointer-events-none">
                                    <FontAwesomeIcon icon={faPlay} />
                                </span>
                            </div>
                        );
                    })}

                {!listLoading && uploadedVideos.length === 0 && (
                    <div className="col-span-2 text-center kd-text-muted text-sm py-8">
                        No videos uploaded yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadVideo;