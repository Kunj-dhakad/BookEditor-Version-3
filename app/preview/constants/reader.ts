import type { InteractionKind } from "../types/interaction";

/** Used whenever exported JSON omits page geometry. */
export const DEFAULT_PAGE_WIDTH = 350;
export const DEFAULT_PAGE_HEIGHT = 434;
export const DEFAULT_PAGE_BACKGROUND = "#ffffff";

export const MIN_ZOOM = 30;
export const MAX_ZOOM = 250;
export const ZOOM_STEP = 10;
export const DEFAULT_ZOOM = 100;

/**
 * Text blocks are authored inside a 6px-inset box; the stored rect is the
 * inner content box, so the rendered box grows by this on every side.
 */
export const TEXT_BOX_PADDING = 6;

export const NAV_INTERACTION_KINDS: InteractionKind[] = [
  "nav-prev-page",
  "nav-next-page",
  "nav-goto-page",
  "nav-first-page",
  "nav-last-page",
];

/** Interactions that open a modal instead of navigating or linking out. */
export const POPUP_INTERACTION_KINDS: InteractionKind[] = [
  "quiz",
  "question",
  "contact-form",
  "spotlight",
  "video-button",
  "audio-button",
  "popup-slideshow",
];

export const ENGAGEMENT_FALLBACK_LABEL: Partial<Record<InteractionKind, string>> = {
  quiz: "TAKE QUIZ",
  question: "ANSWER QUESTION",
  spotlight: "VIEW SPOTLIGHT",
  "contact-form": "Contact form",
};
