"use client";
import React from "react";
import InteractionCard from "./InteractionCard";
import { MonitorPlay } from "lucide-react";

const Spotlight: React.FC<{ onClick?: () => void; onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void }> = ({ onClick, onDragStart }) => (
  <InteractionCard icon={<MonitorPlay size={16} />} title="Spotlight" onClick={onClick} onDragStart={onDragStart} />
);

export default Spotlight;
