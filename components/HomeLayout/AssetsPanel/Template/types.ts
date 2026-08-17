import type { SlideType } from "@/app/Store/editorStore";

/**
 * One row of `sl_editor_template_listing`. Field names mirror the API response
 * exactly — the backend contract is unchanged.
 */
export interface TemplateListItem {
    id: number;
    thumbnail_url: string;
    title: string;
    template_category: string;
    json: string;
    json_url: string;
}

/**
 * A template slide once parsed. Deliberately the editor's own slide type, so a
 * preview renders through the same renderer the canvas/pages panel use and the
 * same object can be handed straight to the store.
 */
export type TemplateSlide = SlideType;

/** What the preview panel is currently doing. */
export type TemplatePreviewStatus = "loading" | "ready" | "error" | "empty";
