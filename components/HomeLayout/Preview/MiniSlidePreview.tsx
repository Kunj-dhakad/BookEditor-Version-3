// "use client";
// import React, { useMemo } from "react";
// import Image from "next/image";
// import {
//   SlideType,
//   ElementType,
//   TextData,
//   ImageData,
//   ButtonData,
//   SVGData,
//   VideoData,
//   ShapeData,
// } from "@/app/Store/editorStore";

// const SCALE = 0.2;

// const TextElement = React.memo(({ data }: { data: TextData }) => (
//   <div
//     style={{
//       position: "absolute",
//       left: data.x + 4,
//       top: data.y + 4,
//       width: data.width - 8,
//       height: data.height,
//       color: data.color,
//       fontSize: data.fontSize,
//       fontFamily: data.fontFamily,
//       whiteSpace: "pre-wrap",
//       lineHeight: data.lineHeight,
//       letterSpacing: data.letterSpacing,
//       fontWeight: data.fontWeight,
//       textAlign: data.align,
//       textTransform: data.textTransform || "none",
//       contain: "strict",
//     }}
//     dangerouslySetInnerHTML={{ __html: data.html || data.text }}
//   />
// ));
// TextElement.displayName = "TextElement";

// // eslint-disable-next-line react/display-name
// const ButtonElement = React.memo(({ data }: { data: ButtonData }) => {
//   const hasGradient = data.gradientFrom && data.gradientTo;
//   const dir =
//     data.gradientDirection === "vertical"
//       ? "to bottom"
//       : data.gradientDirection === "horizontal"
//         ? "to right"
//         : "135deg";

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: data.x,
//         top: data.y,
//         width: data.width,
//         height: data.height,
//         fontSize: data.fontSize,
//         fontFamily: data.fontFamily,
//         fontWeight: data.fontWeight,
//         borderRadius: data.borderRadius,
//         color: data.textColor,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 4,
//         border:
//           data.borderWidth && data.borderWidth > 0
//             ? `${data.borderWidth}px solid ${data.borderColor ?? "transparent"}`
//             : "none",
//         background: hasGradient
//           ? `linear-gradient(${dir}, ${data.gradientFrom}, ${data.gradientTo})`
//           : data.backgroundColor || "transparent",
//         padding: "0 16px",
//         boxSizing: "border-box",
//         whiteSpace: "nowrap",
//         overflow: "hidden",
//         contain: "strict",
//       }}
//     >
//       {data.icon && data.iconPosition === "left" && <span>{data.icon}</span>}
//       <span>{data.text}</span>
//       {data.icon && data.iconPosition !== "left" && <span>{data.icon}</span>}
//     </div>
//   );
// });

// const ImageElement = React.memo(({ data }: { data: ImageData }) => (
//   <Image
//     src={data.src}
//     width={500}
//     height={500}
//     alt=""
//     draggable={false}
//     loading="lazy"
//     unoptimized
//     onError={(e) => {
//       const t = e.currentTarget as HTMLImageElement;
//       t.onerror = null;
//       t.src = `data:image/svg+xml;base64,${btoa(
//         `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`,
//       )}`;
//     }}
//     style={{
//       position: "absolute",
//       left: data.x,
//       top: data.y,
//       transform: `rotate(${data.rotation ?? 0}deg)`,
//       opacity: `${data.opacity ?? 100 / 100}`,
//       transformOrigin: "center center",
//       width: data.width,
//       height: data.height,
//       objectFit: "cover",
//     }}
//   />
// ));
// ImageElement.displayName = "ImageElement";

// const SvgElement = React.memo(({ data }: { data: SVGData }) => (
//   <Image
//     src={data.src}
//     width={500}
//     height={500}
//     alt=""
//     draggable={false}
//     loading="lazy"
//     unoptimized
//     onError={(e) => {
//       const t = e.currentTarget as HTMLImageElement;
//       t.onerror = null;
//       t.src = `data:image/svg+xml;base64,${btoa(
//         `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`,
//       )}`;
//     }}
//     style={{
//       position: "absolute",
//       left: data.x,
//       top: data.y,
//       transform: `rotate(${data.rotation ?? 0}deg)`,
//       transformOrigin: "center center",
//       opacity: `${data.opacity ?? 100 / 100}`,
//       width: data.width,
//       height: data.height,
//       objectFit: "cover",
//     }}
//   />
// ));
// SvgElement.displayName = "SvgElement";

