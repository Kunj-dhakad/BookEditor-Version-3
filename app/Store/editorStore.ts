
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Transform = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
};

export type Border = {
  stroke?: string;
  strokeWidth?: number;
  BorderborderRadius?: number;
};

export type Shadow = {
  offsetX?: number;
  offsetY?: number;
  Shadowblur?: number;
  color?: string;
};

export type TextData = Transform & Border & Shadow & {
  type: "text";
  text: string;
  html?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  textAlign?: "left" | "center" | "right";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecorationLine?: string;
  isDragging?: boolean;
  align?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  letterSpacing?: number;
  textDecoration?: "underline" | "line-through" | "none";
  fontStyle?: "normal" | "italic";
  link?: string;
};

export type ImageData = Transform & Border & Shadow & {
  type: "image";
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  maxWidth?: number;
  maxHeight?: number;
  objectFit?: string;
  contrast?: number;
  hueRotate?: number;
  saturate?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  brightness?: number;
  borderRadius?: string;
  rotation?: number;
  transform?: string;
  isDragging?: boolean;
  animationType?: string;
  link?: string;
  flipX?: boolean;
  flipY?: boolean;
  cropRatio?: string;
  strokeStyle?: "none" | "solid" | "dashed" | "dotted" | "inset";
  strokeWidth?: number;
  strokeColor?: string;

};

export type VideoData = Transform & Border & Shadow & {
  type: "video";
  thumbnail?: string;
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  maxWidth?: number;
  maxHeight?: number;
  objectFit?: string;
  contrast?: number;
  hueRotate?: number;
  saturate?: number;
  rotation?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  brightness?: number;
  borderRadius?: string;
  transform?: string;
  isDragging?: boolean;
  animationType?: string;
  link?: string;
  flipX?: boolean;
  flipY?: boolean;
  cropRatio?: string;
  strokeStyle?: "none" | "solid" | "dashed" | "dotted" | "semi-dashed";
  strokeWidth?: number;
  strokeColor?: string;
};

export type ShapeData = Transform & Border & {
  type: "shape";
  shape?: string;
  fill?: string;
  color?: string;
  link?: string;
  flipX?: boolean;
  flipY?: boolean;
  rotation?: number;
  opacity?: number;
  borderRadius?: string;
  strokeStyle?: "none" | "solid" | "dashed" | "dotted" | "inset";
  strokeWidth?: number;
  strokeColor?: string;
};

export type SVGData = Transform & Shadow & {
  type: "svg";
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  maxWidth?: number;
  maxHeight?: number;
  objectFit?: string;
  contrast?: number;
  hueRotate?: number;
  saturate?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
  brightness?: number;
  borderRadius?: string;
  rotation?: number;
  transform?: string;
  isDragging?: boolean;
  animationType?: string;
  link?: string;
  flipX?: boolean;
  flipY?: boolean;
  cropRatio?: string;
  strokeStyle?: "none" | "solid" | "dashed" | "dotted" | "inset";
  strokeWidth?: number;
  strokeColor?: string;
};

export type ButtonData = Transform & Border & Shadow & {
  type: "button";
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  gradientFrom?: string;
  gradientTo?: string;
  link?: string;
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  icon?: string;
  iconPosition?: "left" | "right";
  buttonStyle?: string;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontStyle?: "normal" | "italic";
  textDecorationLine?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  strokeStyle?: "none" | "solid" | "dashed" | "dotted" | "inset";
  shadowPreset?: "none" | "soft" | "regular" | "retro";
  opacity?: number;
};

export type WatermarkData = Transform & {
  type: "watermark";
  text: string;
  color: string;
  fontSize: number;
  pattern: "single" | "grid";
  fontFamily?: string;
  fontWeight?: number | string;

  font?: string;
  letterSpacing?: string;
  imageSrc?: string;
  scale?: string;
};

export type ElementData = TextData | ImageData | ShapeData | SVGData | ButtonData | VideoData | WatermarkData;

export type ElementType = {
  id: string;
  data: ElementData;
};

export type SlideType = {
  id: string;
  height?: number;
  width?: number;
  background?: string;
  subtitle_url?: string;
  subtitle_text?: string;
  subtitle_json?: string;
  thumbnail?: string;
  elements: ElementType[];
};

export type SlideTemplate = {
  background?: string;
  elements: { id: string; data: ElementData }[];
};

export type AISlideData = {
  background?: string;
  width?: number;
  height?: number;
  subtitle_text?: string;
  subtitle_json?: string;
  subtitle_url?: string;
  thumbnail?: string;
  elements: ElementData[];
};

interface EditorStore {
  slides: SlideType[];
  activeSlide: number;
  activeElementId: string | null;
  activeRightPanel: string | null;
  past: SlideType[][];
  future: SlideType[][];

  undo: () => void;
  redo: () => void;
  pushToHistory: () => void;

  addSlide: () => void;
  addSlideToEnd: () => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: () => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  updateSlideBackground: (slideIndex: number, background: string) => void;
  updateSlideSubtitle: (text: string) => void;
  slideUpdateAI: (slideId: string, aiData: AISlideData) => void;

