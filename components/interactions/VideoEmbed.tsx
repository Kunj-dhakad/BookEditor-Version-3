"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { Video } from "lucide-react";

const VideoEmbed: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<Video size={16} />} title="Video Embed" onClick={onClick} onDragStart={onDragStart} />
);

export default VideoEmbed;
