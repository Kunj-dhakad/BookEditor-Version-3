"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";

import { BookPageData, ViewMode } from "../../types/book";
import useEditorStore from "@/app/Store/editorStore";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

export interface BookContextValue {
  rawJson: string;
  setRawJson: (json: string) => void;

  pages: BookPageData[] | null;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
  setPage: (pageNumber: number) => void;
  goToLinkedPage: (linkValue: string) => void;

  totalPages: number;

  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;

  resetBook: () => void;

  scale: number;
  setPageFlipRef: (refValue: unknown) => void;

  bookWidth: number;
  bookHeight: number;

  isSpeaking: boolean;
  isPaused: boolean;
  speakingElementId: string | null;
  speakingWordIndex: number | null;
  ttsMessage: string;

  speakCurrentPage: () => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;

  blockMouseFlip: boolean;
  setBlockMouseFlip: React.Dispatch<React.SetStateAction<boolean>>;
}
interface PageFlipHandle {
  current?: PageFlipHandle | null;
  pageFlip?: (() => PageFlipHandle) | PageFlipHandle;
  turnToPage?: (page: number) => void;
  flip?: (page: number) => void;
  turnPage?: (page: number) => void;
  flipNext?: () => void;
  flipPrev?: () => void;
}

interface ElementRange {
  id: string;
  text: string;
  start: number;
  end: number;
}
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

const BookStateContext = createContext<BookContextValue | null>(null);

export const useBook = (): BookContextValue => {
  const context = useContext(BookStateContext);

  if (!context) {
    throw new Error("useBook must be used within a BookStateProvider");
  }

  return context;
};

interface BookStateProviderProps {
  children: ReactNode;
}

