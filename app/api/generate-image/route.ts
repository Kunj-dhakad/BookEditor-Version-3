

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import JSZip from "jszip";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/* ================ TYPES ================= */



type Transform = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextData = Transform & {
  type: "text";
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
};

type ImageData = Transform & {
  type: "image";
  src: string;
  objectFit?: string;
  opacity?: number;
  borderRadius?: string;
};

type SVGData = Transform & {
  type: "svg";
  svg: string;
  color?: string;
};

type ElementData = TextData | ImageData | SVGData;

type SlideElement = {
  id: string;
  data: ElementData;
};

type Slide = {
  width?: number;
  height?: number;
  background?: string;
  elements: SlideElement[];
};

/* ================= API ================= */



const KD_AWS_S3_BUCKET_NAME =
  process.env.KD_AWS_S3_BUCKET_NAME || "kd-presentation-editor";

const KD_AWS_REGION =
  process.env.KD_AWS_REGION || "us-east-1";

const s3 = new S3Client({
  region: KD_AWS_REGION,
});






export async function POST(req: NextRequest) {
  try {
    const { slides }: { slides: Slide[] } = await req.json();

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json({ error: "Invalid slides" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const zip = new JSZip();

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const page = await browser.newPage();

      await page.setViewport({
        width: Math.round(slide.width || 853),
        height: Math.round(slide.height || 480),
        deviceScaleFactor: 2,
      });

      /* ================= HTML ================= */

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    body {
      background: ${slide.background || "#000"};
      font-family: system-ui, -apple-system, BlinkMacSystemFont,
                   "Segoe UI", Roboto, Arial, sans-serif;
      overflow: hidden;
    }

    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }
  </style>
</head>
<body>
  ${slide.elements
          .map(({ data }) => {
            /* ---------- TEXT ---------- */
            if (data.type === "text") {
              return `
        <div
  style="
    position:absolute;
    left:${data.x}px;
    top:${data.y}px;
    width:${data.width}px;

    min-height:${data.height}px;
    height:auto;

    margin:0;
    padding:0;

    color:${data.color || "#fff"};
    font-size:${data.fontSize || 24}px;
    font-weight:${data.fontWeight ?? 400};
    text-align:${data.textAlign || "left"};
    line-height:${data.lineHeight ?? 1.2};
    letter-spacing:${data.letterSpacing || 0}px;

    white-space:pre-wrap;
    word-break:break-word;
    overflow:visible;
  "
>
${data.text}
</div>

`;
            }

            /* ---------- IMAGE ---------- */
            if (data.type === "image") {
              return `<img
  src="${data.src}"
  style="
    position:absolute;
    left:${data.x}px;
    top:${data.y}px;
    width:${data.width}px;
    height:${data.height}px;
    object-fit:${data.objectFit || "cover"};
    opacity:${data.opacity ?? 1};
    border-radius:${data.borderRadius || "0"};
  "
/>`;
            }

            /* ---------- SVG ---------- */
            if (data.type === "svg") {
              return `<div
  style="
    position:absolute;
    left:${data.x}px;
    top:${data.y}px;
    width:${data.width}px;
    height:${data.height}px;
    color:${data.color || "#fff"};
  "
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    fill="currentColor"
  >
    ${data.svg}
  </svg>
</div>`;
            }

            return "";
          })
          .join("")}
</body>
</html>`;

      /* ================= RENDER ================= */

      await page.setContent(html, { waitUntil: "load" });

      // system fonts → instant
      await page.evaluate(() => document.fonts.ready);

      // wait for images
      await page.evaluate(async () => {
        const imgs = Array.from(document.images);
        await Promise.all(
          imgs.map(img =>
            img.complete
              ? Promise.resolve()
              : new Promise(res => {
                img.onload = img.onerror = res;
              })
          )
        );
      });

      // safety delay
      await new Promise(res => setTimeout(res, 50));

      const png = await page.screenshot({ type: "png" });
      zip.file(`slide-${i + 1}.png`, png);

      await page.close();
    }

    await browser.close();

    // const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    // return new Response(Buffer.from(zipBuffer), {
    //   headers: {
    //     "Content-Type": "application/zip",
    //     "Content-Disposition": 'attachment; filename="slides-images.zip"',
    //   },
    // });
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const fileKey = `Kd_SlideEditor/temp-images/${Date.now()}.zip`;

    await s3.send(
      new PutObjectCommand({
        Bucket: KD_AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: zipBuffer,
        ContentType: "application/zip",
      })
    );


    setTimeout(async () => {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: KD_AWS_S3_BUCKET_NAME,
            Key: fileKey,
          })
        );
      } catch (err) {
        console.error("ZIP auto delete failed:", err);
      }
    }, 10 * 60 * 1000);

    return NextResponse.json({
      url: `https://${KD_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}



