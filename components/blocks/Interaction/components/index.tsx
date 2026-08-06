"use client";
import React, { useState } from "react";
import { InteractionKind } from "@/app/Store/editorStore";

import {
  ENGAGEMENT_KIND_MAP,
  DETAIL_ITEM_LABELS,
  NAV_KIND_MAP,
  SHOP_KIND_MAP,
  linksAndTags,
  engagement,
  navigation,
  social,
  multimedia,
  shop,
  otherSquare,
  otherWide,
} from "./constants";
import { useAddInteraction } from "./useAddInteraction";
import InteractionSection from "./InteractionSection";
import SocialSection from "./SocialSection";
import InteractionCard from "./InteractionCard";
import WideInteractionCard from "./WideInteractionCard";
import EmbedMedia from "./InteractionDetailView/EmbedMedia/EmbedMedia";
import Slideshow from "./InteractionDetailView/Slideshow/Slideshow";
import ShopDetail from "./InteractionDetailView/Shop/ShopDetail";

export { interactionIconSvg } from "./icons";

const InteractionPanel: React.FC = () => {
  const { addInteraction } = useAddInteraction();

  const [view, setView] = useState<"list" | "detail">("list");
  const [activeDetailLabel, setActiveDetailLabel] = useState<string | null>(
    null,
  );

  const openDetails = (label: string) => {
    setActiveDetailLabel(label);
    setView("detail");
  };

  const closeDetails = () => {
    setActiveDetailLabel(null);
    setView("list");
  };

  const handleItemClick = (
    label: string,
    directAdd?: (label: string) => void,
  ) => {
    if (DETAIL_ITEM_LABELS.has(label)) {
      openDetails(label);
      return;
    }
    directAdd?.(label);
  };

  if (view === "detail" && activeDetailLabel) {
    if (activeDetailLabel === "Embed Media") {
      return <EmbedMedia onBack={closeDetails} />;
    }
    if (activeDetailLabel === "Slideshow" || activeDetailLabel === "Pop-up slideshow") {
      return <Slideshow onBack={closeDetails} popup={activeDetailLabel === "Pop-up slideshow"} />;
    }
    if (SHOP_KIND_MAP[activeDetailLabel]) {
      return <ShopDetail label={activeDetailLabel} onBack={closeDetails} />;
    }
  }

  return (
    <div className="kd-text-add-panel-container bg-white">
      <div className="kd-text-add-panel-fixed">
        <div className="flex items-center justify-between mb-3">
          <span className="kd-toolPanel-heding-text text-gray-900">
            Interactions
          </span>
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mb-2 border-gray-200" />
      </div>

      <div className="kd-text-add-panel-scroll space-y-5 px-3 pb-4">
        <InteractionSection
          title="Links and tags"
          items={linksAndTags}
          onAdd={(label) =>
            handleItemClick(label, (l) =>
              addInteraction(
                (
                  {
                    "Link area": "link-area",
                    "Link button": "link-button",
                    Tag: "tag",
                    Caption: "caption",
                    "Embed Media": "embed-media",
                  } as Record<string, InteractionKind>
                )[l],
              ),
            )
          }
        />

        <InteractionSection
          title="Engagement"
          items={engagement}
          badgeLabel="Business"
          onAdd={(label) =>
            handleItemClick(label, (l) =>
              addInteraction(ENGAGEMENT_KIND_MAP[l]),
            )
          }
        />
        <InteractionSection
          title="Multimedia"
          items={multimedia}
          badgeLabel="Professional"
          onAdd={(label) =>
            handleItemClick(label, (itemLabel) => {
              if (itemLabel === "Spotlight") addInteraction("spotlight");
              if (itemLabel === "Video button") addInteraction("video-button");
              if (itemLabel === "Audio button") addInteraction("audio-button");
            })
          }
        />
        <InteractionSection
          title="Navigation"
          items={navigation}
          onAdd={(label) =>
            handleItemClick(label, (l) => addInteraction(NAV_KIND_MAP[l]))
          }
        />

        <SocialSection
          title="Social"
          items={social}
          onAdd={(platform) => addInteraction("social", platform)}
        />

        <InteractionSection
          title="Shop"
          items={shop}
          badgeLabel="Professional"
          onAdd={(label) => handleItemClick(label)}
        />

        {/* <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-[11px] font-semibold uppercase text-gray-500 tracking-wide">
              Other
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {otherSquare.map((item) => (
              <InteractionCard key={item.label} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {otherWide.map((item, i) => (
              <WideInteractionCard key={`${item.label}-${i}`} {...item} />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default InteractionPanel;
