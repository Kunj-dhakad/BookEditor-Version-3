"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import {
  SlideType,
  ElementType,
  TextData,
  ImageData,
  ButtonData,
  SVGData,
  VideoData,
  ShapeData,
  TableData,
  ChartData,
} from "@/app/Store/editorStore";
import ChartRenderer from "@/components/blocks/Chart/renderer/ChartRenderer";

const SCALE = 0.20;


const TextElement = React.memo(({ data }: { data: TextData }) => (
  <div
    style={{
      position: "absolute",
      left: data.x + 4,
      top: data.y + 4,
      width: data.width - 8,
      height: data.height,
      color: data.color,
      fontSize: data.fontSize,
      fontFamily: data.fontFamily,
      whiteSpace: "pre-wrap",
      lineHeight: data.lineHeight,
      letterSpacing: data.letterSpacing,
      fontWeight: data.fontWeight,
      textAlign: data.align,
      textTransform: data.textTransform || "none",
      contain: "strict",
    }}
    dangerouslySetInnerHTML={{ __html: data.html || data.text }}
  />
));
TextElement.displayName = "TextElement";

// eslint-disable-next-line react/display-name
const ButtonElement = React.memo(({ data }: { data: ButtonData }) => {
  const hasGradient = data.gradientFrom && data.gradientTo;
  const dir =
    data.gradientDirection === "vertical"
      ? "to bottom"
      : data.gradientDirection === "horizontal"
        ? "to right"
        : "135deg";

  return (
    <div
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,
        fontWeight: data.fontWeight,
        borderRadius: data.borderRadius,
        color: data.textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        border:
          data.borderWidth && data.borderWidth > 0
            ? `${data.borderWidth}px solid ${data.borderColor ?? "transparent"}`
            : "none",
        background: hasGradient
          ? `linear-gradient(${dir}, ${data.gradientFrom}, ${data.gradientTo})`
          : data.backgroundColor || "transparent",
        padding: "0 16px",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        overflow: "hidden",
        contain: "strict",
      }}
    >
      {data.icon && data.iconPosition === "left" && (
        <span>{data.icon}</span>
      )}
      <span>{data.text}</span>
      {data.icon && data.iconPosition !== "left" && (
        <span>{data.icon}</span>
      )}
    </div>
  );
});

const ImageElement = React.memo(({ data }: { data: ImageData }) => (
  <Image
    src={data.src}
    width={500}
    height={500}
    alt=""
    draggable={false}
    loading="lazy"
    unoptimized
    onError={(e) => {
      const t = e.currentTarget as HTMLImageElement;
      t.onerror = null;
      t.src = `data:image/svg+xml;base64,${btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`
      )}`;
    }}
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      transform: `rotate(${data.rotation ?? 0}deg)`,
      transformOrigin: "center center",
      width: data.width,
      height: data.height,
      objectFit: "cover",
    }}
  />
));
ImageElement.displayName = "ImageElement";


const SvgElement = React.memo(({ data }: { data: SVGData }) => (
  <Image
    src={data.src}
    width={500}
    height={500}
    alt=""
    draggable={false}
    loading="lazy"
    unoptimized
    onError={(e) => {
      const t = e.currentTarget as HTMLImageElement;
      t.onerror = null;
      t.src = `data:image/svg+xml;base64,${btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`
      )}`;
    }}
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      transform: `rotate(${data.rotation ?? 0}deg)`,
      transformOrigin: "center center",
      width: data.width,
      height: data.height,
      objectFit: "cover",
    }}
  />
));
SvgElement.displayName = "SvgElement";


const ShapeElement = React.memo(({ data }: { data: ShapeData }) => (
  <div
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      width: data.width,
      height: data.height,
      contain: "strict",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      dangerouslySetInnerHTML={{ __html: data.shape || "" }}
    />
  </div>
));
ShapeElement.displayName = "ShapeElement";

