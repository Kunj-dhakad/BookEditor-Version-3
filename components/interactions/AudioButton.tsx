"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { Volume2 } from "lucide-react";

const AudioButton: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<Volume2 size={16} />} title="Audio Button" onClick={onClick} onDragStart={onDragStart} />
);

export default AudioButton;
