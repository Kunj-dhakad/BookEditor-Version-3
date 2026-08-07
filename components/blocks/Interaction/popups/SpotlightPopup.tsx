"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { InteractionData } from "@/app/Store/editorStore";
import InteractionPopupShell from "./InteractionPopupShell";

interface SpotlightPopupProps {
  data: InteractionData;
  onClose: () => void;
}

const SpotlightPopup: React.FC<SpotlightPopupProps> = ({ data, onClose }) => (
  <InteractionPopupShell onClose={onClose} maxWidth={360}>
    {data.spotlightImageUrl && (
      <img
        src={data.spotlightImageUrl}
        alt=""
        className="mb-3 h-36 w-full rounded-lg object-cover"
      />
    )}
    <div className="mb-2 flex items-center gap-2 text-indigo-600">
      <Sparkles size={17} />
      <span className="text-xs font-semibold uppercase tracking-wide">Spotlight</span>
    </div>
    <h3 className="m-0 text-base font-bold text-gray-900">
      {data.spotlightTitle || "Featured spotlight"}
    </h3>
    <p className="mb-0 mt-2 whitespace-pre-wrap text-[13px] leading-5 text-gray-600">
      {data.spotlightContent || "Add your spotlight content from the sidebar."}
    </p>
  </InteractionPopupShell>
);

export default SpotlightPopup;
