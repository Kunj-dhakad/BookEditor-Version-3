"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noopSubscribe = () => () => {};

/**
 * Escape hatch out of the page box.
 *
 * Book pages are `overflow: hidden` and, in flipbook mode, live inside
 * transformed/scaled containers — an absolutely positioned dialog rendered in
 * place gets clipped by the page and scaled with it. Everything modal in the
 * reader therefore mounts on <body>, above the whole document.
 */
export default function PopupPortal({ children }: { children: ReactNode }) {
  // document.body only exists after hydration, so the portal waits for the
  // client snapshot rather than rendering during SSR.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
