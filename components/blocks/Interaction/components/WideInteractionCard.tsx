import React from "react";
import { WideInteractionItem } from "./types";

const WideInteractionCard: React.FC<WideInteractionItem> = ({
  label,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors px-4 py-3"
    >
      <Icon className="w-5 h-5 text-gray-700 shrink-0" />
      <span className="text-[12px] font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default WideInteractionCard;