export const BookStateProvider = ({ children }: BookStateProviderProps) => {
  const editorSlides = useEditorStore((state) => state.slides);
  const [rawJson, setRawJson] = useState<string>(() =>
    JSON.stringify(useEditorStore.getState().slides, null, 2),
  );

  const isGeneratingSpeechRef = useRef(false);
  useEffect(() => {
    const ui = useEditorUIStore.getState();
    const previous = ui.imageExportMode;
    ui.setImageExportMode(true);
    return () => useEditorUIStore.getState().setImageExportMode(previous);
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>("flipbook");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [blockMouseFlip, setBlockMouseFlip] = useState(false);
  const pageFlipRef = useRef<PageFlipHandle | null>(null);

  const setPageFlipRef = useCallback((refValue: unknown) => {
    pageFlipRef.current = refValue as PageFlipHandle | null;
  }, []);

  const getPageFlip = useCallback((): PageFlipHandle | null => {
    let instance: PageFlipHandle | null | undefined = pageFlipRef.current;

    if (!instance) return null;

    if (instance.current) {
      instance = instance.current;
    }

    if (!instance) return null;

    if (typeof instance.pageFlip === "function") {
      return instance.pageFlip();
    }

    if (instance.pageFlip) {
      return instance.pageFlip;
    }

    return instance;
  }, []);

  const normalizedData = useMemo(() => {
    try {
      if (!rawJson || !rawJson.trim()) {
        return {
          pages: [],
          width: 350,
          height: 434,
          isCorrupted: false,
        };
      }

      let isCorrupted = false;

      try {
        JSON.parse(rawJson);
      } catch {
        isCorrupted = true;
      }

      const parsed = JSON.parse(rawJson) as unknown;
      const source = Array.isArray(parsed)
        ? parsed
        : ((
            parsed as {
              slides?: unknown[];
              pages?: unknown[];
              items?: unknown[];
            }
          )?.slides ??
          (parsed as { pages?: unknown[] })?.pages ??
          (parsed as { items?: unknown[] })?.items ??
          []);
      const pages = source as BookPageData[];
      const firstPage = pages[0];

      return {
        pages: isCorrupted ? null : pages,
        width: firstPage?.width ?? 350,
        height: firstPage?.height ?? 434,
        isCorrupted,
      };
    } catch (error) {
      console.warn("Failed to parse Book JSON via normalizer", error);

      return {
        pages: null,
        width: 350,
        height: 434,
        isCorrupted: true,
      };
    }
  }, [rawJson]);

  useEffect(() => {
    setRawJson(JSON.stringify(editorSlides, null, 2));
  }, [editorSlides]);

  const pages = normalizedData.pages;
  const bookWidth = normalizedData.width;
  const bookHeight = normalizedData.height;

  const [scale, setScale] = useState<number>(1);

  const scrollToPage = useCallback(
    (pageNumber: number) => {
      let el: HTMLElement | null = null;

      if (viewMode === "vertical") {
        el = document.getElementById(`vert-page-wrapper-${pageNumber}`);
      } else if (viewMode === "horizontal") {
        el = document.getElementById(`horiz-page-wrapper-${pageNumber}`);
      } else {
        el = document.getElementById(`reader-page-${pageNumber}`);
      }

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    },
    [viewMode],
  );

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (!pages || pages.length === 0) return;

      const target = Math.max(1, Math.min(pages.length, pageNumber));
      const pf = getPageFlip();

      setCurrentPage(target);

      if (viewMode === "flipbook" && pf) {
        const zeroBasedIndex = target - 1;

        if (typeof pf.turnToPage === "function") {
          pf.turnToPage(zeroBasedIndex);
        } else if (typeof pf.flip === "function") {
          pf.flip(zeroBasedIndex);
        } else if (typeof pf.turnPage === "function") {
          pf.turnPage(zeroBasedIndex);
        }
      } else {
        scrollToPage(target);
      }
    },
    [pages, viewMode, getPageFlip, scrollToPage],
  );

  const goToLinkedPage = useCallback(
    (linkValue: string) => {
      if (!linkValue || !pages || pages.length === 0) return;

      const cleanLink = String(linkValue).trim();

      let targetIndex = pages.findIndex(
        (page) => String(page.id).trim() === cleanLink,
      );

      if (targetIndex === -1 && !Number.isNaN(Number(cleanLink))) {
        targetIndex = Number(cleanLink) - 1;
      }

      if (targetIndex < 0 || targetIndex >= pages.length) {
        console.warn("Linked page not found:", cleanLink);
        return;
      }

      const targetPage = targetIndex + 1;

      goToPage(targetPage);
    },
    [pages, goToPage],
  );

  useEffect(() => {
    if (viewMode !== "flipbook" || !pages) return;

    const calculateScale = () => {
      const availableWidth = window.innerWidth - 180;
      const availableHeight = window.innerHeight - 150;

      const openBookWidth = bookWidth * 2;

      const calculatedScale = Math.min(
        1,
        availableWidth / openBookWidth,
        availableHeight / bookHeight,
      );

      setScale(Math.max(0.1, calculatedScale));
    };

    calculateScale();

    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, [viewMode, bookWidth, bookHeight, pages]);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(250, prev + 10));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(30, prev - 10));
  }, []);

  const nextPage = useCallback(() => {
    if (!pages || pages.length === 0) return;

    const pf = getPageFlip();

    if (viewMode === "flipbook" && pf) {
      if (typeof pf.flipNext === "function") {
        pf.flipNext();
      }
    } else {
      const next = Math.min(pages.length, currentPage + 1);
      goToPage(next);
    }
  }, [pages, viewMode, currentPage, getPageFlip, goToPage]);

  const prevPage = useCallback(() => {
    if (!pages || pages.length === 0) return;

    const pf = getPageFlip();

    if (viewMode === "flipbook" && pf) {
      if (typeof pf.flipPrev === "function") {
        pf.flipPrev();
      }
    } else {
      const prev = Math.max(1, currentPage - 1);
      goToPage(prev);
    }
  }, [pages, viewMode, currentPage, getPageFlip, goToPage]);

  const setPage = useCallback(
    (pageNumber: number) => {
      goToPage(pageNumber);
    },
    [goToPage],
  );

  const resetBook = useCallback(() => {
    setZoomLevel(100);
    goToPage(1);
  }, [goToPage]);

  const totalPages = pages ? pages.length : 0;

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speakingElementId, setSpeakingElementId] = useState<string | null>(
    null,
  );
  const [speakingWordIndex, setSpeakingWordIndex] = useState<number | null>(
    null,
  );
  const [ttsMessage, setTtsMessage] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }

    setSpeakingElementId(null);
    setSpeakingWordIndex(null);
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);
  const pauseSpeech = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    setIsPaused(true);
    setIsSpeaking(true);
  }, []);

  const resumeSpeech = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      await audio.play();
      setIsPaused(false);
      setIsSpeaking(true);
    } catch (error) {
      console.error("Resume failed:", error);
      setTtsMessage("Resume failed. Please press play again.");
    }
  }, []);
  const speakCurrentPage = useCallback(async () => {
    if (isGeneratingSpeechRef.current) return;

    if (audioRef.current && !audioRef.current.paused) {
      return;
    }

    isGeneratingSpeechRef.current = true;

    try {
      stopSpeech();

      if (!pages || pages.length === 0 || !pages[currentPage - 1]) {
        setTtsMessage("No active page to read.");
        return;
      }

      const page = pages[currentPage - 1];

      const textElements =
        page.elements?.filter(
          (el) =>
            el &&
            el.data &&
            el.data.type === "text" &&
            String(el.data.text || "").trim().length > 0,
        ) || [];

      const sorted = [...textElements].sort((a, b) => {
        const ay = a.data.y || 0;
        const by = b.data.y || 0;
        const ax = a.data.x || 0;
        const bx = b.data.x || 0;

        if (Math.abs(ay - by) < 15) return ax - bx;
        return ay - by;
      });

      let fullText = "";
      const elementRanges: ElementRange[] = [];

      sorted.forEach((el) => {
        const text =
          el.data.type === "text" ? String(el.data.text || "").trim() : "";
        if (!text) return;

        const start = fullText.length;
        fullText += text + " ";
        const end = fullText.length;

        elementRanges.push({
          id: el.id,
          text,
          start,
          end,
        });
      });

      if (!fullText.trim()) {
        setTtsMessage("No text found on this page");
        return;
      }

      setTtsMessage("Generating Speechify voice...");
      setIsSpeaking(true);
      setIsPaused(false);

      const response = await fetch("/api/speechify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: fullText.trim() }),
      });

      console.log("STATUS =", response.status);
      console.log("STATUS TEXT =", response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Speechify failed");
      }

      const data = await response.json();
      const flattenSpeechMarks = (
        mark: SpeechMark | SpeechMark[] | null | undefined,
      ): SpeechMark[] => {
        if (!mark) return [];

        if (Array.isArray(mark)) {
          return mark.flatMap(flattenSpeechMarks);
        }

        const nested =
          mark.chunks || mark.children || mark.words || mark.items || [];

        const current = mark.type === "word" ? [mark] : [];

        return [...current, ...flattenSpeechMarks(nested)];
      };

      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.playbackRate = 0.85;
      audioRef.current = audio;

      const marks = flattenSpeechMarks(data.speechMarks);

      audio.ontimeupdate = () => {
        if (!audioRef.current || marks.length === 0) return;

        const currentMs = audioRef.current.currentTime * 1000;

        const activeMark = marks.find((mark: SpeechMark) => {
          const startTime = Number(mark.start_time ?? 0);
          const endTime = Number(mark.end_time ?? startTime + 300);

          return currentMs >= startTime && currentMs <= endTime;
        });

        if (!activeMark) return;

        const charStart = Number(activeMark.start ?? 0);

        const activeElement = elementRanges.find((range) => {
          return charStart >= range.start && charStart <= range.end;
        });

        if (!activeElement) return;

        setSpeakingElementId(activeElement.id);

        const localCharIndex = Math.max(0, charStart - activeElement.start);
        const beforeText = activeElement.text.slice(0, localCharIndex);

        const wordIndex = beforeText.trim().split(/\s+/).filter(Boolean).length;

        setSpeakingWordIndex(wordIndex);
      };
      audio.onplay = () => {
        setTtsMessage("");
        setIsSpeaking(true);
        setIsPaused(false);
      };

      audio.onpause = () => {
        if (audioRef.current) {
          setIsPaused(true);
          setIsSpeaking(true);
        }
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;

        setSpeakingElementId(null);
        setSpeakingWordIndex(null);
        setIsSpeaking(false);
        setIsPaused(false);
        setTtsMessage("");
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;

        setSpeakingElementId(null);
        setSpeakingWordIndex(null);
        setIsSpeaking(false);
        setIsPaused(false);
        setTtsMessage("Speechify audio failed.");
      };

      await audio.play();
    } catch (error) {
      console.error("FULL SPEECHIFY ERROR =", error);

      setIsSpeaking(false);
      setIsPaused(false);
      setTtsMessage(
        error instanceof Error ? error.message : "Speechify voice failed.",
      );
    } finally {
      isGeneratingSpeechRef.current = false;
    }
  }, [pages, currentPage, stopSpeech]);

  useEffect(() => {
    stopSpeech();
    setTtsMessage("");
  }, [currentPage, stopSpeech]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <BookStateContext.Provider
      value={{
        rawJson,
        setRawJson,   
        pages,
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        nextPage,
        prevPage,
        goToPage,
        setPage,
        goToLinkedPage,
        totalPages,
        zoomLevel,
        zoomIn,
        zoomOut,
        setZoomLevel,
        resetBook,
        scale,
        setPageFlipRef,
        bookWidth,
        bookHeight,
        isSpeaking,
        isPaused,
        speakingElementId,
        speakingWordIndex,
        ttsMessage,
        speakCurrentPage,
        pauseSpeech,
        resumeSpeech,
        stopSpeech,
        blockMouseFlip,
        setBlockMouseFlip,
      }}
    >
      {children}
    </BookStateContext.Provider>
  );
};

export default BookStateContext;
