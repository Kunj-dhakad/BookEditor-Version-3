"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import useEditorStore, { TextData } from "@/app/Store/editorStore";
import TextAIGenBox from "./textAIGenBox";
import LinkEditBox from "./linkEditBox";
import useEditorUIStore from "@/app/Store/useEditorUIStore";
import LineHeightLetterSpacing from "./lineHeightLetterSpacing";
import { KdCamelCaseIcon, KdGradBgIcon, KdLinkAddIcon, KdListDigitIcon, KdListItemsIcon, KdMagicWandIcon, KdTextBoldIcon, KdTextColorIcon, KdTextEditMinus, KdTextEditPlus, KdTextItalicIcon, KdTextLetterSpaceIcon, KdTextStrikeIcon, KdTextSubScriptIcon, KdTextSuperScriptIcon, KdTextUnderlineIcon } from "@/lib/icon/icons"
type FormatCommand = "bold" | "italic" | "underline" | "strikeThrough";
interface StyleMap { prop: string; on: string; off: string; tags: string[]; }

const FORMAT_MAP: Record<FormatCommand, StyleMap> = {
  bold: { prop: "fontWeight", on: "bold", off: "normal", tags: ["b", "strong"] },
  italic: { prop: "fontStyle", on: "italic", off: "normal", tags: ["i", "em"] },
  underline: { prop: "textDecoration", on: "underline", off: "none", tags: ["u"] },
  strikeThrough: { prop: "textDecoration", on: "line-through", off: "none", tags: ["s", "strike"] },
};


const TEXT_TRANSFORMS = ["uppercase", "lowercase", "capitalize"] as const;
type TextTransform = typeof TEXT_TRANSFORMS[number];

const getNextTransform = (current: string | undefined): TextTransform => {
  const idx = TEXT_TRANSFORMS.indexOf((current || "none") as TextTransform);
  return TEXT_TRANSFORMS[(idx + 1) % TEXT_TRANSFORMS.length];
};

export function getSelectedTextNodes(range: Range): Text[] {
  const root = range.commonAncestorContainer;
  const walker = document.createTreeWalker(
    root.nodeType === Node.TEXT_NODE ? root.parentNode! : root,
    NodeFilter.SHOW_TEXT
  );
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const tn = walker.currentNode as Text;
    if (range.intersectsNode(tn)) nodes.push(tn);
  }
  return nodes;
}

export function sliceTextNode(tn: Text, range: Range): Text {
  let node = tn;
  if (tn === range.endContainer && range.endOffset < node.length) node.splitText(range.endOffset);
  if (tn === range.startContainer && range.startOffset > 0) node = node.splitText(range.startOffset);
  return node;
}

function wrapTextNode(tn: Text, cssProp: string, value: string): HTMLSpanElement {
  const span = document.createElement("span");
  (span.style as unknown as Record<string, string>)[cssProp] = value;
  tn.parentNode!.insertBefore(span, tn);
  span.appendChild(tn);
  return span;
}

function isNodeStyled(tn: Text, cssProp: string, onValue: string): boolean {
  const el = tn.parentElement;
  if (!el) return false;
  const computed = window.getComputedStyle(el);
  if (cssProp === "fontWeight") return parseInt(computed.fontWeight, 10) >= 700;
  if (cssProp === "textDecoration") return computed.textDecorationLine.includes(onValue);
  return (computed as unknown as Record<string, string>)[cssProp] === onValue;
}

function restoreSelection(spans: HTMLSpanElement[]): void {
  if (!spans.length) return;
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  const r = document.createRange();
  r.setStartBefore(spans[0].firstChild!);
  r.setEndAfter(spans[spans.length - 1].lastChild!);
  sel.addRange(r);
}




function applyInlineStyle(range: Range, cssProp: string, onValue: string, offValue: string): void {
  const textNodes = getSelectedTextNodes(range);
  if (!textNodes.length) return;
  const applyValue = textNodes.every((tn) => isNodeStyled(tn, cssProp, onValue)) ? offValue : onValue;
  const spans: HTMLSpanElement[] = [];
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1) {
      (parent.style as unknown as Record<string, string>)[cssProp] = applyValue;
      spans.push(parent);
    } else {
      spans.push(wrapTextNode(sliced, cssProp, applyValue));
    }
  }
  restoreSelection(spans);
}

