"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PreviewPage } from "../types/book";
import type { TextBlock } from "../types/blocks";

interface BlockRange {
  id: string;
  text: string;
  start: number;
  end: number;
}

/** Speech marks arrive nested differently per provider, so they get flattened. */
interface SpeechMark {
  type?: string;
  start_time?: number;
  end_time?: number;
  start?: number;
  end?: number;
  value?: string;
  chunks?: SpeechMark[];
  children?: SpeechMark[];
  words?: SpeechMark[];
  items?: SpeechMark[];
}

const flattenMarks = (
  mark: SpeechMark | SpeechMark[] | null | undefined,
): SpeechMark[] => {
  if (!mark) return [];
  if (Array.isArray(mark)) return mark.flatMap(flattenMarks);
  const nested = mark.chunks || mark.children || mark.words || mark.items || [];
  return [...(mark.type === "word" ? [mark] : []), ...flattenMarks(nested)];
};

/** Reading order: top to bottom, left to right within the same visual line. */
const readingOrder = (page: PreviewPage): TextBlock[] =>
  page.blocks
    .filter(
      (block): block is TextBlock =>
        block.kind === "text" && block.text.trim().length > 0,
    )
    .sort((a, b) =>
      Math.abs(a.y - b.y) < 15 ? a.x - b.x : a.y - b.y,
    );

interface Args {
  pages: PreviewPage[];
  currentPage: number;
}

/** Read-aloud for the page on screen. */
export function useNarration({ pages, currentPage }: Args) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingBlockId, setSpeakingBlockId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const generatingRef = useRef(false);

  const releaseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    releaseAudio();
    setSpeakingBlockId(null);
    setIsSpeaking(false);
    setIsPaused(false);
  }, [releaseAudio]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPaused(true);
    setIsSpeaking(true);
  }, []);

  const resume = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPaused(false);
      setIsSpeaking(true);
    } catch {
      setMessage("Resume failed. Please press play again.");
    }
  }, []);

  const speak = useCallback(async () => {
    if (generatingRef.current) return;
    if (audioRef.current && !audioRef.current.paused) return;

    generatingRef.current = true;
    try {
      stop();

      const page = pages[currentPage - 1];
      if (!page) {
        setMessage("No active page to read.");
        return;
      }

      let fullText = "";
      const ranges: BlockRange[] = [];
      readingOrder(page).forEach((block) => {
        const text = block.text.trim();
        if (!text) return;
        const start = fullText.length;
        fullText += `${text} `;
        ranges.push({ id: block.id, text, start, end: fullText.length });
      });

      if (!fullText.trim()) {
        setMessage("No text found on this page");
        return;
      }

      setMessage("Generating voice…");
      setIsSpeaking(true);
      setIsPaused(false);

      const response = await fetch("/api/speechify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText.trim() }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Narration request failed");
      }

      const payload = await response.json();
      const binary = atob(payload.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

      const url = URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audio.playbackRate = 0.85;
      audioRef.current = audio;

      const marks = flattenMarks(payload.speechMarks);

      audio.ontimeupdate = () => {
        if (!audioRef.current || marks.length === 0) return;
        const elapsedMs = audioRef.current.currentTime * 1000;
        const active = marks.find((mark) => {
          const start = Number(mark.start_time ?? 0);
          return elapsedMs >= start && elapsedMs <= Number(mark.end_time ?? start + 300);
        });
        if (!active) return;
        const charIndex = Number(active.start ?? 0);
        const range = ranges.find(
          (candidate) => charIndex >= candidate.start && charIndex <= candidate.end,
        );
        if (range) setSpeakingBlockId(range.id);
      };
      audio.onplay = () => {
        setMessage("");
        setIsSpeaking(true);
        setIsPaused(false);
      };
      audio.onpause = () => {
        if (audioRef.current) {
          setIsPaused(true);
          setIsSpeaking(true);
        }
      };
      audio.onended = stop;
      audio.onerror = () => {
        stop();
        setMessage("Narration audio failed.");
      };

      await audio.play();
    } catch (error) {
      setIsSpeaking(false);
      setIsPaused(false);
      setMessage(error instanceof Error ? error.message : "Narration failed.");
    } finally {
      generatingRef.current = false;
    }
  }, [currentPage, pages, stop]);

  // Turning the page cancels narration of the page you left.
  useEffect(() => {
    stop();
    setMessage("");
  }, [currentPage, stop]);

  useEffect(() => releaseAudio, [releaseAudio]);

  return {
    isSpeaking,
    isPaused,
    speakingBlockId,
    message,
    speak,
    pause,
    resume,
    stop,
  };
}
