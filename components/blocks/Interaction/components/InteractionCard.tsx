import React from "react";
import { InteractionItem } from "./types";

const InteractionCard: React.FC<InteractionItem & { onClick?: () => void }> = ({
  label,
  icon: Icon,
  dashed,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-2 py-4 ${
        dashed ? "border-dashed border-gray-300" : "border-gray-200"
      }`}
    >
      <Icon className="w-5 h-5 text-gray-700" />
      <span className="text-[11px] text-gray-700 leading-tight text-center">
        {label}
      </span>
    </button>
  );
};

export default InteractionCard;
