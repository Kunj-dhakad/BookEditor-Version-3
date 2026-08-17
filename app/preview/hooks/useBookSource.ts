"use client";

import { useEffect, useMemo, useState } from "react";
import type { PreviewBookResult } from "../types/book";
import { parseBook } from "../parser/parseBook";
import { parseTheme } from "../parser/parseTheme";

export interface BookSource {
  /** Exported book JSON. */
  json?: string;
  /** URL the JSON is fetched from when `json` is not supplied. */
  jsonUrl?: string;
}

const EMPTY: PreviewBookResult = {
  ok: true,
  pages: [],
  theme: parseTheme([]),
  chapters: [],
};

/**
 * The single point where data enters the preview. Everything downstream is a
 * pure function of the parsed result, which is what keeps the reader free of
 * any store.
 */
export function useBookSource({ json, jsonUrl }: BookSource): {
  book: PreviewBookResult;
  loading: boolean;
} {
  const [fetched, setFetched] = useState<string | null>(null);

  // Pointing at a different book drops the previous one immediately, so the
  // reader never shows stale pages while the new fetch is in flight.
  const [requestedUrl, setRequestedUrl] = useState(jsonUrl);
  if (requestedUrl !== jsonUrl) {
    setRequestedUrl(jsonUrl);
    setFetched(null);
  }

  useEffect(() => {
    // An inline `json` prop always wins; the URL is only a fallback source.
    if (json !== undefined || !jsonUrl) return;

    let active = true;

    fetch(jsonUrl)
      .then((response) => response.text())
      .then((text) => {
        if (active) setFetched(text);
      })
      .catch((error) => {
        console.warn("Preview could not fetch the book JSON", error);
        // An empty document parses to an empty book, which renders the
        // "no pages" state instead of hanging on a spinner.
        if (active) setFetched("");
      });

    return () => {
      active = false;
    };
  }, [json, jsonUrl]);

  const source = json ?? fetched;
  const loading = json === undefined && Boolean(jsonUrl) && fetched === null;

  const book = useMemo(() => {
    if (source === null || source === undefined) return EMPTY;
    return parseBook(source);
  }, [source]);

  return { book, loading };
}
