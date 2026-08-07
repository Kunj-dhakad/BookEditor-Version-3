"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import useEditorStore from "@/app/Store/editorStore";
import { useAddInteraction } from "../../useAddInteraction";
import { SHOP_KIND_MAP } from "../../constants";

type ShopLabel = "Product card" | "Product button" | "Price tag";

export default function ShopDetail({
  label,
  onBack,
}: {
  label: string;
  onBack: () => void;
}) {
  const shopLabel = label as ShopLabel;
  const { addInteraction } = useAddInteraction();

  const [text, setText] = useState(
    shopLabel === "Product card"
      ? "Product name"
      : shopLabel === "Price tag"
        ? "$19.99"
        : "Shop now",
  );
  const [link, setLink] = useState("");
  const [price, setPrice] = useState(shopLabel === "Product card" ? "$19.99" : "");
  const [imageUrl, setImageUrl] = useState("");

  const canAdd = link.trim().length > 0;

  const create = () => {
    if (!canAdd) return;
    const kind = SHOP_KIND_MAP[shopLabel];
    addInteraction(kind);
    const store = useEditorStore.getState();
    const element = store.slides[store.activeSlide]?.elements.at(-1);
    if (element) {
      store.updateElement(
        element.id,
        {
          text,
          url: link.trim(),
          link: link.trim(),
          ...(shopLabel === "Product card"
            ? {
                productName: text,
                productPrice: price,
                productImageUrl: imageUrl,
              }
            : {}),
          ...(shopLabel === "Price tag" ? { productPrice: text } : {}),
        },
        { history: true },
      );
    }
    onBack();
  };

  return (
    <div className="kd-text-add-panel-container bg-white flex h-full flex-col p-3">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="kd-toolPanel-heding-text text-gray-900">{shopLabel}</span>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        {shopLabel === "Product card"
          ? "Add a product card with an image, price, and a link to your product page."
          : shopLabel === "Product button"
            ? "Add a clickable button that links to your product page."
            : "Add a price tag that links to your product page."}
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-3">
        <div>
          <label className="kd-btn-setting-label mb-1 block text-xs font-medium text-gray-700">
            {shopLabel === "Product card"
              ? "Product name"
              : shopLabel === "Price tag"
                ? "Price"
                : "Button label"}
          </label>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              shopLabel === "Product card"
                ? "e.g. Wireless headphones"
                : shopLabel === "Price tag"
                  ? "e.g. $19.99"
                  : "e.g. Shop now"
            }
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>

        {shopLabel === "Product card" && (
          <>
            <div>
              <label className="kd-btn-setting-label mb-1 block text-xs font-medium text-gray-700">
                Price
              </label>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="e.g. $19.99"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
            <div>
              <label className="kd-btn-setting-label mb-1 block text-xs font-medium text-gray-700">
                Image URL <span className="text-gray-400">(optional)</span>
              </label>
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/product.jpg"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label className="kd-btn-setting-label mb-1 block text-xs font-medium text-gray-700">
            Link URL
          </label>
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://example.com/product"
            className="w-full rounded-md border p-2 text-sm"
          />
          <p className="mt-1 text-[11px] text-gray-500">
            Opens when a reader clicks this {shopLabel.toLowerCase()} in preview.
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!canAdd}
        onClick={create}
        className="mt-3 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        Add {shopLabel.toLowerCase()}
      </button>
    </div>
  );
}
