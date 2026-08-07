import React from "react";
import { InteractionItem } from "./types";
import InteractionCard from "./InteractionCard";

interface InteractionSectionProps {
  title: string;
  items: InteractionItem[];
  badgeLabel?: string;
  onAdd?: (label: string) => void;
}

const InteractionSection: React.FC<InteractionSectionProps> = ({
  title,
  items,
  badgeLabel,
  onAdd,
}) => {
  return (
    <div className="space-y-2">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <InteractionCard
            key={item.label}
            {...item}
            pro={!!badgeLabel || item.pro}
            onClick={onAdd ? () => onAdd(item.label) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractionSection;
