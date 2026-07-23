"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { Link2 } from "lucide-react";

const LinkArea: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<Link2 size={16} />} title="Link Area" onClick={onClick} onDragStart={onDragStart} />
);

export default LinkArea;