function applyFontSize(range: Range, newSizePx: number): void {
  const textNodes = getSelectedTextNodes(range);
  if (!textNodes.length) return;
  const spans: HTMLSpanElement[] = [];
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1) {
      parent.style.fontSize = `${newSizePx}px`;
      spans.push(parent);
    } else {
      spans.push(wrapTextNode(sliced, "fontSize", `${newSizePx}px`));
    }
  }
  restoreSelection(spans);
}


export function applyPendingLink(range: Range): void {
  const textNodes = getSelectedTextNodes(range);
  if (!textNodes.length) return;
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "A") {
      parent.setAttribute("data-pending-link", "true");
    } else {
      const a = document.createElement("a");
      a.setAttribute("data-pending-link", "true");
      a.style.textDecoration = "underline";
      a.style.textDecorationStyle = "dashed";
      a.style.backgroundColor = "rgba(124, 58, 237, 0.18)";
      sliced.parentNode!.insertBefore(a, sliced);
      a.appendChild(sliced);
    }
  }
}

export function finalizePendingLink(root: HTMLElement, url: string): void {
  root.querySelectorAll('a[data-pending-link="true"]').forEach((a) => {
    const anchor = a as HTMLAnchorElement;
    anchor.href = url;
    anchor.target = "_blank";
    anchor.removeAttribute("data-pending-link");
    anchor.style.backgroundColor = "";
    anchor.style.textDecorationStyle = "";
    anchor.style.textDecoration = "underline";
  });
}

export function cancelPendingLink(root: HTMLElement): void {
  root.querySelectorAll('a[data-pending-link="true"]').forEach((a) => {
    const parent = a.parentNode;
    if (!parent) return;
    while (a.firstChild) parent.insertBefore(a.firstChild, a);
    parent.removeChild(a);
  });
}

export function removeFinalizedLink(range: Range): void {
  const textNodes = getSelectedTextNodes(range);
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "A") {
      const gp = parent.parentNode;
      if (gp) {
        while (parent.firstChild) gp.insertBefore(parent.firstChild, parent);
        gp.removeChild(parent);
      }
    }
  }
}


export function markPendingFormatSelection(range: Range, marker: string): void {
  const textNodes = getSelectedTextNodes(range);
  if (!textNodes.length) return;
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1) {
      parent.setAttribute(marker, "true");
    } else {
      const span = document.createElement("span");
      span.setAttribute(marker, "true");
      sliced.parentNode!.insertBefore(span, sliced);
      span.appendChild(sliced);
    }
  }
}

export function applyToPendingMarked(root: HTMLElement, marker: string, apply: (el: HTMLElement) => void): void {
  root.querySelectorAll(`[${marker}="true"]`).forEach((el) => {
    apply(el as HTMLElement);
    // el.removeAttribute(marker);
  });
}



export function clearPendingMarked(root: HTMLElement, marker: string): void {
  root.querySelectorAll(`[${marker}="true"]`).forEach((el) => {
    const span = el as HTMLElement;
    if (!span.getAttribute("style")?.trim()) {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
      }
    } else {
      span.removeAttribute(marker);
    }
  });
}


function applyVerticalAlign(range: Range, value: "sub" | "super"): void {
  const textNodes = getSelectedTextNodes(range);
  if (!textNodes.length) return;
  const allAligned = textNodes.every((tn) => {
    const el = tn.parentElement;
    return el ? window.getComputedStyle(el).verticalAlign === value : false;
  });
  const applyValue = allAligned ? "baseline" : value;
  const fs = applyValue !== "baseline" ? "0.75em" : "";
  const spans: HTMLSpanElement[] = [];
  for (const tn of textNodes) {
    const sliced = sliceTextNode(tn, range);
    const parent = sliced.parentElement;
    if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1) {
      parent.style.verticalAlign = applyValue;
      if (fs) {
        parent.style.fontSize = fs;
      } else {
        parent.style.removeProperty("font-size");
      }
      spans.push(parent);
    } else {
      const span = document.createElement("span");
      span.style.verticalAlign = applyValue;
      if (fs) span.style.fontSize = fs;
      sliced.parentNode!.insertBefore(span, sliced);
      span.appendChild(sliced);
      spans.push(span);
    }
  }
  restoreSelection(spans);
}

