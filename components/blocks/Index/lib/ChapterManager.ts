import type { SlideType, TextData } from "@/app/Store/editorStore";

export type ChapterEntry = {
  elementId: string;
  slideId: string;
  title: string;
  subtitle?: string;
  startPage: number;
  endPage: number;
  displayTitle: string;
};

/**
 * The document's slide array is the sole page-order authority. This pure,
 * memoizable derivation keeps TOC data correct for insertions, deletion,
 * reordering, duplication, and history restores without storing stale ranges.
 */
export function getChapters(slides: SlideType[]): ChapterEntry[] {
  const starts: Array<Omit<ChapterEntry, "endPage" | "displayTitle"> & { autoNumber: boolean }> = [];
  slides.forEach((slide, slideIndex) => {
    // A page is a chapter start once, even if a template accidentally contains
    // more than one Chapter element on the same page.
    const element = slide.elements.find((candidate) => {
      const candidateData = candidate.data as TextData;
      return candidateData.type === "text" && candidateData.bookRole === "chapter";
    });
    if (!element) return;
      const data = element.data as TextData;
      starts.push({
        elementId: element.id,
        slideId: slide.id,
        title: data.text.trim() || "Untitled chapter",
        subtitle: data.chapterSubtitle?.trim() || undefined,
        startPage: slideIndex + 1,
        autoNumber: data.chapterAutoNumber !== false,
      });
  });

  return starts.map((chapter, index) => ({
    elementId: chapter.elementId,
    slideId: chapter.slideId,
    title: chapter.title,
    subtitle: chapter.subtitle,
    startPage: chapter.startPage,
    endPage: (starts[index + 1]?.startPage ?? slides.length + 1) - 1,
    displayTitle: chapter.autoNumber ? `Chapter ${index + 1}: ${chapter.title}` : chapter.title,
  }));
}
