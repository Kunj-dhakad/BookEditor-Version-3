"use client";

import React from "react";
import { Video } from "lucide-react";
import { InteractionData } from "@/app/Store/editorStore";
import InteractionPopupShell from "./InteractionPopupShell";
import {
  MediaPreview,
  parseMediaUrl,
} from "../components/InteractionDetailView/EmbedMedia/media";

interface VideoPopupProps {
  data: InteractionData;
  onClose: () => void;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ data, onClose }) => {
  const media = parseMediaUrl(data.videoUrl ?? "");

  return (
    <InteractionPopupShell onClose={onClose} maxWidth={520}>
      {media && media.type !== "image" ? (
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <MediaPreview
            media={media}
            controls
            allowFullscreen
          />
        </div>
      ) : (
        <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 text-center text-sm text-slate-500">
          <Video size={24} className="text-slate-400" />
          <span>
            {data.videoUrl
              ? "Please provide a supported video URL."
              : "Add a video URL from the sidebar to play it here."}
          </span>
        </div>
      )}
    </InteractionPopupShell>
  );
};

export default VideoPopup;
