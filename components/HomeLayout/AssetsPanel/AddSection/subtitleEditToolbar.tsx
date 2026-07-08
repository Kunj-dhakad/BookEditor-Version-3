"use client";
import useEditorStore from "@/app/Store/editorStore";

const SubtitleEditToolbar = () => {
  const activeSlideIndex = useEditorStore((s) => s.activeSlide);
  const slides = useEditorStore((s) => s.slides);
  const updateSlideSubtitle = useEditorStore(
    (s) => s.updateSlideSubtitle
  );

  const activeSlide = slides[activeSlideIndex];

  if (!activeSlide) return null;

  const value = activeSlide.subtitle_text || "";

  return (
    <div className="w-full kd-text-primary rounded-xl shadow-2xl">
      <div className="p-4 space-y-2">
        {/* <label className="text-xs text-gray-400">Subtitle</label> */}

        <textarea
          value={value}
          maxLength={200}
          onChange={(e) => updateSlideSubtitle(e.target.value)}
          className="w-full h-50 kd-border-primary rounded-md p-3 text-sm resize-none focus:outline-none bg-transparent"
        />

        <div className="text-right text-xs kd-text-Primary">
          {value.length}/200
        </div>
      </div>
    </div>
  );
};

export default SubtitleEditToolbar;