function removeAllInlineTags(root: HTMLElement, tags: string[]): void {
  tags.forEach((tag) => {
    root.querySelectorAll(tag).forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
  });
  root.querySelectorAll("[style]").forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (tags.some((t) => ["b", "strong"].includes(t))) htmlEl.style.removeProperty("font-weight");
    if (tags.some((t) => ["i", "em"].includes(t))) htmlEl.style.removeProperty("font-style");
    if (tags.some((t) => ["u", "s", "strike"].includes(t))) htmlEl.style.removeProperty("text-decoration");
    if (!htmlEl.getAttribute("style")?.trim()) htmlEl.removeAttribute("style");
  });
}


function execListOnElement(el: HTMLDivElement, type: "ul" | "ol", savedRange: Range | null): void {
  if (savedRange && !savedRange.collapsed) {
    const commonAnc = savedRange.commonAncestorContainer;
    const existingList = (commonAnc.nodeType === Node.TEXT_NODE
      ? commonAnc.parentElement
      : commonAnc as HTMLElement
    )?.closest("ul, ol") as HTMLElement | null;

    if (existingList) {
      const existingType = existingList.tagName.toLowerCase() as "ul" | "ol";
      if (existingType === type) {
        const fragment = document.createDocumentFragment();
        Array.from(existingList.querySelectorAll("li")).forEach((li, i) => {
          if (i > 0) fragment.appendChild(document.createElement("br"));
          Array.from(li.childNodes).forEach((n) => fragment.appendChild(n.cloneNode(true)));
        });
        existingList.replaceWith(fragment);
      } else {
        const newList = document.createElement(type);
        newList.innerHTML = existingList.innerHTML;
        existingList.replaceWith(newList);
      }
      return;
    }

    const selectedFragment = savedRange.cloneContents();
    const selectedText = selectedFragment.textContent || "";
    if (!selectedText.trim()) return;

    const lines = selectedText.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    const newList = document.createElement(type);
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line.trim();
      newList.appendChild(li);
    });

    savedRange.deleteContents();
    savedRange.insertNode(newList);

    window.getSelection()?.removeAllRanges();
    return;
  }

  const existingList = el.querySelector("ul, ol") as HTMLElement | null;

  if (existingList) {
    const existingType = existingList.tagName.toLowerCase() as "ul" | "ol";
    if (existingType === type) {
      const lines = Array.from(existingList.querySelectorAll("li")).map((li) => li.innerHTML);
      el.innerHTML = lines.join("<br>");
    } else {
      const newList = document.createElement(type);
      newList.innerHTML = existingList.innerHTML;
      existingList.replaceWith(newList);
    }
    return;
  }

  const currentHTML = el.innerHTML;
  const temp = document.createElement("div");
  temp.innerHTML = currentHTML;
  const plainText = temp.innerText || temp.textContent || "";
  const lines = plainText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  if (lines.length === 0) {
    el.innerHTML = `<${type}><li>List item</li></${type}>`;
    return;
  }

  const newList = document.createElement(type);
  lines.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    newList.appendChild(li);
  });

  el.innerHTML = "";
  el.appendChild(newList);
}

