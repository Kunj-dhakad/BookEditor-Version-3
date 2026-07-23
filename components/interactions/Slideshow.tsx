"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { BookOpenText } from "lucide-react";

const Slideshow: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<BookOpenText size={16} />} title="Slideshow" onClick={onClick} onDragStart={onDragStart} />
);

export default Slideshow;
