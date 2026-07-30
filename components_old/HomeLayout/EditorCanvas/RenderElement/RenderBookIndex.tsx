"use client";

import { useCallback, useEffect, useMemo } from "react";
import useEditorStore, { TextData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { getChapters } from "@/lib/toc/ChapterManager";
import { paginateBookIndex } from "@/lib/toc/BookIndexPaginator";
import TextDragAndDrop, {
  TextTransformRect,
} from "@/components/blocks/Text/editor/TextDragAndDrop";
import { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";

type Props = {
  id: string;
  data: TextData;
  slideIndex: number;
  clipBounds?: PageClipBounds;
};

export default function RenderBookIndex({
  id,
  data,
  slideIndex,
  clipBounds,
}: Props) {
  const slides = useEditorStore((s) => s.slides);
  const selected = useEditorStore((s) => s.selectedElementIds.includes(id));
  const imageExportMode = useEditorUIStore((s) => s.imageExportMode);
  const chapters = useMemo(() => getChapters(slides), [slides]);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const setActiveElementId = useEditorStore((s) => s.setActiveElementId);
  const toggleSelectedElementId = useEditorStore(
    (s) => s.toggleSelectedElementId,
  );
  const updateElement = useEditorStore((s) => s.updateElement);
  const syncBookIndex = useEditorStore((s) => s.syncBookIndex);
  useEffect(() => {
    if (!data.indexRootId) syncBookIndex(id);
  }, [data.indexRootId, id, slides, syncBookIndex]);

  const select = useCallback(
    (event: React.PointerEvent) => {
      setActiveSlide(slideIndex);
      if (event.ctrlKey || event.metaKey || event.shiftKey)
        toggleSelectedElementId(id);
      else setActiveElementId(id);
    },
    [
      id,
      setActiveElementId,
      setActiveSlide,
      slideIndex,
      toggleSelectedElementId,
    ],
  );

  const move = useCallback(
    (next: TextTransformRect) => {
      updateElement(
        id,
        {
          x: next.x,
          y: next.y,
          width: next.width,
          height: next.height,
          rotation: next.rotation,
        },
        { history: true },
      );
    },
    [id, updateElement],
  );

  const goTo = useCallback(
    (page: number) => {
      setActiveSlide(page - 1);
      const target = document.querySelector(
        `[data-slide-index="${page - 1}"]`,
      ) as HTMLElement | null;
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [setActiveSlide],
  );

  const rect = {
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    rotation: data.rotation ?? 0,
  };
  const leader = data.tocLeader ?? ".";
  const spacing = data.tocSpacing ?? 8;
  const rightAligned = data.tocPageAlignment !== "left";
  const pageNumber = data.indexPage ?? 0;
  const page = useMemo(
    () =>
      paginateBookIndex(chapters, data)[pageNumber] ?? {
        page: pageNumber,
        entries: [],
      },
    [chapters, data, pageNumber],
  );

  return (
    <TextDragAndDrop
      id={id}
      rect={rect}
      isSelected={selected}
      imageExportMode={imageExportMode}
      onSelect={select}
      onTransformEnd={move}
      clipBounds={clipBounds}
    >
      <section
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          color: data.color ?? "#111827",
          fontFamily: data.fontFamily,
          fontSize: data.fontSize ?? 14,
          fontWeight: data.fontWeight ?? 400,
          lineHeight: data.lineHeight ?? 1.4,
          padding: `${data.tocMarginTop ?? 0}px ${data.tocIndent ?? 0}px ${data.tocMarginBottom ?? 0}px`,
        }}
      >
        <div
          style={{
            fontSize: "1.25em",
            fontWeight: 700,
            marginBottom: spacing * 1.5,
            textAlign: data.align ?? "left",
          }}
        >
          {pageNumber
            ? `${data.tocTitle || "INDEX"} (continued)`
            : data.tocTitle || "INDEX"}
        </div>
        {chapters.length === 0 && (
          <div style={{ opacity: 0.55 }}>
            Add Chapter elements to build your index.
          </div>
        )}
        {page.entries.map((chapter) => (
          <button
            key={chapter.elementId}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goTo(chapter.startPage);
            }}
            style={{
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              background: "none",
              border: 0,
              padding: 0,
              marginBottom: spacing,
              width: "100%",
              display: "flex",
              textAlign: "left",
              alignItems: "baseline",
            }}
          >
            <span>{chapter.displayTitle}</span>
            <span
              aria-hidden
              style={{
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                margin: "0 .35em",
                opacity: 0.7,
              }}
            >
              {leader.repeat(80)}
            </span>
            <span
              style={{
                minWidth: "2ch",
                textAlign: rightAligned ? "right" : "left",
              }}
            >
              {data.tocShowRanges
                ? `${chapter.startPage}â€“${chapter.endPage}`
                : chapter.startPage}
            </span>
          </button>
        ))}
      </section>
    </TextDragAndDrop>
  );
}
