"use client";

import { useCallback, useEffect, useMemo } from "react";
import useEditorStore, { TextData } from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import { getChapters } from "@/components/blocks/Index/lib/ChapterManager";
import { paginateBookIndex } from "@/components/blocks/Index/lib/BookIndexPaginator";
import TextDragAndDrop, {
  TextTransformRect,
} from "@/components/blocks/Text/editor/TextDragAndDrop";
import { PageClipBounds } from "@/components/HomeLayout/EditorCanvas/RenderElement/pageClip";
import TocIndexBody from "@/components/blocks/Index/renderer/TocIndexBody";
import { useElementContextMenu } from "@/components/HomeLayout/EditorCanvas/RenderElement/useElementContextMenu";
import ElementContextMenu from "@/components/HomeLayout/EditorCanvas/toolbar/EditTool/ComanEditTool/ElementContextMenu";

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
  const updateChapterTitle = useEditorStore((s) => s.updateChapterTitle);
  const syncBookIndex = useEditorStore((s) => s.syncBookIndex);
  const { contextMenuPos, handleContextMenu, closeContextMenu } = useElementContextMenu(id, slideIndex);
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
        onContextMenu={handleContextMenu}
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
          page={page}
          pageNumber={pageNumber}
          noChapters={chapters.length === 0}
          onEntryClick={goTo}
          editable
          onRenameChapter={updateChapterTitle}
        />
      </section>
      <ElementContextMenu
        position={selected ? contextMenuPos : null}
        elementId={id}
        onClose={closeContextMenu}
      />
    </TextDragAndDrop>
  );
}