const TableElement = React.memo(({ data }: { data: TableData }) => (
  <table style={{ position: "absolute", left: data.x, top: data.y, width: data.width, height: data.height, tableLayout: "fixed", borderCollapse: "collapse", fontFamily: data.style.fontFamily, fontSize: data.style.fontSize, fontWeight: data.style.fontWeight, fontStyle: data.style.fontStyle ?? "normal", textDecoration: data.style.textDecoration ?? "none", color: data.style.textColor, background: data.style.background, lineHeight: data.style.lineHeight, letterSpacing: data.style.letterSpacing }}>
    <tbody>{data.cells.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => !cell.hidden && <td key={columnIndex} rowSpan={cell.rowSpan} colSpan={cell.colSpan} style={{ border: `${data.style.borderWidth}px solid ${data.style.borderColor}`, background: data.style.cellBackground, padding: data.style.padding, boxSizing: "border-box", textAlign: data.style.textAlign, verticalAlign: data.style.verticalAlign, whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word", overflow: "hidden" }}>{cell.text}</td>)}</tr>)}</tbody>
  </table>
));
TableElement.displayName = "TableElement";

const ChartElement = React.memo(({ data }: { data: ChartData }) => <div style={{ position: "absolute", left: data.x, top: data.y, width: data.width, height: data.height, transform: `rotate(${data.rotation ?? 0}deg)`, transformOrigin: "center" }}><ChartRenderer data={data} /></div>);
ChartElement.displayName = "ChartElement";


const VideoElement = React.memo(({ data }: { data: VideoData }) => (
  data.thumbnail ? (

    <Image
      src={data.thumbnail}
      draggable={false}
      unoptimized
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        objectFit: "cover",
      }}
      width={500}
      height={500}
      alt="Picture of the author"
    />

  ) : (
    <video
      src={data.src}
      draggable={false}
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        objectFit: "cover",
      }}
    />
  )


));
VideoElement.displayName = "VideoElement";


// â”€â”€â”€ Dispatcher â€”
const SlideElement = React.memo(({ el }: { el: ElementType }) => {
  switch (el.data.type) {
    case "text":
      return <TextElement data={el.data as TextData} />;
    case "button":
      return <ButtonElement data={el.data as ButtonData} />;

    case "image":
      return <ImageElement data={el.data as ImageData} />;

    case "video":
      return <VideoElement data={el.data as VideoData} />;

    case "shape":
      return <ShapeElement data={el.data as ShapeData} />;
    case "svg":
      return <SvgElement data={el.data as SVGData} />;
    case "table":
      return <TableElement data={el.data as TableData} />;
    case "chart":
      return <ChartElement data={el.data as ChartData} />;
    default:
      return null;
  }
});
SlideElement.displayName = "SlideElement";

function arePropsEqual(
  prev: { slide: SlideType },
  next: { slide: SlideType }
): boolean {
  if (prev.slide.id !== next.slide.id) return false;
  if (prev.slide.background !== next.slide.background) return false;
  if (prev.slide.width !== next.slide.width) return false;
  if (prev.slide.height !== next.slide.height) return false;
  if (prev.slide.elements.length !== next.slide.elements.length) return false;
  for (let i = 0; i < prev.slide.elements.length; i++) {
    if (prev.slide.elements[i].id !== next.slide.elements[i].id) return false;
    if (prev.slide.elements[i].data !== next.slide.elements[i].data) return false;
  }
  return true;
}
// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MiniSlidePreview({ slide }: { slide: SlideType }) {
  const slideWidth = slide.width ?? 853.33;
  const slideHeight = slide.height ?? 480;

  const elements = useMemo(
    () => slide.elements.map((el) => <SlideElement key={el.id} el={el} />),
    [slide.elements]
  );

  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        width: slideWidth * SCALE,
        height: slideHeight * SCALE,
        background: slide.background,
        contain: "strict",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div
        style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {elements}
      </div>
    </div>
  );
}

export default React.memo(MiniSlidePreview, arePropsEqual);