  addElement: (el: ElementData) => void;
  updateElement: (elementId: string, patch: Partial<ElementData>, options?: { history?: boolean }) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;

  bringForward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendBackward: (id: string) => void;
  sendToBack: (id: string) => void;

  setActiveSlide: (index: number) => void;
  setActiveElementId: (id: string | null) => void;
  setActiveRightPanel: (p: string | null) => void;
  applyFullTemplate: (slides: SlideType[]) => void;
  updateAllSlidesSize: (width: number, height: number) => void;
  // moveLayer: (id: string, toIndex: number) => void;
}

const generateId = () => Date.now().toString() + Math.random();

const useEditorStore = create<EditorStore>()(
  persist(
    immer((set, get) => ({
      slides: [{
        id: "1", height: 434, width: 350, background: "#ffffff",
        subtitle_url: "", subtitle_text: "", subtitle_json: "", thumbnail: "", elements: [],
      }],
      activeSlide: 0,
      activeElementId: null,
      activeRightPanel: "text",
      past: [],
      future: [],

      /* ==================== HISTORY ==================== */

      pushToHistory: () => {
        const snapshot = structuredClone(get().slides);
        set((state) => {
          state.past.push(snapshot);
          if (state.past.length > 15) state.past.shift();
          state.future = [];
        });
      },

      undo: () => {
        const past = get().past;
        if (past.length === 0) return;
        const currentSnapshot = structuredClone(get().slides);
        const previous = past[past.length - 1];
        set((state) => {
          state.future.unshift(currentSnapshot);
          if (state.future.length > 15) state.future.pop();
          state.slides = previous;
          state.past.pop();
        });
      },

      redo: () => {
        const future = get().future;
        if (future.length === 0) return;
        const currentSnapshot = structuredClone(get().slides);
        const next = future[0];
        set((state) => {
          state.past.push(currentSnapshot);
          if (state.past.length > 15) state.past.shift();
          state.slides = next;
          state.future.shift();
        });
      },

      /* ==================== SLIDES ==================== */

      updateAllSlidesSize: (width: number, height: number) => {
        get().pushToHistory();
        set((state) => { state.slides.forEach((s) => { s.width = width; s.height = height; }); });
      },

      addSlide: () => {
        get().pushToHistory();
        set((state) => {
          const cur = state.slides[state.activeSlide];
          state.slides.splice(state.activeSlide + 1, 0, {
            id: generateId(), height: cur.height, width: cur.width, background: cur.background,
            subtitle_url: "", subtitle_text: "", subtitle_json: "", thumbnail: "", elements: [],
          });
          state.activeSlide += 1;
        });
      },

      addSlideToEnd: () => {
        get().pushToHistory();
        set((state) => {
          const last = state.slides[state.slides.length - 1];
          state.slides.push({
            id: generateId(), height: last.height, width: last.width, background: last.background,
            subtitle_url: "", subtitle_text: "", subtitle_json: "", thumbnail: "", elements: [],
          });
          state.activeSlide = state.slides.length - 1;
        });
      },

      deleteSlide: (slideId: string) => {
        const index = get().slides.findIndex((s) => s.id === slideId);
        if (index === -1) return;
        get().pushToHistory();
        set((state) => {
          state.slides.splice(index, 1);
          if (state.slides.length === 0) {
            state.slides = [{ id: generateId(), height: 434, width: 350, background: "#ffffff", elements: [] }];
            state.activeSlide = 0;
          } else if (state.activeSlide >= state.slides.length) {
            state.activeSlide = state.slides.length - 1;
          } else if (state.activeSlide === index) {
            state.activeSlide = Math.max(0, index - 1);
          } else if (state.activeSlide > index) {
            state.activeSlide -= 1;
          }
          state.activeElementId = null;
        });
      },

      duplicateSlide: () => {
        get().pushToHistory();
        set((state) => {
          const cur = state.slides[state.activeSlide];
          if (!cur) return;
          const newSlide: SlideType = {
            ...JSON.parse(JSON.stringify(cur)),
            id: generateId(),
            elements: cur.elements.map((el) => ({ id: generateId(), data: { ...el.data } })),
          };
          state.slides.splice(state.activeSlide + 1, 0, newSlide);
          state.activeSlide += 1;
          state.activeElementId = null;
        });
      },

      reorderSlides: (fromIndex: number, toIndex: number) => {
        get().pushToHistory();
        set((state) => {
          const [moved] = state.slides.splice(fromIndex, 1);
          state.slides.splice(toIndex, 0, moved);
        });
      },

      updateSlideBackground: (slideIndex: number, background: string) => {
        get().pushToHistory();
        set((state) => { if (state.slides[slideIndex]) state.slides[slideIndex].background = background; });
      },

      updateSlideSubtitle: (text: string) => {
        get().pushToHistory();
        set((state) => { if (state.slides[state.activeSlide]) state.slides[state.activeSlide].subtitle_text = text; });
      },

      slideUpdateAI: (slideId: string, aiData: AISlideData) => {
        get().pushToHistory();
        set((state) => {
          const slide = state.slides.find((s) => s.id === slideId);
          if (!slide) return;
          slide.background = aiData.background || slide.background;
          slide.subtitle_text = aiData.subtitle_text || slide.subtitle_text;
          slide.subtitle_json = aiData.subtitle_json || slide.subtitle_json;
          slide.subtitle_url = aiData.subtitle_url || slide.subtitle_url;
          slide.thumbnail = aiData.thumbnail || slide.thumbnail;
          slide.elements = aiData.elements.map((el) => ({ id: generateId(), data: el }));
        });
      },

      /* ==================== ELEMENTS ==================== */


      addElement: (el: ElementData) => {
        set((state) => {
          state.slides[state.activeSlide].elements.push({ id: generateId(), data: el });
        });
        setTimeout(() => get().pushToHistory(), 0);
      },


      updateElement: (elementId, patch, options) => {
        set((state) => {
          const slide = state.slides[state.activeSlide];
          if (!slide) return;
          const element = slide.elements.find((el) => el.id === elementId);
          if (!element) return;
          Object.assign(element.data, patch);
        });
        if (options?.history) {
          setTimeout(() => get().pushToHistory(), 0);
        }
      },

      deleteElement: (elementId: string) => {
        get().pushToHistory();
        set((state) => {
          const slide = state.slides[state.activeSlide];
          if (!slide) return;
          const index = slide.elements.findIndex((el) => el.id === elementId);
          if (index !== -1) { slide.elements.splice(index, 1); state.activeElementId = null; }
        });
      },

      duplicateElement: (elementId: string) => {
        get().pushToHistory();
        set((state) => {
          const slide = state.slides[state.activeSlide];
          if (!slide) return;
          const element = slide.elements.find((el) => el.id === elementId);
          if (!element) return;
          const newEl: ElementType = {
            id: generateId(),
            data: { ...element.data, x: element.data.x + 20, y: element.data.y + 20 },
          };
          slide.elements.push(newEl);
          state.activeElementId = newEl.id;
        });
      },

      /* ==================== Z-INDEX ==================== */

      bringForward: (id) => set((state) => {
        const slide = state.slides[state.activeSlide]; if (!slide) return;
        const i = slide.elements.findIndex((el) => el.id === id);
        if (i === -1 || i === slide.elements.length - 1) return;
        [slide.elements[i], slide.elements[i + 1]] = [slide.elements[i + 1], slide.elements[i]];
      }),

      bringToFront: (id) => set((state) => {
        const slide = state.slides[state.activeSlide]; if (!slide) return;
        const i = slide.elements.findIndex((el) => el.id === id); if (i === -1) return;
        const [el] = slide.elements.splice(i, 1); slide.elements.push(el);
      }),

      sendBackward: (id) => set((state) => {
        const slide = state.slides[state.activeSlide]; if (!slide) return;
        const i = slide.elements.findIndex((el) => el.id === id); if (i <= 0) return;
        [slide.elements[i], slide.elements[i - 1]] = [slide.elements[i - 1], slide.elements[i]];
      }),

      sendToBack: (id) => set((state) => {
        const slide = state.slides[state.activeSlide]; if (!slide) return;
        const i = slide.elements.findIndex((el) => el.id === id); if (i === -1) return;
        const [el] = slide.elements.splice(i, 1); slide.elements.unshift(el);
      }),

      /* ==================== SETTERS ==================== */

      setActiveSlide: (index) => set((s) => { s.activeSlide = index; }),
      setActiveElementId: (id) => set((s) => { s.activeElementId = id; }),
      setActiveRightPanel: (p) => set((s) => { s.activeRightPanel = p; }),


      // ============move layer =======//
      // moveLayer: (id, toIndex) =>
      //   set((state) => {
      //     const slideIndex = state.activeSlide;
      //     const slide = state.slides[slideIndex];
      //     if (!slide) return state;

      //     const elements = [...slide.elements];
      //     const fromIndex = elements.findIndex((el) => el.id === id);

      //     if (fromIndex === -1) return state;

      //     const clampedTo = Math.max(0, Math.min(toIndex, elements.length - 1));
      //     if (fromIndex === clampedTo) return state;

      //     const [moved] = elements.splice(fromIndex, 1);
      //     elements.splice(clampedTo, 0, moved);

      //     const newSlides = [...state.slides];
      //     newSlides[slideIndex] = { ...slide, elements };

      //     return { slides: newSlides };
      //   }),
      /* ==================== TEMPLATE ==================== */

      applyFullTemplate: (templateSlides) => {
        set((state) => {
          state.slides = templateSlides.map((sl) => ({
            ...sl, id: generateId(),
            elements: sl.elements.map((el) => ({ id: generateId(), data: { ...el.data } })),
          }));
          state.activeSlide = 0;
          state.activeElementId = null;
        });
      },
    })),
    {
      name: "editor-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        slides: state.slides,
        activeSlide: state.activeSlide,
        activeElementId: state.activeElementId,
        activeRightPanel: state.activeRightPanel,
      }),
    }
  )
);

export default useEditorStore;