// const ShapeElement = React.memo(({ data }: { data: ShapeData }) => (
//   <div
//     style={{
//       position: "absolute",
//       left: data.x,
//       top: data.y,
//       width: data.width,
//       opacity: `${data.opacity ?? 100 / 100}`,
//       height: data.height,
//       contain: "strict",
//     }}
//   >
//     <svg
//       width="100%"
//       height="100%"
//       viewBox="0 0 100 100"
//       preserveAspectRatio="none"
//       dangerouslySetInnerHTML={{ __html: data.shape || "" }}
//     />
//   </div>
// ));
// ShapeElement.displayName = "ShapeElement";

// const VideoElement = React.memo(({ data }: { data: VideoData }) =>
//   data.thumbnail ? (
//     <Image
//       src={data.thumbnail}
//       draggable={false}
//       unoptimized
//       style={{
//         position: "absolute",
//         left: data.x,
//         top: data.y,
//         width: data.width,
//         height: data.height,
//         objectFit: "cover",
//       }}
//       width={500}
//       height={500}
//       alt="Picture of the author"
//     />
//   ) : (
//     <video
//       src={data.src}
//       draggable={false}
//       style={{
//         position: "absolute",
//         left: data.x,
//         top: data.y,
//         width: data.width,
//         height: data.height,
//         objectFit: "cover",
//       }}
//     />
//   ),
// );
// VideoElement.displayName = "VideoElement";

// // ─── Dispatcher —
// const SlideElement = React.memo(({ el }: { el: ElementType }) => {
//   switch (el.data.type) {
//     case "text":
//       return <TextElement data={el.data as TextData} />;
//     case "button":
//       return <ButtonElement data={el.data as ButtonData} />;

//     case "image":
//       return <ImageElement data={el.data as ImageData} />;

//     case "video":
//       return <VideoElement data={el.data as VideoData} />;

//     case "shape":
//       return <ShapeElement data={el.data as ShapeData} />;
//     case "svg":
//       return <SvgElement data={el.data as SVGData} />;
//     default:
//       return null;
//   }
// });
// SlideElement.displayName = "SlideElement";

// function arePropsEqual(
//   prev: { slide: SlideType },
//   next: { slide: SlideType },
// ): boolean {
//   if (prev.slide.id !== next.slide.id) return false;
//   if (prev.slide.background !== next.slide.background) return false;
//   if (prev.slide.width !== next.slide.width) return false;
//   if (prev.slide.height !== next.slide.height) return false;
//   if (prev.slide.elements.length !== next.slide.elements.length) return false;
//   for (let i = 0; i < prev.slide.elements.length; i++) {
//     if (prev.slide.elements[i].id !== next.slide.elements[i].id) return false;
//     if (prev.slide.elements[i].data !== next.slide.elements[i].data)
//       return false;
//   }
//   return true;
// }
// // ─── Main component ────────────────────────────────────────────────────────
// function MiniSlidePreview({ slide }: { slide: SlideType }) {
//   const slideWidth = slide.width ?? 853.33;
//   const slideHeight = slide.height ?? 480;

//   const elements = useMemo(
//     () => slide.elements.map((el) => <SlideElement key={el.id} el={el} />),
//     [slide.elements],
//   );

//   return (
//     <div
//       className="relative rounded overflow-hidden"
//       style={{
//         width: slideWidth * SCALE,
//         height: slideHeight * SCALE,
//         background: slide.background,
//         contain: "strict",
//         willChange: "transform",
//         transform: "translateZ(0)",
//       }}
//     >
//       <div
//         style={{
//           width: slideWidth,
//           height: slideHeight,
//           transform: `scale(${SCALE})`,
//           transformOrigin: "top left",
//           position: "absolute",
//           top: 0,
//           left: 0,
//           pointerEvents: "none",
//         }}
//       >
//         {elements}
//       </div>
//     </div>
//   );
// }

// export default React.memo(MiniSlidePreview, arePropsEqual);



"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { loadGoogleFont } from "@/lib/FontFamily/useFontLoader";
import {
  SlideType,
  ElementType,
  TextData,
  ImageData,
  ButtonData,
  SVGData,
  VideoData,
  ShapeData,
  InteractionData,
} from "@/app/Store/editorStore";
import InteractionFace from "@/components/blocks/Interaction/renderer/InteractionFace";

const SCALE = 0.2;

