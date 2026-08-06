import React from "react";
import { SocialItem } from "./types";

const SocialCard: React.FC<SocialItem & { onClick: () => void }> = ({
  label,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors aspect-square"
    >
      <Icon className="w-5 h-5 text-gray-700" />
    </button>
  );
};

export default SocialCard;
