import { useMemo } from "react";
import { TextData } from "@/app/Store/editorStore";
import { getChapters } from "@/components/blocks/Index/lib/ChapterManager";
import { paginateBookIndex } from "@/components/blocks/Index/lib/BookIndexPaginator";
import { useBook } from "./BookStateContext";
import TocIndexBody from "@/components/blocks/Index/renderer/TocIndexBody";

type PreviewBookIndexProps = { data: TextData };

export default function PreviewBookIndex({ data }: PreviewBookIndexProps) {
  const { pages, goToPage } = useBook();
  const chapters = useMemo(() => getChapters(pages ?? []), [pages]);
  const pageNumber = data.indexPage ?? 0;
  const indexPage = useMemo(
    () => paginateBookIndex(chapters, data)[pageNumber] ?? { page: pageNumber, entries: [] },
    [chapters, data, pageNumber],
  );

  return (
    <section
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        background: data.backgroundColor || "transparent",
        color: data.color ?? "#111827",
        fontFamily: data.fontFamily,
        fontSize: data.fontSize ?? 14,
        fontWeight: data.fontWeight ?? 400,
        lineHeight: data.lineHeight ?? 1.4,
        padding: `${data.tocMarginTop || 16}px ${data.tocIndent || 16}px ${data.tocMarginBottom || 16}px`,
      }}
    >
      <TocIndexBody
        data={data}
        page={indexPage}
        pageNumber={pageNumber}
        noChapters={chapters.length === 0}
        onEntryClick={goToPage}
      />
    </section>
  );
}
