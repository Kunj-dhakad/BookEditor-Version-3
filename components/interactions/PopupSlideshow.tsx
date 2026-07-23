"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { CirclePlay } from "lucide-react";

const PopupSlideshow: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<CirclePlay size={16} />} title="Pop-up Slideshow" onClick={onClick} onDragStart={onDragStart} />
);

export default PopupSlideshow;
