"use client";
import React, { useEffect, useState } from "react";
import useEditorStore, { ElementData } from "@/app/Store/editorStore";
import Image from 'next/image'
type TextPresetKey =
  | "text-h1"
  | "text-h2"
  | "text-h3"
  | "text-p"

type TextPreset = {
  text: string;
  fontSize: number;
  fontWeight: number | string;
  lineHeight?: number;
  fontStyle?: "normal" | "italic";
  width: number;
  height: number;
};

const TEXT_PRESETS: Record<TextPresetKey, TextPreset> = {
  "text-h1": {
    text: "Add a heading",
    fontSize: 36,
    fontWeight: 600,
    width: 255,
    height: 50,
  },
  "text-h2": {
    text: "Add a subheading",
    fontSize: 24,
    fontWeight: 600,
    width: 215,
    height: 44,
  },
  "text-h3": {
    text: "Add a body text",
    fontSize: 16,
    fontWeight: 500,
    width: 135,
    height: 43,
  },
  "text-p": {
    text: "Start writing your paragraph here…",
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.6,
    width: 210,
    height: 40,
  },

};



type DefaultStyleCardProps = {
  label: string;
  dragType: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
};

const DefaultStyleCard: React.FC<DefaultStyleCardProps> = ({
  label,
  dragType,
  style,
  onClick,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={(e) => onDragStart(e, dragType)}
      className="kd-text-Add-defult-card flex flex-col items-center mt-1 justify-center gap-1 p-3"
    >
      <span style={style}>{label}</span>
    </div>
  );
};


interface TextTemplate {
  id: number;
  thumbnail_url: string;
  json_url: string;
  category: string | null;
  create_at: string;
  update_at: string;
}


type TemplateElementData = ElementData & {
  color?: string;
  html?: string;
};

type TemplateElement = {
  id: string;
  data: TemplateElementData;
};