// const TextElement = React.memo(({ data }: { data: TextData }) => {
//   useEffect(() => {
//     if (data.fontFamily) loadGoogleFont(data.fontFamily);
//   }, [data.fontFamily]);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: data.x + 4,
//         top: data.y + 4,
//         width: data.width - 8,
//         height: data.height,
//         color: data.color,
//         fontSize: data.fontSize,
//         fontFamily: data.fontFamily,
//         whiteSpace: "pre-wrap",
//         lineHeight: data.lineHeight,
//         letterSpacing: data.letterSpacing,
//         fontWeight: data.fontWeight,
//         textAlign: data.align,
//         textTransform: data.textTransform || "none",
//         contain: "strict",
//       }}
//       dangerouslySetInnerHTML={{ __html: data.html || data.text }}
//     />
//   );
// });
// TextElement.displayName = "TextElement";



const TextElement = React.memo(({ data }: { data: TextData }) => {
  useEffect(() => {
    if (data.fontFamily) loadGoogleFont(data.fontFamily);
  }, [data.fontFamily]);

  return (
    <div
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,               // exact content width – do NOT shrink it
        minHeight: data.height,
        boxSizing: "border-box",
        // NO padding here
        color: data.color,
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: data.lineHeight,
        letterSpacing: data.letterSpacing,
        fontWeight: data.fontWeight,
        fontStyle: data.fontStyle,
        textAlign: data.align,
        textTransform: data.textTransform || "none",
        textDecoration: data.link ? "underline" : data.textDecoration,
        background: data.backgroundColor || "transparent",
        overflow: "visible",
      }}
      dangerouslySetInnerHTML={{ __html: data.html || data.text }}
    />
  );
});
TextElement.displayName = "TextElement";



// eslint-disable-next-line react/display-name
const ButtonElement = React.memo(({ data }: { data: ButtonData }) => {
  useEffect(() => {
    if (data.fontFamily) loadGoogleFont(data.fontFamily);
  }, [data.fontFamily]);

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
      {data.icon && data.iconPosition === "left" && <span>{data.icon}</span>}
      <span>{data.text}</span>
      {data.icon && data.iconPosition !== "left" && <span>{data.icon}</span>}
    </div>
  );
});

