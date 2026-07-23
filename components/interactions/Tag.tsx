"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { Tag } from "lucide-react";

const InteractionTag: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<Tag size={16} />} title="Tag" onClick={onClick} onDragStart={onDragStart} />
);

export default InteractionTag;
