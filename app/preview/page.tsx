"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BookPreview } from "./index";

interface LoadBookMessage {
  type: "LOAD_TEMPLATE";
  templateUrl: string;
}

const noopSubscribe = () => () => {};


export default function PreviewRoute() {
  
  const querySrc = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("src"),
    () => null,
  );
  const [postedUrl, setPostedUrl] = useState<string | null>(null);

  const jsonUrl = postedUrl ?? querySrc;

  useEffect(() => {
    window.parent.postMessage({ type: "REACT_READY" }, "*");
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent<Partial<LoadBookMessage>>) {
      if (event.data?.type === "LOAD_TEMPLATE" && event.data.templateUrl) {
        setPostedUrl(event.data.templateUrl);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!jsonUrl) {
    return <main className="h-dvh bg-slate-200" aria-busy="true" />;
  }

  return <BookPreview jsonUrl={jsonUrl} mode="page" />;
}
