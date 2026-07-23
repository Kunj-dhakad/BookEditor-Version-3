"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { Sparkles } from "lucide-react";

const LinkButton: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<Sparkles size={16} />} title="Link Button" onClick={onClick} onDragStart={onDragStart} />
);

export default LinkButton;
