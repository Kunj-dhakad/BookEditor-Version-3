import { useMemo } from "react";
import { TextData } from "@/app/Store/editorStore";
import { getChapters } from "@/lib/toc/ChapterManager";
import { paginateBookIndex } from "@/lib/toc/BookIndexPaginator";
import { useBook } from "./BookStateContext";

type PreviewBookIndexProps = { data: TextData };

export default function PreviewBookIndex({ data }: PreviewBookIndexProps) {
  const { pages, goToPage } = useBook();
  const chapters = useMemo(() => getChapters(pages ?? []), [pages]);
  const pageNumber = data.indexPage ?? 0;
  const indexPage = useMemo(
    () => paginateBookIndex(chapters, data)[pageNumber] ?? { entries: [] },
    [chapters, data, pageNumber],
  );
  const spacing = data.tocSpacing ?? 8;
  const leader = data.tocLeader ?? ".";
  const rightAligned = data.tocPageAlignment !== "left";

  return (
    <section style={{ width: "100%", height: "100%", boxSizing: "border-box", overflow: "hidden", color: data.color ?? "#111827", fontFamily: data.fontFamily, fontSize: data.fontSize ?? 14, fontWeight: data.fontWeight ?? 400, lineHeight: data.lineHeight ?? 1.4, padding: `${data.tocMarginTop ?? 0}px ${data.tocIndent ?? 0}px ${data.tocMarginBottom ?? 0}px` }}>
      <div style={{ fontSize: "1.25em", fontWeight: 700, marginBottom: spacing * 1.5, textAlign: data.align ?? "left" }}>
        {pageNumber ? `${data.tocTitle || "INDEX"} (continued)` : (data.tocTitle || "INDEX")}
      </div>
      {chapters.length === 0 && <div style={{ opacity: 0.55 }}>No chapters available.</div>}
      {indexPage.entries.map((chapter) => (
        <button
          key={chapter.elementId}
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); goToPage(chapter.startPage); }}
          style={{ cursor: "pointer", color: "inherit", font: "inherit", background: "none", border: 0, padding: 0, marginBottom: spacing, width: "100%", display: "flex", textAlign: "left", alignItems: "baseline" }}
        >
          <span>{chapter.displayTitle}</span>
          <span aria-hidden style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", margin: "0 .35em", opacity: 0.7 }}>{leader.repeat(80)}</span>
          <span style={{ minWidth: "2ch", textAlign: rightAligned ? "right" : "left" }}>{data.tocShowRanges ? `${chapter.startPage}–${chapter.endPage}` : chapter.startPage}</span>
        </button>
      ))}
    </section>
  );
}
