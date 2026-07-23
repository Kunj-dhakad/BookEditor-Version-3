"use client";
import React from "react";
import { BookOpenText, CirclePlay, Link2, MessageSquareText, MonitorPlay, Package, Sparkles, Tag, Video, Volume2 } from "lucide-react";
import InteractionCard from "./InteractionCard";
import useEditorStore from "@/app/Store/editorStore";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="space-y-2">
    <div className="px-1">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-2">{children}</div>
  </div>
);

const InteractionPanel: React.FC = () => {
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();
  const canvasWidth = slides[activeSlide]?.width;
  const canvasHeight = slides[activeSlide]?.height;
  const defaultX = canvasWidth ? canvasWidth / 2 - 70 : 100;
  const defaultY = canvasHeight ? canvasHeight / 2 - 60 : 100;

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData("application/element", type);
  };

  const addPlaceholder = (type: string, title: string) => {
    addElement({
      type: "text",
      text: title,
      x: defaultX,
      y: defaultY,
      width: 180,
      height: 48,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      fontFamily: "Plus Jakarta Sans",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.2,
      textAlign: "center",
      letterSpacing: 0,
    });
  };


  return (
    <div className="kd-text-add-panel-container">
      <div className="kd-text-add-panel-fixed">
        <div className="flex items-center justify-between mb-3">
          <span className="kd-toolPanel-heding-text">Interactions</span>
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mb-2" />
      </div>

      <div className="kd-text-add-panel-scroll space-y-4 px-3 pb-4">
        <Section title="Links & Tags">
          <InteractionCard
            icon={<Link2 size={16} />}
            title="Link Area"
            onClick={() => addPlaceholder("interaction-link-area", "Link Area")}
            onDragStart={(event) => handleDragStart(event, "interaction-link-area")}
          />
          <InteractionCard
            icon={<Sparkles size={16} />}
            title="Link Button"
            onClick={() => addPlaceholder("interaction-link-button", "Link Button")}
            onDragStart={(event) => handleDragStart(event, "interaction-link-button")}
          />
          <InteractionCard
            icon={<Tag size={16} />}
            title="Tag"
            onClick={() => addPlaceholder("interaction-tag", "Tag")}
            onDragStart={(event) => handleDragStart(event, "interaction-tag")}
          />
          <InteractionCard
            icon={<MessageSquareText size={16} />}
            title="Caption"
            onClick={() => addPlaceholder("interaction-caption", "Caption")}
            onDragStart={(event) => handleDragStart(event, "interaction-caption")}
          />
        </Section>

        <Section title="Multimedia">
          <InteractionCard
            icon={<MonitorPlay size={16} />}
            title="Spotlight"
            onClick={() => addPlaceholder("interaction-spotlight", "Spotlight")}
            onDragStart={(event) => handleDragStart(event, "interaction-spotlight")}
          />
          <InteractionCard
            icon={<BookOpenText size={16} />}
            title="Slideshow"
            onClick={() => addPlaceholder("interaction-slideshow", "Slideshow")}
            onDragStart={(event) => handleDragStart(event, "interaction-slideshow")}
          />
          <InteractionCard
            icon={<CirclePlay size={16} />}
            title="Pop-up Slideshow"
            onClick={() => addPlaceholder("interaction-popup-slideshow", "Pop-up Slideshow")}
            onDragStart={(event) => handleDragStart(event, "interaction-popup-slideshow")}
          />
          <InteractionCard
            icon={<Video size={16} />}
            title="Video Embed"
            onClick={() => addPlaceholder("interaction-video-embed", "Video Embed")}
            onDragStart={(event) => handleDragStart(event, "interaction-video-embed")}
          />
          <InteractionCard
            icon={<CirclePlay size={16} />}
            title="Video Button"
            onClick={() => addPlaceholder("interaction-video-button", "Video Button")}
            onDragStart={(event) => handleDragStart(event, "interaction-video-button")}
          />
          <InteractionCard
            icon={<Volume2 size={16} />}
            title="Audio Button"
            onClick={() => addPlaceholder("interaction-audio-button", "Audio Button")}
            onDragStart={(event) => handleDragStart(event, "interaction-audio-button")}
          />
        </Section>

        <Section title="Shop">
          <InteractionCard
            icon={<Package size={16} />}
            title="Product Link"
            onClick={() => addPlaceholder("interaction-product-link", "Product Link")}
            onDragStart={(event) => handleDragStart(event, "interaction-product-link")}
          />
          <InteractionCard
            icon={<Sparkles size={16} />}
            title="Buy Button"
            onClick={() => addPlaceholder("interaction-buy-button", "Buy Button")}
            onDragStart={(event) => handleDragStart(event, "interaction-buy-button")}
          />
          <InteractionCard
            icon={<Tag size={16} />}
            title="Price Tag"
            onClick={() => addPlaceholder("interaction-price-tag", "Price Tag")}
            onDragStart={(event) => handleDragStart(event, "interaction-price-tag")}
          />
        </Section>
      </div>
    </div>
  );
};

export default InteractionPanel;
