"use client";
import React from "react";

type InteractionCardProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  isActive?: boolean;
};

const InteractionCard: React.FC<InteractionCardProps> = ({
  icon,
  title,
  onClick,
  onDragStart,
  isActive = false,
}) => {
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      className={`kd-text-Add-defult-card flex cursor-pointer flex-col items-start justify-center gap-2 p-3 transition-all duration-200 ${
        isActive ? "border-purple-400 bg-purple-50/70" : "hover:border-purple-300 hover:bg-purple-50/40"
      }`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/80 text-slate-700 shadow-sm">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700">{title}</span>
    </div>
  );
};

export default InteractionCard;