const ImageElement = React.memo(({ data, eager }: { data: ImageData; eager: boolean }) => (
  <Image
    src={data.src}
    width={500}
    height={500}
    alt=""
    draggable={false}
    loading={eager ? "eager" : "lazy"}
    unoptimized
    onError={(e) => {
      const t = e.currentTarget as HTMLImageElement;
      t.onerror = null;
      t.src = `data:image/svg+xml;base64,${btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`,
      )}`;
    }}
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      transform: `
        rotate(${data.rotation ?? 0}deg)
        scaleX(${data.flipX ? -1 : 1})
        scaleY(${data.flipY ? -1 : 1})
      `,
      opacity: `${data.opacity ?? 100 / 100}`,
      transformOrigin: "center center",
      width: data.width,
      height: data.height,
      objectFit: "cover",
      border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
      borderRadius: data.borderRadius || 0,
      filter: `
        contrast(${data.contrast ?? 100}%)
        brightness(${data.brightness ?? 100}%)
        saturate(${data.saturate ?? 100}%)
        blur(${data.blur ?? 0}px)
        grayscale(${data.grayscale ?? 0}%)
        sepia(${data.sepia ?? 0}%)
        hue-rotate(${data.hueRotate ?? 0}deg)
      `,
    }}
  />
));
ImageElement.displayName = "ImageElement";

const SvgElement = React.memo(({ data, eager }: { data: SVGData; eager: boolean }) => (
  <Image
    src={data.src}
    width={500}
    height={500}
    alt=""
    draggable={false}
    loading={eager ? "eager" : "lazy"}
    unoptimized
    onError={(e) => {
      const t = e.currentTarget as HTMLImageElement;
      t.onerror = null;
      t.src = `data:image/svg+xml;base64,${btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#1e1e2c'/></svg>`,
      )}`;
    }}
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      transform: `
        rotate(${data.rotation ?? 0}deg)
        scaleX(${data.flipX ? -1 : 1})
        scaleY(${data.flipY ? -1 : 1})
      `,
      transformOrigin: "center center",
      opacity: `${data.opacity ?? 100 / 100}`,
      width: data.width,
      height: data.height,
      objectFit: "cover",
      border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
      borderRadius: data.borderRadius || 0,
      filter: `
        contrast(${data.contrast ?? 100}%)
        brightness(${data.brightness ?? 100}%)
        saturate(${data.saturate ?? 100}%)
        blur(${data.blur ?? 0}px)
        grayscale(${data.grayscale ?? 0}%)
        sepia(${data.sepia ?? 0}%)
        hue-rotate(${data.hueRotate ?? 0}deg)
      `,
    }}
  />
));
SvgElement.displayName = "SvgElement";

// const ShapeElement = React.memo(({ data }: { data: ShapeData }) => {
//   const clipId = `shape-clip-preview-${data.shape?.length ?? 0}`;
//   const radius = data.borderRadius ? parseInt(String(data.borderRadius)) : 0;
//   const dash =
//     data.strokeStyle === "dashed" ? "8 4" :
//       data.strokeStyle === "dotted" ? "2 4" :
//         data.strokeStyle === "inset" ? "12 6" :
//           "none";

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: data.x,
//         top: data.y,
//         width: data.width,
//         height: data.height,
//         opacity: data.opacity ?? 1,
//         transform: [
//           `rotate(${data.rotation ?? 0}deg)`,
//           data.flipX ? "scaleX(-1)" : "",
//           data.flipY ? "scaleY(-1)" : "",
//         ].filter(Boolean).join(" ") || undefined,
//         transformOrigin: "center center",
//         contain: "strict",
//       }}
//     >
//       <svg
//         width="100%"
//         height="100%"
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//         style={{ overflow: "visible" }}
//         dangerouslySetInnerHTML={{
//           __html: `
//             <clipPath id="${clipId}">
//               <rect width="100" height="100" rx="${radius}" ry="${radius}"/>
//             </clipPath>
//             <g clip-path="url(#${clipId})" fill="${data.color ?? "currentColor"}">
//               ${data.shape ?? ""}
//             </g>
//             ${data.strokeWidth ? `
//             <rect
//               width="100" height="100"
//               rx="${radius}" ry="${radius}"
//               fill="none"
//               stroke="${data.strokeColor ?? "#000"}"
//               stroke-width="${data.strokeWidth * 2}"
//               stroke-dasharray="${dash}"
//             />` : ""}
//           `,
//         }}
//       />
//     </div>
//   );
// });
// ShapeElement.displayName = "ShapeElement";



const ShapeElement = React.memo(({ data, id }: { data: ShapeData; id: string }) => {
  const clipId = `shape-clip-preview-${id}`;
  const radius = data.borderRadius ? parseInt(String(data.borderRadius)) || 0 : 0;
  const dash =
    data.strokeStyle === "dashed" ? "8 4" :
    data.strokeStyle === "dotted" ? "2 4" :
    data.strokeStyle === "inset"  ? "12 6" :
    "none";

  const shapeColor = data.color || data.fill || "#000000";
  const cleanShape = (data.shape || "")
    .replace(/fill="[^"]*"/gi, "")
    .replace(/fill='[^']*'/gi, "")
    .replace(/fill:[^;"]+;?/gi, "");

  return (
    <div
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        opacity: data.opacity ?? 1,
        transform: [
          `rotate(${data.rotation ?? 0}deg)`,
          data.flipX ? "scaleX(-1)" : "",
          data.flipY ? "scaleY(-1)" : "",
        ].filter(Boolean).join(" ") || undefined,
        transformOrigin: "center center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible", fill: shapeColor }}   
      >
        <defs>
          <clipPath id={clipId}>
            <rect width="100" height="100" rx={radius} ry={radius} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`} fill={shapeColor}>
          <g dangerouslySetInnerHTML={{ __html: cleanShape }} />
        </g>

        {data.strokeWidth ? (
          <rect
            width="100"
            height="100"
            rx={radius}
            ry={radius}
            fill="none"
            stroke={data.strokeColor || "#000"}
            strokeWidth={data.strokeWidth * 2}
            strokeDasharray={dash}
          />
        ) : null}
      </svg>
    </div>
  );
});
ShapeElement.displayName = "ShapeElement";







const VideoElement = React.memo(({ data, eager }: { data: VideoData; eager: boolean }) =>
  data.thumbnail ? (
    <Image
      src={data.thumbnail}
      draggable={false}
      unoptimized
      loading={eager ? "eager" : "lazy"}
      style={{
        position: "absolute",
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        objectFit: "cover",
        // (RenderVideo.tsx ke saath consistent) flip, border aur filters
        // — pehle ye missing the.
        transform: `
          scaleX(${data.flipX ? -1 : 1})
          scaleY(${data.flipY ? -1 : 1})
        `,
        border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
        borderRadius: data.borderRadius || 0,
        filter: `
          contrast(${data.contrast ?? 100}%)
          brightness(${data.brightness ?? 100}%)
          saturate(${data.saturate ?? 100}%)
          blur(${data.blur ?? 0}px)
          grayscale(${data.grayscale ?? 0}%)
          sepia(${data.sepia ?? 0}%)
          hue-rotate(${data.hueRotate ?? 0}deg)
        `,
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
        transform: `
          scaleX(${data.flipX ? -1 : 1})
          scaleY(${data.flipY ? -1 : 1})
        `,
        border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle ?? "none"} ${data.strokeColor ?? "#000"}` : undefined,
        borderRadius: data.borderRadius || 0,
        filter: `
          contrast(${data.contrast ?? 100}%)
          brightness(${data.brightness ?? 100}%)
          saturate(${data.saturate ?? 100}%)
          blur(${data.blur ?? 0}px)
          grayscale(${data.grayscale ?? 0}%)
          sepia(${data.sepia ?? 0}%)
          hue-rotate(${data.hueRotate ?? 0}deg)
        `,
      }}
    />
  ),
);
VideoElement.displayName = "VideoElement";