const TextFormattingToolbar: React.FC = () => {
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);
  const [showAITextBox, setShowAITextBox] = useState(false);
  const [showLineHeightLetterSpacing, setShowLineHeightLetterSpacing] = useState(false);

  const aiBtnRef = useRef<HTMLButtonElement>(null);
  const lineHeightLetterSpacingRef = useRef<HTMLButtonElement>(null);
  const LinkBtnRef = useRef<HTMLButtonElement | null>(null);

  const target = useEditorUIStore((s) => s.activeTextRef);
  const targetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { targetRef.current = target as HTMLDivElement | null; }, [target]);

  const setActiveRightPanel = useEditorStore((s) => s.setActiveRightPanel);
  const activeRightPanel = useEditorStore((s) => s.activeRightPanel);
  const prevPanelRef = useRef(activeRightPanel);


  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, strikethrough: false,
    subscript: false, superscript: false, orderedList: false, unorderedList: false,
  });
  const [hasSelection, setHasSelection] = useState(false);
  const colorRangeRef = useRef<Range | null>(null);
  const savedSelectionRef = useRef<string>("");

  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const [showLinkPopup, setshowLinkPopup] = useState(false);
  const pendingTextColor = useEditorUIStore((s) => s.pendingTextColor);
  const setPendingTextColor = useEditorUIStore((s) => s.setPendingTextColor);

  const element = slides[activeSlide]?.elements.find((el) => el.id === activeElementId);

  const updateText = useCallback(
    (patch: Partial<TextData>) => {
      if (!element || element.data.type !== "text") return;
      updateElement(element.id, patch);
    },
    [element, updateElement]
  );

  const syncToStore = useCallback(() => {
    if (!target || !activeElementId) return;
    updateElement(activeElementId, { text: target.innerText, html: target.innerHTML });
  }, [target, activeElementId, updateElement]);

  const refreshFormats = useCallback(() => {
    const sel = window.getSelection();
    setHasSelection(!!(sel && sel.toString().length > 0));
    if (!sel || sel.rangeCount === 0) {
      setActiveFormats({
        bold: false, italic: false, underline: false, strikethrough: false,
        subscript: false, superscript: false, orderedList: false, unorderedList: false,
      });
      return;
    }
    const node = sel.getRangeAt(0).startContainer;
    const el = (node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement)) as HTMLElement | null;
    if (!el) return;
    const style = window.getComputedStyle(el);
    const hasAncestor = (tag: string) => !!el.closest(tag);
    setActiveFormats({
      bold: parseInt(style.fontWeight, 10) >= 700 || hasAncestor("b") || hasAncestor("strong"),
      italic: style.fontStyle === "italic" || hasAncestor("i") || hasAncestor("em"),
      underline: style.textDecorationLine.includes("underline") || hasAncestor("u"),
      strikethrough: style.textDecorationLine.includes("line-through") || hasAncestor("s") || hasAncestor("strike"),
      subscript: style.verticalAlign === "sub" || hasAncestor("sub"),
      superscript: style.verticalAlign === "super" || hasAncestor("sup"),
      orderedList: hasAncestor("ol"),
      unorderedList: hasAncestor("ul"),
    });
  }, []);



  useEffect(() => {
    if (prevPanelRef.current === "TextColorPanel" && activeRightPanel !== "TextColorPanel") {
      if (target) {
        clearPendingMarked(target, "data-pending-color");
        syncToStore();
      }
    }
    prevPanelRef.current = activeRightPanel;
  }, [activeRightPanel, target, syncToStore]);





  useEffect(() => {
    if (!target) return;
    const onSel = () => {
      const sel = window.getSelection();
      if (!sel) return;
      if (target.contains(sel.anchorNode) || sel.toString() === "") refreshFormats();
      if (sel.rangeCount > 0 && sel.toString().length > 0 && target.contains(sel.anchorNode)) {
        colorRangeRef.current = sel.getRangeAt(0).cloneRange();
        savedSelectionRef.current = sel.toString();
      } else {
        colorRangeRef.current = null;
      }
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, [target, refreshFormats]);

  const execFormat = useCallback(
    (command: FormatCommand) => {
      if (!target) return;
      target.focus();
      const sel = window.getSelection();
      const hasTextSelection = sel && sel.toString().length > 0 && target.contains(sel.anchorNode);
      const map = FORMAT_MAP[command];
      if (hasTextSelection && sel!.rangeCount > 0) {
        applyInlineStyle(sel!.getRangeAt(0).cloneRange(), map.prop, map.on, map.off);
        refreshFormats();
        syncToStore();
      } else {
        const d = element?.data as TextData;
        const currentVal = (d as unknown as Record<string, string>)?.[map.prop];
        updateText({ [map.prop]: currentVal !== map.on ? map.on : map.off } as Partial<TextData>);
        requestAnimationFrame(() => { removeAllInlineTags(target, map.tags); syncToStore(); });
      }
    },
    [target, element, updateText, refreshFormats, syncToStore]
  );

  const execSubscript = useCallback(() => {
    if (!target) return;
    target.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target.contains(sel.anchorNode)) {
      applyVerticalAlign(sel.getRangeAt(0).cloneRange(), "sub");
      refreshFormats();
      syncToStore();
    }
  }, [target, refreshFormats, syncToStore]);

  const execSuperscript = useCallback(() => {
    if (!target) return;
    target.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target.contains(sel.anchorNode)) {
      applyVerticalAlign(sel.getRangeAt(0).cloneRange(), "super");
      refreshFormats();
      syncToStore();
    }
  }, [target, refreshFormats, syncToStore]);

  // ── execList ──────────────────────────────────────────────────────────────
  const execList = useCallback(
    (type: "ul" | "ol") => {
      const el = targetRef.current;
      if (!el || !activeElementId) return;
      const elId = el.getAttribute("data-element-id");
      if (elId && elId !== activeElementId) return;

      const savedRange = colorRangeRef.current && !colorRangeRef.current.collapsed
        ? colorRangeRef.current
        : null;

      const verifiedRange = savedRange && el.contains(savedRange.commonAncestorContainer)
        ? savedRange
        : null;

      execListOnElement(el, type, verifiedRange);

      updateElement(activeElementId, {
        html: el.innerHTML,
        text: el.innerText,
      });

      colorRangeRef.current = null;
      savedSelectionRef.current = "";
      refreshFormats();
    },
    [activeElementId, updateElement, refreshFormats]
  );

  const handleTextColor = useCallback(
    (color: string) => {
      if (!target) return;
      const hasPending = target.querySelector('[data-pending-color="true"]');
      if (hasPending) {
        applyToPendingMarked(target, "data-pending-color", (el) => { el.style.color = color; });
        syncToStore();
      } else {
        updateText({ color });
        requestAnimationFrame(() => {
          target.querySelectorAll("[style]").forEach((el) => {
            (el as HTMLElement).style.removeProperty("color");
            if (!(el as HTMLElement).getAttribute("style")?.trim()) {
              (el as HTMLElement).removeAttribute("style");
            }
          });
          syncToStore();
        });
      }
    },
    [target, updateText, syncToStore]
  );






  useEffect(() => {
    if (!pendingTextColor) return;
    handleTextColor(pendingTextColor);
    setPendingTextColor(null);
  }, [handleTextColor, pendingTextColor, setPendingTextColor]);

  const handleFontSizeChange = useCallback(
    (delta: number) => {
      if (!target) return;
      const d = element?.data as TextData;
      const baseSize = d?.fontSize || 30;
      const sel = window.getSelection();
      const hasSelText = sel && sel.toString().length > 0 && target.contains(sel.anchorNode);
      if (hasSelText && sel!.rangeCount > 0) {
        const range = sel!.getRangeAt(0);
        const node = range.startContainer;
        const el = (node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement)) as HTMLElement | null;
        const currentPx = el ? parseInt(window.getComputedStyle(el).fontSize, 10) || baseSize : baseSize;
        target.focus();
        applyFontSize(range.cloneRange(), currentPx + delta);
        syncToStore();
      } else {
        updateText({ fontSize: baseSize + delta });
      }
    },
    [element, updateText, target, syncToStore]
  );

  const alignOrder: ("left" | "center" | "justify" | "right")[] = ["left", "center", "justify", "right"];

  const getNextAlign = (current: string | undefined): "left" | "center" | "justify" | "right" => {
    const index = alignOrder.indexOf(current as "left" | "center" | "justify" | "right");
    return alignOrder[(index + 1) % alignOrder.length];
  };

  const getAlignIcon = (align: string | undefined) => {
    switch (align) {
      case "center": return <AlignCenter size={16} />;
      case "right": return <AlignRight size={16} />;
      case "justify": return <AlignJustify size={16} />;
      default: return <AlignLeft size={16} />;
    }
  };

  if (!element) return null;
  const data = element.data as TextData;
  const iconBtn = "h-7.5 w-7.5 flex items-center justify-center rounded-md transition-all duration-150";
  return (
    <div className="kd-canvasheader-container h-10 mt-4 flex items-center justify-between px-1 py-1 rounded-lg">

      {/* LEFT */}
      <div className="flex items-center gap-1">
        {/* Font Name */}
        <button onClick={() => {
          const currentActive = useEditorStore.getState().activeRightPanel;
          const currentType = useEditorUIStore.getState().activePanelType;
          if (currentType === "main" && currentActive) useEditorUIStore.getState().setLastMainPanel(currentActive);
          setActiveRightPanel("FontFamilyPanel");
          useEditorUIStore.getState().setActivePanelType("edit");
          if (useEditorUIStore.getState().sidebarWidth === "closed") {
            useEditorUIStore.getState().setSidebarWidth("edit");
          }
        }} type="button" className="kd-canvasheader-fontfamily-button px-4 py-1 rounded-md cursor-pointer transition-all duration-200">
          Playpen Sans
        </button>
        {/* Font Size */}
        {/* <button
          type="button" className="kd-canvasheader-fontsize-button w-24 flex items-center  rounded-md text-sm"
        >
          <span className="cursor-pointer px-2"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(-1)}>
            <KdTextEditMinus />
          </span>

          <span className="px-2 w-10 kd-text-fontsize-value"> {data.fontSize || 30}</span>

          <span className="cursor-pointer px-2"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(1)}>
            <KdTextEditPlus />
          </span>
        </button> */}

        <button
          type="button"
          className="kd-canvasheader-fontsize-button p-0.5 flex items-center justify-between rounded-md text-sm "
        >
          <span
            className="cursor-pointer px-2 h-full flex items-center"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(-1)}
          >
            <KdTextEditMinus />
          </span>

          <span className="kd-text-fontsize-value w-8 flex items-center justify-center  text-center">
            {data.fontSize || 30}
          </span>

          <span
            className="cursor-pointer px-2 h-full flex items-center"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFontSizeChange(1)}
          >
            <KdTextEditPlus />
          </span>
        </button>
        {/* Gradient Background */}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseEnter={() => setShowTooltip("TextBgColorPanel")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => {
            e.preventDefault();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target && target.contains(sel.anchorNode)) {
              useEditorUIStore.getState().setSavedTextRange(sel.getRangeAt(0).cloneRange());
            } else {
              useEditorUIStore.getState().setSavedTextRange(null);
            }
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) useEditorUIStore.getState().setLastMainPanel(currentActive);
            setActiveRightPanel("TextBgColorPanel");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}
        >
          <KdGradBgIcon />
          {showTooltip === "TextBgColorPanel" && <span className="kd-tooltip-bottom">Text BG Color</span>}
        </button>

        {/* Text Color */}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseEnter={() => setShowTooltip("color")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => {
            e.preventDefault();
            if (target) {
              clearPendingMarked(target, "data-pending-color");

              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target.contains(sel.anchorNode)) {
                target.focus();
                markPendingFormatSelection(sel.getRangeAt(0).cloneRange(), "data-pending-color");
              }
              syncToStore();
            }
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) useEditorUIStore.getState().setLastMainPanel(currentActive);
            setActiveRightPanel("TextColorPanel");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}
        >
          <KdTextColorIcon />
          {showTooltip === "color" && <span className="kd-tooltip-bottom">Color</span>}
        </button>

        {/* Bold */}
        <button
          type="button"
          className={`${iconBtn} cursor-pointer kd-canvasheader-button-all kd-tooltip-parent  ${hasSelection
            ? activeFormats.bold
            : (data as unknown as Record<string, string>)[FORMAT_MAP.bold.prop] === FORMAT_MAP.bold.on
              ? "kd-icon-btn-main-active" : ""
            }`}
          onMouseEnter={() => setShowTooltip("bold")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execFormat("bold"); setShowTooltip(null); }}
        >
          <KdTextBoldIcon />
          {showTooltip === "bold" && <span className="kd-tooltip-bottom">Bold</span>}
        </button>

        {/* Italic */}
        <button
          type="button"
          className={`${iconBtn} cursor-pointer kd-canvasheader-button-all kd-tooltip-parent  ${hasSelection
            ? activeFormats.italic
            : (data as unknown as Record<string, string>)[FORMAT_MAP.italic.prop] === FORMAT_MAP.italic.on
              ? "kd-icon-btn-main-active" : ""
            }`}
          onMouseEnter={() => setShowTooltip("italic")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execFormat("italic"); setShowTooltip(null); }}
        >
          <KdTextItalicIcon />
          {showTooltip === "italic" && <span className="kd-tooltip-bottom">Italic</span>}
        </button>

        {/* Underline */}
        <button
          type="button"
          className={`${iconBtn} cursor-pointer kd-canvasheader-button-all kd-tooltip-parent  ${hasSelection
            ? activeFormats.underline
            : (data as unknown as Record<string, string>)[FORMAT_MAP.underline.prop] === FORMAT_MAP.underline.on
              ? "kd-icon-btn-main-active" : ""
            }`}
          onMouseEnter={() => setShowTooltip("underline")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execFormat("underline"); setShowTooltip(null); }}
        >
          <KdTextUnderlineIcon />
          {showTooltip === "underline" && <span className="kd-tooltip-bottom">Underline</span>}
        </button>

        {/* Strike */}
        <button
          type="button"
          className={`${iconBtn} cursor-pointer kd-canvasheader-button-all kd-tooltip-parent  ${hasSelection
            ? activeFormats.strikethrough
            : (data as unknown as Record<string, string>).textDecoration === FORMAT_MAP.strikeThrough.on
              ? "kd-icon-btn-main-active" : ""
            }`}
          onMouseEnter={() => setShowTooltip("strikeThrough")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execFormat("strikeThrough"); setShowTooltip(null); }}
        >
          <KdTextStrikeIcon />
          {showTooltip === "strikeThrough" && <span className="kd-tooltip-bottom">Strike</span>}
        </button>

        {/* Camel Case */}
        {/* Text Transform */}
        <button
          type="button"
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all ${data.textTransform && data.textTransform !== "none" ? "kd-icon-btn-main-active" : ""
            }`}
          onMouseEnter={() => setShowTooltip("textTransform")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const next = getNextTransform(data.textTransform);
            updateText({ textTransform: next });
            requestAnimationFrame(() => syncToStore());
          }}
        >
          <KdCamelCaseIcon />
          {showTooltip === "textTransform" && (
            <span className="kd-tooltip-bottom">
              {data.textTransform || "none"}
            </span>
          )}
        </button>
        {/* Text SubScript*/}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all ${activeFormats.subscript ? "kd-icon-btn-main-active" : ""}`}
          onMouseEnter={() => setShowTooltip("subscript")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execSubscript(); setShowTooltip(null); }}
        >
          <KdTextSubScriptIcon />
          {showTooltip === "subscript" && <span className="kd-tooltip-bottom">Subscript</span>}
        </button>

        {/* Text SuperScript*/}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all ${activeFormats.superscript ? "kd-icon-btn-main-active" : ""}`}
          onMouseEnter={() => setShowTooltip("superscript")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execSuperscript(); setShowTooltip(null); }}
        >
          <KdTextSuperScriptIcon />
          {showTooltip === "superscript" && <span className="kd-tooltip-bottom">Superscript</span>}
        </button>
        {/* Text Alignment */}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => updateText({ align: getNextAlign(data.align || "left") })}
        >
          {getAlignIcon(data.align)}
        </button>

        {/* List Items */}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all ${activeFormats.unorderedList ? "kd-icon-btn-main-active" : ""}`}
          onMouseEnter={() => setShowTooltip("ul")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execList("ul"); setShowTooltip(null); }}
        >
          <KdListItemsIcon />
          {showTooltip === "ul" && <span className="kd-tooltip-bottom">Bullet List</span>}
        </button>
        {/* List Digit Icons */}
        <button
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all ${activeFormats.orderedList ? "kd-icon-btn-main-active" : ""}`}
          onMouseEnter={() => setShowTooltip("ol")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { execList("ol"); setShowTooltip(null); }}
        >
          <KdListDigitIcon />
          {showTooltip === "ol" && <span className="kd-tooltip-bottom">Numbered List</span>}
        </button>

        {/* Link Add Icons */}
        <button ref={LinkBtnRef}
          type="button"
          className={`kd-tooltip-parent  ${iconBtn} kd-tooltip-parent cursor-pointer kd-canvasheader-button-all`}
          onMouseEnter={() => setShowTooltip("link")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!target) return;
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target.contains(sel.anchorNode)) {
              target.focus();
              applyPendingLink(sel.getRangeAt(0).cloneRange());
              syncToStore();
            }
          }}
          onClick={() => { setShowAITextBox(false); setshowLinkPopup((p) => !p); setShowTooltip(null); }}

        ><KdLinkAddIcon /> </button>
        {/* Magic Wand Icon */}
        <button
          ref={aiBtnRef}
          className={`kd-tooltip-parent ${iconBtn} cursor-pointer kd-canvasheader-button-all`}
          onMouseEnter={() => setShowTooltip("ai")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setshowLinkPopup(false); setShowAITextBox((p) => !p); setShowTooltip(null); }}
        >
          <KdMagicWandIcon />
          {showTooltip === "ai" && <span className="kd-tooltip-bottom">AI</span>}
        </button>

        {/* Letter Spacing */}
        <button
          ref={lineHeightLetterSpacingRef}
          className={`kd-tooltip-parent  ${iconBtn} kd-tooltip-parent cursor-pointer kd-canvasheader-button-all`}
          onMouseEnter={() => setShowTooltip("lhls")}
          onMouseLeave={() => setShowTooltip(null)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setshowLinkPopup(false); setShowLineHeightLetterSpacing((p) => !p); setShowTooltip(null); }}
        >
          <KdTextLetterSpaceIcon />
          {showTooltip === "lhls" && <span className="kd-tooltip-bottom">Line Height & Letter Spacing</span>}
        </button>

        {/* Position */}
        <button
          type="button"
          className="kd-canvasheader-nullText-button px-3 py-1 rounded-md text-sm cursor-pointer transition-all duration-200"
          onMouseDown={(e) => {
            e.preventDefault();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && target && target.contains(sel.anchorNode)) {
              useEditorUIStore.getState().setSavedTextRange(sel.getRangeAt(0).cloneRange());
            } else {
              useEditorUIStore.getState().setSavedTextRange(null);
            }
            const currentActive = useEditorStore.getState().activeRightPanel;
            const currentType = useEditorUIStore.getState().activePanelType;
            if (currentType === "main" && currentActive) useEditorUIStore.getState().setLastMainPanel(currentActive);
            setActiveRightPanel("ItemPositionPanel");
            useEditorUIStore.getState().setActivePanelType("edit");
            if (useEditorUIStore.getState().sidebarWidth === "closed") {
              useEditorUIStore.getState().setSidebarWidth("edit");
            }
          }}

        >
          <span>Position</span>
        </button>
      </div>


      <TextAIGenBox isOpen={showAITextBox} onClose={() => setShowAITextBox(false)} buttonRef={aiBtnRef} />
      <LineHeightLetterSpacing isOpen={showLineHeightLetterSpacing} onClose={() => setShowLineHeightLetterSpacing(false)} buttonRef={lineHeightLetterSpacingRef} />
      {showLinkPopup &&
        <LinkEditBox targetRef={LinkBtnRef} data={data} updateButton={updateText} onClose={() => setshowLinkPopup(false)} />}
    </div>


  );
};

export default TextFormattingToolbar;