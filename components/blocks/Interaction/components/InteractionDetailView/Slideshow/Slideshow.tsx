"use client";

import React, { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, Search, Sparkles, Upload } from "lucide-react";
import { createClient } from "pexels";
import useProjectInfoStore from "@/app/Store/projectInfoStore";
import useEditorStore from "@/app/Store/editorStore";
import { useAddInteraction } from "../../useAddInteraction";

const client = createClient("563492ad6f91700001000001058a23d1f89841b9ae8060ffd2b5abca");
type Source = "upload" | "stock" | "ai";

export default function Slideshow({ onBack, popup }: { onBack: () => void; popup: boolean }) {
  const [source, setSource] = useState<Source>("upload");
  const [images, setImages] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("nature");
  const [stock, setStock] = useState<{ id: number; src: { medium: string; large: string; original: string } }[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addInteraction } = useAddInteraction();
  const token = useProjectInfoStore((s) => s.token);
  const apiUrl = useProjectInfoStore((s) => s.api_url);

  const addImage = (src: string) => setImages((current) => current.includes(src) ? current : [...current, src]);
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" && addImage(reader.result);
      reader.readAsDataURL(file);
    });
  };
  const searchStock = async () => {
    setLoading(true);
    try {
      const response = await client.photos.search({ query: search || "nature", per_page: 18, orientation: "landscape" });
      if ("photos" in response) setStock(response.photos.map((photo) => ({ id: photo.id, src: { medium: photo.src.medium, large: photo.src.large, original: photo.src.original } })));
    } finally { setLoading(false); }
  };
  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const body = new FormData();
      body.append("access_token", token || "");
      body.append("prompt", prompt);
      const response = await fetch(`${apiUrl}sl_editor_Ai_generate_image`, { method: "POST", body });
      const result = await response.json();
      if (result.image_url) addImage(result.image_url);
      setPrompt("");
    } finally { setLoading(false); }
  };
  const create = () => {
    if (!images.length) return;
    addInteraction(popup ? "popup-slideshow" : "slideshow");
    const store = useEditorStore.getState();
    const element = store.slides[store.activeSlide]?.elements.at(-1);
    if (element) store.updateElement(element.id, { slideshowImages: images, slideshowInterval: 3000 }, { history: true });
    onBack();
  };

  return <div className="kd-text-add-panel-container bg-white flex h-full flex-col p-3">
    <div className="mb-3 flex items-center gap-2"><button type="button" onClick={onBack} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100"><ArrowLeft size={16} /></button><span className="kd-toolPanel-heding-text text-gray-900">{popup ? "Pop-up slideshow" : "Slideshow"}</span></div>
    <p className="mb-3 text-xs text-gray-500">Choose one or more images. {popup ? "The slider opens in a popup." : "The slider plays directly on the page."}</p>
    <div className="mb-3 grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
      {([ ["upload", Upload, "Upload"], ["stock", Search, "Stock"], ["ai", Sparkles, "AI"] ] as const).map(([value, Icon, label]) => <button key={value} type="button" onClick={() => setSource(value)} className={`rounded-md py-1.5 text-xs font-medium ${source === value ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}><Icon className="mr-1 inline" size={13} />{label}</button>)}
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto">
      {source === "upload" && <div className="space-y-2"><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} /><button type="button" onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600"><ImagePlus size={22} />Upload images</button><div className="flex gap-2"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste image URL" className="min-w-0 flex-1 rounded-md border p-2 text-xs" /><button type="button" onClick={() => { if (url.trim()) { addImage(url.trim()); setUrl(""); } }} className="rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white">Add</button></div></div>}
      {source === "stock" && <div><div className="mb-2 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && searchStock()} className="min-w-0 flex-1 rounded-md border p-2 text-xs" placeholder="Search stock images" /><button type="button" onClick={searchStock} className="rounded-md bg-indigo-600 px-3 text-white"><Search size={14} /></button></div><div className="grid grid-cols-2 gap-2">{stock.map((photo) => <button key={photo.id} type="button" onClick={() => addImage(photo.src.original)} className="relative aspect-square overflow-hidden rounded-md"><img src={photo.src.medium} alt="Stock" className="h-full w-full object-cover" /></button>)}</div>{!stock.length && <button type="button" onClick={searchStock} className="w-full rounded-md border py-3 text-xs text-gray-500">Search stock images</button>}</div>}
      {source === "ai" && <div className="space-y-2"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} className="w-full rounded-md border p-2 text-sm" placeholder="Describe the image you want to generate" /><button type="button" disabled={loading || !prompt.trim()} onClick={generate} className="flex w-full items-center justify-center gap-1 rounded-md bg-indigo-600 py-2 text-xs font-semibold text-white disabled:opacity-50">{loading && <Loader2 size={14} className="animate-spin" />}Generate image</button></div>}
    </div>
    {images.length > 0 && <div className="mt-3 border-t pt-2"><div className="mb-2 flex items-center justify-between text-xs text-gray-600"><span>{images.length} image{images.length > 1 ? "s" : ""} selected</span><button type="button" onClick={() => setImages([])} className="text-red-500">Clear</button></div><div className="mb-2 flex gap-1 overflow-x-auto">{images.map((src) => <button key={src} type="button" onClick={() => setImages((current) => current.filter((item) => item !== src))} className="relative h-12 w-12 shrink-0 overflow-hidden rounded"><img src={src} alt="Selected" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/45 text-xs text-white opacity-0 hover:opacity-100">×</span></button>)}</div><button type="button" onClick={create} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white">Add {popup ? "pop-up slideshow" : "slideshow"}</button></div>}
  </div>;
}
