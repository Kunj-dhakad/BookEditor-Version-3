"use client";
import React, { useState } from "react";
import type { TextData } from "@/app/Store/editorStore";
import type { ChapterEntry } from "@/components/blocks/Index/lib/ChapterManager";
import type { BookIndexPage } from "@/components/blocks/Index/lib/BookIndexPaginator";
import { hexToRgba } from "@/components/blocks/Index/lib/tocStyles";

type Props = {
  data: TextData;
  page: BookIndexPage;
  pageNumber: number;
  noChapters: boolean;
  onEntryClick: (startPage: number) => void;
  editable?: boolean;
  onRenameChapter?: (elementId: string, text: string) => void;
};

export default function TocIndexBody({
  data,
  page,
  pageNumber,
  noChapters,
  onEntryClick,
  editable,
  onRenameChapter,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const style = data.tocStyle || "classic";
  const leader = data.tocLeader ?? ".";
  const spacing = data.tocSpacing ?? 8;
  const rightAligned = data.tocPageAlignment !== "left";
  const accent = data.tocAccentColor || data.color || "#6366f1";
  const textColor = data.color ?? "#111827";

  const startEdit = (chapter: ChapterEntry) => {
    if (!editable || !onRenameChapter) return;
    setEditingId(chapter.elementId);
    setDraft(chapter.title);
  };

  const commitEdit = (chapter: ChapterEntry) => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== chapter.title) onRenameChapter?.(chapter.elementId, trimmed);
    setEditingId(null);
  };

  const pageLabel = (chapter: ChapterEntry) =>
    data.tocShowRanges ? `${chapter.startPage}–${chapter.endPage}` : chapter.startPage;

  const renderTitle = (chapter: ChapterEntry) => {
    if (editingId === chapter.elementId) {
      return (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onBlur={() => commitEdit(chapter)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitEdit(chapter);
            }
            if (e.key === "Escape") setEditingId(null);
          }}
          style={{
            font: "inherit",
            color: "inherit",
            background: "#ffffff",
            border: `1px solid ${accent}`,
            borderRadius: 4,
            padding: "1px 4px",
            width: "65%",
          }}
        />
      );
    }
    return (
      <span
        onDoubleClick={(e) => {
          e.stopPropagation();
          startEdit(chapter);
        }}
        title={editable ? "Double-click to rename this chapter" : undefined}
      >
        {chapter.displayTitle}
      </span>
    );
  };

  const rowBase: React.CSSProperties = {
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
    width: "100%",
    textAlign: "left",
  };

  const entryProps = (chapter: ChapterEntry) => ({
    role: "button" as const,
    tabIndex: 0,
    onClick: (event: React.MouseEvent) => {
      event.stopPropagation();
      if (editingId) return;
      onEntryClick(chapter.startPage);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (editingId) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEntryClick(chapter.startPage);
      }
    },
  });

  let entriesNode: React.ReactNode;

  if (style === "boxed") {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column", gap: spacing }}>
        {page.entries.map((chapter) => (
          <div
            key={chapter.elementId}
            {...entryProps(chapter)}
            style={{
              ...rowBase,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: 8,
              background: hexToRgba(accent, 0.1),
            }}
          >
            {renderTitle(chapter)}
            <span
              style={{
                background: accent,
                color: "#fff",
                borderRadius: 999,
                padding: "1px 8px",
                fontSize: "0.85em",
                minWidth: "2ch",
                textAlign: "center",
                marginLeft: 8,
              }}
            >
              {pageLabel(chapter)}
            </span>
          </div>
        ))}
      </div>
    );
  } else if (style === "numbered") {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column", gap: spacing }}>
        {page.entries.map((chapter, i) => (
          <div key={chapter.elementId} {...entryProps(chapter)} style={{ ...rowBase, display: "flex", alignItems: "center" }}>
            <span
              style={{
                flexShrink: 0,
                width: "1.6em",
                height: "1.6em",
                borderRadius: "50%",
                background: accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75em",
                marginRight: 8,
              }}
            >
              {i + 1}
            </span>
            {renderTitle(chapter)}
            <span aria-hidden style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", margin: "0 .35em", opacity: 0.5 }}>
              {leader.repeat(80)}
            </span>
            <span style={{ minWidth: "2ch", textAlign: rightAligned ? "right" : "left" }}>{pageLabel(chapter)}</span>
          </div>
        ))}
      </div>
    );
  } else if (style === "colorBar") {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column", gap: spacing }}>
        {page.entries.map((chapter) => (
          <div
            key={chapter.elementId}
            {...entryProps(chapter)}
            style={{ ...rowBase, display: "flex", alignItems: "center", borderLeft: `4px solid ${accent}`, paddingLeft: 10 }}
          >
            {renderTitle(chapter)}
            <span style={{ flex: 1 }} />
            <span
              style={{
                background: hexToRgba(accent, 0.15),
                color: accent,
                fontWeight: 600,
                borderRadius: 6,
                padding: "1px 8px",
                minWidth: "2ch",
                textAlign: "center",
              }}
            >
              {pageLabel(chapter)}
            </span>
          </div>
        ))}
      </div>
    );
  } else if (style === "underline") {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column", gap: spacing * 1.4 }}>
        {page.entries.map((chapter) => (
          <div
            key={chapter.elementId}
            {...entryProps(chapter)}
            style={{ ...rowBase, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
          >
            <span style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 2 }}>{renderTitle(chapter)}</span>
            <span style={{ fontWeight: 600, marginLeft: 8 }}>{pageLabel(chapter)}</span>
          </div>
        ))}
      </div>
    );
  } else if (style === "minimal") {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {page.entries.map((chapter) => (
          <div
            key={chapter.elementId}
            {...entryProps(chapter)}
            style={{
              ...rowBase,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${spacing / 2}px 0`,
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {renderTitle(chapter)}
            <span style={{ opacity: 0.7, marginLeft: 8 }}>{pageLabel(chapter)}</span>
          </div>
        ))}
      </div>
    );
  } else if (style === "twoColumn") {
    entriesNode = (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16, rowGap: spacing }}>
        {page.entries.map((chapter) => (
          <div key={chapter.elementId} {...entryProps(chapter)} style={{ ...rowBase, display: "flex", alignItems: "baseline" }}>
            {renderTitle(chapter)}
            <span aria-hidden style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", margin: "0 .3em", opacity: 0.6 }}>
              {leader.repeat(40)}
            </span>
            <span style={{ minWidth: "2ch", textAlign: "right" }}>{pageLabel(chapter)}</span>
          </div>
        ))}
      </div>
    );
  } else {
    entriesNode = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {page.entries.map((chapter) => (
          <div
            key={chapter.elementId}
            {...entryProps(chapter)}
            style={{ ...rowBase, display: "flex", alignItems: "baseline", marginBottom: spacing }}
          >
            {renderTitle(chapter)}
            <span aria-hidden style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", margin: "0 .35em", opacity: 0.7 }}>
              {leader.repeat(80)}
            </span>
            <span style={{ minWidth: "2ch", textAlign: rightAligned ? "right" : "left" }}>{pageLabel(chapter)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          fontSize: "1.25em",
          fontWeight: 700,
          marginBottom: spacing * 1.5,
          textAlign: data.align ?? "left",
          color: textColor,
        }}
      >
        {pageNumber ? `${data.tocTitle || "INDEX"} (continued)` : data.tocTitle || "INDEX"}
      </div>
      {noChapters && (
        <div style={{ opacity: 0.55 }}>
          {editable ? "Add Chapter elements to build your index." : "No chapters available."}
        </div>
      )}
      {entriesNode}
    </>
  );
}
