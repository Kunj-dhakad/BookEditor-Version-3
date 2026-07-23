"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { MessageSquareText } from "lucide-react";

const Caption: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<MessageSquareText size={16} />} title="Caption" onClick={onClick} onDragStart={onDragStart} />
);

export default Caption;
