"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { CirclePlay } from "lucide-react";

const VideoButton: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<CirclePlay size={16} />} title="Video Button" onClick={onClick} onDragStart={onDragStart} />
);

export default VideoButton;
