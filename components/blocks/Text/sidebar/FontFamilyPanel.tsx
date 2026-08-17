"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEditorStore from "@/app/Store/editorStore";
import { loadGoogleFont } from "@/lib/FontFamily/useFontLoader";
import { CURATED_FONTS, type FontItem } from "@/lib/FontFamily/fonts";

async function fetchGoogleFonts(): Promise<FontItem[]> {
  try {
    const res = await fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_API_KEY&sort=popularity"
    );

    const data = await res.json();

    if (!data.items?.length) return CURATED_FONTS;

    return data.items
      .slice(0, 100)
      .map((f: { family: string; category: string }) => ({
        family: f.family,
        category: f.category,
      }));
  } catch {
    return CURATED_FONTS;
  }
}


const FontRow: React.FC<{
  font: FontItem;
  isActive: boolean;
  onSelect: (family: string) => void;
}> = React.memo(({ font, isActive, onSelect }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadGoogleFont(font.family);
          setLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [font.family]);

  return (
    <div
      ref={rowRef}
      onClick={() => onSelect(font.family)}
      className={`kd-font-row ${isActive ? "kd-font-row-active" : ""}`}
    >
      <svg
        width="14" height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="kd-font-row-icon"
      >
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span
        style={{
          fontFamily: loaded ? font.family : "inherit",
        }}
        className="kd-font-row-text"
      >
        {font.family}
      </span>
    </div>
  );
});
FontRow.displayName = "FontRow";

const FontFamilyPanel: React.FC = () => {
  const [fonts, setFonts] = useState<FontItem[]>(CURATED_FONTS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentFonts, setRecentFonts] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("editor_recent_fonts") || "[]");
    } catch {
      return [];
    }
  });

  const updateElement = useEditorStore((s) => s.updateElement);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);

  const element = slides[activeSlide]?.elements.find((el) => el.id === activeElementId);
  const currentFont =
    element && (element.data.type === "text" || element.data.type === "button")
      ? element.data.fontFamily
      : undefined;

  useEffect(() => {
    recentFonts.forEach(loadGoogleFont);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGoogleFonts()
      .then((data) => {
        if (data && data.length > 0) setFonts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? fonts.filter((f) => f.family.toLowerCase().includes(search.toLowerCase()))
    : fonts;

  const handleSelect = useCallback(
    (family: string) => {
      if (!element) return;
      loadGoogleFont(family);
      updateElement(element.id, { fontFamily: family }, { history: true });

      setRecentFonts((prev) => {
        const next = [family, ...prev.filter((f) => f !== family)].slice(0, 5);
        try {
          localStorage.setItem("editor_recent_fonts", JSON.stringify(next));
        } catch {  }
        return next;
      });
    },
    [element, updateElement]
  );

  return (
    <div className="flex flex-col h-full">

      <div className="px-4 pt-1 pb-2">
        <h3 className="kd-font-panel-heading mb-3">Font</h3>

        <div className="kd-font-search-wrapper">
          <svg
            className="kd-font-search-icon"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="kd-font-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="kd-font-search-clear">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4 kd-custom-scrollbar">

        {!search && currentFont && (
          <div className="mb-3">
            <p className="kd-font-section-label">Current font</p>
            <div className="kd-font-recent-box" style={{ fontFamily: currentFont }}>
              {currentFont}
            </div>
          </div>
        )}

        {!search && recentFonts.length > 0 && (
          <div className="mb-2">
            <p className="kd-font-section-label px-2">Recently used</p>
            {recentFonts.map((family) => (
              <FontRow
                key={`recent-${family}`}
                font={{ family }}
                isActive={currentFont === family}
                onSelect={handleSelect}
              />
            ))}
            <hr className="kd-font-divider" />
          </div>
        )}

        {loading && (
          <p className="kd-font-loading-text animate-pulse">Loading fonts...</p>
        )}

        {!loading && (
          <p className="kd-font-section-label px-2">
            {search ? `${filtered.length} results` : "All fonts"}
          </p>
        )}

        {filtered.map((font) => (
          <FontRow
            key={font.family}
            font={font}
            isActive={currentFont === font.family}
            onSelect={handleSelect}
          />
        ))}

        {filtered.length === 0 && search && (
          <p className="kd-font-empty-text">No fonts found</p>
        )}
      </div>
    </div>
  );
};

export default FontFamilyPanel;