import React, { CSSProperties, forwardRef } from "react";
import dynamic from "next/dynamic";
import { ElementData } from "@/app/Store/editorStore";
import { BookPageData } from "../types/book";
import RenderButton from "@/components/blocks/Button/renderer/RenderButton";
import RenderImage from "@/components/blocks/Image/renderer/RenderImage";
import RenderShape from "@/components/blocks/Shape/renderer/RenderShape";
import RenderSvgElements from "@/components/blocks/Sticker/renderer/RenderSvgElements";
import RenderText from "@/components/blocks/Text/renderer/RenderText";
import RenderVideo from "@/components/blocks/Video/renderer/RenderVideo";
import RenderWatermark from "@/components/blocks/Watermark/renderer/RenderWatermark";
import RenderTable from "@/components/blocks/Table/renderer/RenderTable";
// Keeps recharts out of the reader's initial chunk as well.
const RenderChart = dynamic(
  () => import("@/components/blocks/Chart/renderer/RenderChart"),
  { ssr: false, loading: () => null },
);
import PreviewBookIndex from "./PreviewBookIndex";
import RenderInteraction from "@/components/blocks/Interaction/renderer/RenderInteraction";

interface BookPageProps {
  page: BookPageData;
  pageIndex?: number;
  style?: CSSProperties;
  className?: string;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
  { page, pageIndex = 0, style, className },
  ref,
) {
  const width = page.width ?? 350;
  const height = page.height ?? 434;
  const clipBounds = { x: 0, y: 0, width, height };

  return (
    <div
      ref={ref}
      className={`relative shrink-0 overflow-hidden bg-white shadow-md ${className ?? ""}`}
      style={{ width, height, background: page.background, ...style }}
    >
      <div className="pointer-events-none absolute inset-0">
        {page.elements.map((element) => {
          const data = element.data as ElementData;
          if (data.type === "text" && data.bookRole === "index")
            return (
              <div
                key={element.id}
                className="pointer-events-auto absolute"
                style={{
                  left: data.x,
                  top: data.y,
                  width: data.width,
                  height: data.height,
                  transform: `rotate(${data.rotation ?? 0}deg)`,
                  transformOrigin: "center",
                }}
              >
                <PreviewBookIndex data={data} />
              </div>
            );
          if (data.type === "text")
            return (
              <RenderText
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
                // The reader is a viewer: these renderers auto-measure
                // themselves, and without this they wrote those measurements
                // back into the user's slides, so closing the preview left the
                // canvas with sizes measured inside the reader's layout.
                readOnly
              />
            );
          if (data.type === "image")
            return (
              <RenderImage
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          if (data.type === "video")
            return (
              <RenderVideo
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          if (data.type === "button")
            return (
              <RenderButton
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          if (data.type === "interaction")
            return (
              <RenderInteraction
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );

          if (data.type === "shape")
            return (
              <RenderShape
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          if (data.type === "svg")
            return (
              <RenderSvgElements
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          if (data.type === "watermark")
            return (
              <RenderWatermark
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
              />
            );
          if (data.type === "table")
            return (
              <RenderTable
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
                readOnly
              />
            );
          if (data.type === "chart")
            return (
              <RenderChart
                key={element.id}
                id={element.id}
                data={data}
                slideIndex={pageIndex}
                clipBounds={clipBounds}
              />
            );
          return null;
        })}
      </div>
    </div>
  );
});

BookPage.displayName = "BookPage";
export default BookPage;