const AddTextPanel = () => {
  const addElement = useEditorStore((s) => s.addElement);
  const { slides, activeSlide } = useEditorStore();

  const canvasWidth = slides[activeSlide]?.width;
  const canvasHeight = slides[activeSlide]?.height;
  const defaultX = canvasWidth ? canvasWidth / 2 : 100;
  const defaultY = canvasHeight ? canvasHeight / 2 : 100;

  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: string,
    sample?: string
  ) => {
    e.dataTransfer.setData("application/element", type);
    if (sample) e.dataTransfer.setData("application/sample", sample);
  };

  const addTextByType = (type: TextPresetKey) => {
    const preset = TEXT_PRESETS[type];
    addElement({
      type: "text",
      x: defaultX - preset.width / 2,
      y: defaultY - preset.height / 2,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      fontFamily: "Plus Jakarta Sans",
      textAlign: "left",
      lineHeight: 1.2,
      letterSpacing: 0,
      ...preset,
    });
  };

  const addChapter = () => addElement({
    type: "text", bookRole: "chapter", text: "Chapter title", chapterSubtitle: "", chapterAutoNumber: true,
    x: defaultX - 135, y: defaultY - 35, width: 270, height: 70, rotation: 0, opacity: 1, zIndex: 1,
    fontFamily: "Plus Jakarta Sans", fontSize: 30, fontWeight: 700, lineHeight: 1.2, textAlign: "left", letterSpacing: 0,
  });

  const addBookIndex = () => addElement({
    type: "text", bookRole: "index", text: "INDEX", tocTitle: "INDEX", tocLeader: ".", tocPageAlignment: "right", tocShowRanges: false, tocSpacing: 8, tocIndent: 0,
    x: defaultX - 135, y: defaultY - 120, width: 270, height: 240, rotation: 0, opacity: 1, zIndex: 1,
    fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 400, lineHeight: 1.4, textAlign: "left", letterSpacing: 0,
  });

  const addTextByTemplate = async (template: TextTemplate) => {
    try {
      const response = await fetch(template.json_url);
      const data = await response.json();
      const templateSlide = data?.slides?.[0];
      const elements: TemplateElement[] = templateSlide?.elements ?? [];
      const templateCenterX = (templateSlide?.width ?? 350) / 2;
      const templateCenterY = (templateSlide?.height ?? 434) / 2;
      elements.forEach((el) => {
        const d = el.data;

        const offsetX = d.x + d.width / 2 - templateCenterX;
        const offsetY = d.y + d.height / 2 - templateCenterY;

        addElement({
          ...d,
          x: defaultX + offsetX - d.width / 2,
          y: defaultY + offsetY - d.height / 2,
        } as ElementData);
      });

    } catch (error) {
      console.error("Error loading template:", error);
    }
  };


  useEffect(() => {
    const getTemplates = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/TextTemplate", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        setTemplates(result);
        console.log(" Text templates fetched:", result);
      } catch (error) {
        console.error(" Error fetching text templates:", error);
      } finally {
        setLoading(false);
      }
    };

    getTemplates();
  }, []);



  return (
    <div className="kd-text-add-panel-container">

      <div className="kd-text-add-panel-fixed">

        <div className="flex items-center justify-between mb-3">
          <span className="kd-toolPanel-heding-text">
            Text
          </span>
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mb-2" />

        {/* <p className="kd-toolPanel-sub-heding-text pt-2">Default Text Styles</p> */}

        <div className="kd-default-styles-list">
          <DefaultStyleCard label="📖 Chapter" dragType="book-chapter" style={{ fontSize: 16, fontWeight: 700, fontFamily: "Plus Jakarta Sans" }} onClick={addChapter} onDragStart={handleDragStart} />
          <DefaultStyleCard label="Book Index" dragType="book-index" style={{ fontSize: 15, fontWeight: 600, fontFamily: "Plus Jakarta Sans" }} onClick={addBookIndex} onDragStart={handleDragStart} />
          <DefaultStyleCard
            label="Add Heading"
            dragType="text-h1"
            style={{ fontSize: 20, fontWeight: 700, fontFamily: "Plus Jakarta Sans" }}
            onClick={() => addTextByType("text-h1")}
            onDragStart={handleDragStart}
          />
          <DefaultStyleCard
            label="Add Sub Heading"
            dragType="text-h2"
            style={{ fontSize: 15, fontWeight: 600, fontFamily: "Plus Jakarta Sans" }}
            onClick={() => addTextByType("text-h2")}
            onDragStart={handleDragStart}
          />
          <DefaultStyleCard
            label="Add Body Text"
            dragType="text-p"
            style={{ fontSize: 13, fontWeight: 400, fontFamily: "Playpen Sans" }}
            onClick={() => addTextByType("text-h3")}
            onDragStart={handleDragStart}
          />
          <DefaultStyleCard
            label="paragraph"
            dragType="text-h3"
            style={{ fontSize: 12, fontWeight: 400, fontFamily: "Plus Jakarta Sans" }}
            onClick={() => addTextByType("text-p")}
            onDragStart={handleDragStart}
          />
        </div>
        <div className="w-full kd-toolPanel-hr-devide-border mt-5   mb-2" />
      </div>
      <div className="kd-text-add-panel-scroll">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse kd-text-add-panel-card rounded-lg overflow-hidden"
              >
                <div className="w-full h-32 kd-text-add-panel-card" />
              </div>
            ))}
          </div>
        ) : templates.length > 0 ? (

          <div className="kd-text-add-panel-scroll">
            <div className="grid grid-cols-2 gap-4">
              {templates.map((card) => (
                <div key={card.id}
                  draggable
                  className="kd-text-add-panel-card flex flex-col items-center justify-center gap-1 p-3"
                  onClick={() => addTextByTemplate(card)}
                >
                  <Image
                    src={card.thumbnail_url}
                    unoptimized
                    width={500}
                    height={500}
                    alt="Picture of the author"
                  />

                </div>
              ))}
            </div>
          </div>

        ) : (
          <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">
            No templates found
          </div>
        )}
      </div>


    </div>
  );
};

export default AddTextPanel;