// Interactions were missing from thumbnails entirely, so a page full of quiz
// buttons and link tags looked empty in the Pages panel.
const InteractionElement = React.memo(({ data }: { data: InteractionData }) => (
  <div
    style={{
      position: "absolute",
      left: data.x,
      top: data.y,
      width: data.width,
      height: data.height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: "0 14px",
      boxSizing: "border-box",
      background: data.backgroundColor ?? "transparent",
      borderRadius: data.borderRadius ?? 0,
      opacity: data.opacity ?? 1,
      transform: `rotate(${data.rotation ?? 0}deg)`,
      transformOrigin: "center center",
      overflow: "hidden",
    }}
  >
    <InteractionFace data={data} />
  </div>
));
InteractionElement.displayName = "InteractionElement";

// ─── Dispatcher —
const SlideElement = React.memo(({ el, eagerImages }: { el: ElementType; eagerImages: boolean }) => {
  switch (el.data.type) {
    case "text":
      return <TextElement data={el.data as TextData} />;
    case "button":
      return <ButtonElement data={el.data as ButtonData} />;
    case "interaction":
      return <InteractionElement data={el.data as InteractionData} />;

    case "image":
      return <ImageElement data={el.data as ImageData} eager={eagerImages} />;

    case "video":
      return <VideoElement data={el.data as VideoData} eager={eagerImages} />;

    case "shape":
      return <ShapeElement data={el.data as ShapeData} id={el.id} />;
    case "svg":
      return <SvgElement data={el.data as SVGData} eager={eagerImages} />;
    default:
      return null;
  }
});
SlideElement.displayName = "SlideElement";

type MiniSlidePreviewProps = {
  slide: SlideType;
  /** Render scale. Defaults to the sidebar thumbnail scale. */
  scale?: number;
  /** Load preview images immediately (needed for nested scrolling lists). */
  eagerImages?: boolean;
};

function arePropsEqual(
  prev: MiniSlidePreviewProps,
  next: MiniSlidePreviewProps,
): boolean {
  if ((prev.scale ?? SCALE) !== (next.scale ?? SCALE)) return false;
  if ((prev.eagerImages ?? false) !== (next.eagerImages ?? false)) return false;
  if (prev.slide.id !== next.slide.id) return false;
  if (prev.slide.background !== next.slide.background) return false;
  if (prev.slide.width !== next.slide.width) return false;
  if (prev.slide.height !== next.slide.height) return false;
  if (prev.slide.elements.length !== next.slide.elements.length) return false;
  for (let i = 0; i < prev.slide.elements.length; i++) {
    if (prev.slide.elements[i].id !== next.slide.elements[i].id) return false;
    if (prev.slide.elements[i].data !== next.slide.elements[i].data)
      return false;
  }
  return true;
}
// ─── Main component ────────────────────────────────────────────────────────
function MiniSlidePreview({ slide, scale = SCALE, eagerImages = false }: MiniSlidePreviewProps) {
  const slideWidth = slide.width ?? 853.33;
  const slideHeight = slide.height ?? 480;

  const elements = useMemo(
    () => slide.elements.map((el) => <SlideElement key={el.id} el={el} eagerImages={eagerImages} />),
    [slide.elements, eagerImages],
  );

  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        width: slideWidth * scale,
        height: slideHeight * scale,
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
          transform: `scale(${scale})`,
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
