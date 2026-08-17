// export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import PptxGenJS from "pptxgenjs";
// import {
//     S3Client,
//     PutObjectCommand,
//     DeleteObjectCommand,
// } from "@aws-sdk/client-s3";

// const pxToIn = (px: number) => px / 96;

// // const CANVAS_WIDTH = 853.333;
// // const CANVAS_HEIGHT = 480;

// const KD_AWS_S3_BUCKET_NAME = process.env.KD_AWS_S3_BUCKET_NAME;
// const KD_AWS_REGION = process.env.AWS_REGION;

// const s3 = new S3Client({
//     region: KD_AWS_REGION,
// });

// export async function POST(req: NextRequest) {
//     try {
//         const { slides } = await req.json();
//         const CANVAS_WIDTH = slides[0].width;
//         const CANVAS_HEIGHT = slides[0].height;
        
//         if (!slides || !Array.isArray(slides)) {
//             return NextResponse.json({ error: "Slides missing" }, { status: 400 });
//         }

//         const pptx = new PptxGenJS();

//         pptx.defineLayout({
//             name: "CUSTOM",
//             width: pxToIn(CANVAS_WIDTH),
//             height: pxToIn(CANVAS_HEIGHT),
//         });

//         pptx.layout = "CUSTOM";

//         for (const slide of slides) {
//             const sld = pptx.addSlide();



//             const bg = slide.background;

//             if (typeof bg === "string" && bg.startsWith("url(")) {
//                 const match = bg.match(/url\((.*?)\)/);

//                 if (match && match[1]) {
//                     sld.background = {
//                         path: match[1].replace(/['"]/g, ""),
//                     };
//                 }
//             }

//             else if (typeof bg === "string") {
//                 sld.background = { color: bg.replace("#", "") };
//             }


//             // sld.background = { color: slide.background };

//             for (const el of slide.elements) {
//                 const data = el.data;

//                 if (data.type === "text") {
//                     sld.addText(data.text || "", {
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                         fontSize: data.fontSize * 0.75,
//                         color: data.color,
//                         fontFace: data.fontFamily,
//                         wrap: true,
//                     });
//                 }



//                 if (data.type === "button") {
//                     const shapeOptions: Record<string, unknown> = {
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                     };

//                     if (data.backgroundColor) {
//                         shapeOptions.fill = {
//                             color: data.backgroundColor.replace("#", ""),
//                         };
//                     }

//                     if (data.gradientFrom && data.gradientTo) {
//                         shapeOptions.fill = {
//                             type: "gradient",
//                             stops: [
//                                 {
//                                     pos: 0,
//                                     color: data.gradientFrom.replace("#", ""),
//                                 },
//                                 {
//                                     pos: 100,
//                                     color: data.gradientTo.replace("#", ""),
//                                 },
//                             ],
//                         };
//                     }

//                     if (data.borderWidth && data.borderWidth > 0) {
//                         shapeOptions.line = {
//                             color: data.borderColor?.replace("#", "") || "000000",
//                             pt: data.borderWidth,
//                         };
//                     } else {
//                         shapeOptions.line = { type: "none" };
//                     }

//                     if (data.borderRadius) {
//                         shapeOptions.rectRadius = pxToIn(data.borderRadius);
//                     }

//                     sld.addShape(pptx.ShapeType.rect, shapeOptions);

//                     const textOptions: Record<string, unknown> = {
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                         fontSize: data.fontSize * 0.75,
//                         fontFace: data.fontFamily,
//                         bold: data.fontWeight === "bold",
//                         color: data.textColor?.replace("#", "") || "000000",
//                         align: "center",
//                         valign: "middle",
//                         wrap: false,
//                     };

//                     if (data.link && typeof data.link === "string") {
//                         textOptions.hyperlink = { url: data.link };
//                     }

//                     sld.addText(data.text || "", textOptions);
//                 }








//                 if (data.type === "image" && data.src) {
//                     sld.addImage({
//                         path: data.src,
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                     });
//                 }

//                 if (data.type === "shape") {
//                     sld.addShape(pptx.ShapeType.rect, {
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                         fill: { color: data.fill },
//                         line: {
//                             color: data.stroke || "FFFFFF",
//                             width: data.strokeWidth || 0,
//                         },
//                     });
//                 }

//                 if (data.type === "svg") {
//                     const finalSvg = data.svg.replace(
//                         /currentColor/g,
//                         data.color || "#000000"
//                     );

//                     const base64 =
//                         "data:image/svg+xml;base64," +
//                         Buffer.from(finalSvg).toString("base64");

//                     sld.addImage({
//                         data: base64,
//                         x: pxToIn(data.x),
//                         y: pxToIn(data.y),
//                         w: pxToIn(data.width),
//                         h: pxToIn(data.height),
//                     });
//                 }
//             }
//         }

//         // ✅ PPT generate (stream use kar rahe hain – tumhara original way)
//         const result = await pptx.stream();
//         let buffer: Buffer;

//         if (typeof result === "string") {
//             buffer = Buffer.from(result, "base64");
//         } else if (Buffer.isBuffer(result)) {
//             buffer = result;
//         } else if (result instanceof ArrayBuffer) {
//             buffer = Buffer.from(new Uint8Array(result));
//         } else if (result instanceof Uint8Array) {
//             buffer = Buffer.from(result);
//         } else if (typeof Blob !== "undefined" && result instanceof Blob) {
//             const ab = await result.arrayBuffer();
//             buffer = Buffer.from(new Uint8Array(ab));
//         } else {
//             buffer = Buffer.from(String(result));
//         }

//         // ✅ S3 key
//         const fileKey = `Kd_SlideEditor/temp-ppt/${Date.now()}.pptx`;
//         // console.log("REGION111 =",KD_AWS_REGION);
//         // console.log("BUCKET111 =", KD_AWS_S3_BUCKET_NAME);
//         // ✅ Upload to S3
//         await s3.send(
//             new PutObjectCommand({
//                 Bucket: KD_AWS_S3_BUCKET_NAME,
//                 Key: fileKey,
//                 Body: buffer,
//                 ContentType:
//                     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//             })
//         );

//         // ✅ 10 minute baad auto delete
//         setTimeout(async () => {
//             try {
//                 await s3.send(
//                     new DeleteObjectCommand({
//                         Bucket: KD_AWS_S3_BUCKET_NAME,
//                         Key: fileKey,
//                     })
//                 );
//                 // console.log("PPT auto deleted:", fileKey);
//             } catch (err) {
//                 console.error("Auto delete failed:", err);
//             }
//         }, 10 * 60 * 1000);

//         // ✅ Sirf URL return
//         return NextResponse.json({
//             url: `https://${KD_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
//         });
//     } catch (error: unknown) {
//         const message =
//             error instanceof Error ? error.message : "Internal Server Error";

//         return NextResponse.json({ error: message }, { status: 500 });
//     }
// }



export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { interactionFlatLabel } from "@/components/blocks/Interaction/renderer/interactionLabel";
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const pxToIn = (px: number) => px / 96;

const KD_AWS_S3_BUCKET_NAME = process.env.KD_AWS_S3_BUCKET_NAME;
const KD_AWS_REGION = process.env.AWS_REGION;

const s3 = new S3Client({
    region: KD_AWS_REGION,
});

// ─── HTML helpers ────────────────────────────────────────────────────────────

function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
}

/** Convert css color string (rgb(...) or #hex) → 6-char hex (no #) */
function cssColorToHex(color: string): string {
    const rgbMatch = color.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (rgbMatch) {
        return [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
            .map((n) => parseInt(n).toString(16).padStart(2, "0"))
            .join("");
    }
    return color.replace("#", "");
}

/**
 * Parse an HTML string (with inline <span style="..."> tags) into an array
 * of PptxGenJS TextProps runs so colours, underline, strike-through, etc.
 * are preserved in the exported PPTX.
 */
function parseHtmlToRuns(
    html: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaults: Record<string, any>
): PptxGenJS.TextProps[] {
    const runs: PptxGenJS.TextProps[] = [];

    const baseFontSize = ((defaults.fontSize as number) || 16) * 0.75;
    const baseFontFace = (defaults.fontFamily as string) || "Inter";
    const baseColor = ((defaults.color as string) || "#ffffff").replace("#", "");
    const baseBold =
        defaults.fontWeight === "bold" ||
        defaults.fontWeight === "700" ||
        defaults.fontWeight === 700;
    const baseItalic = defaults.fontStyle === "italic";

    // Match either a <span ...>text</span> block or a plain text node
    const spanRegex = /<span([^>]*)>([\s\S]*?)<\/span>|([^<]+)/g;
    let match: RegExpExecArray | null;

    while ((match = spanRegex.exec(html)) !== null) {
        // ── plain text node ──────────────────────────────────────────────────
        if (match[3] !== undefined) {
            const text = decodeHtmlEntities(match[3]);
            if (!text.trim() && text !== " ") continue;
            runs.push({
                text,
                options: {
                    fontSize: baseFontSize,
                    fontFace: baseFontFace,
                    color: baseColor,
                    bold: baseBold,
                    italic: baseItalic,
                },
            });
            continue;
        }

        // ── <span> node ──────────────────────────────────────────────────────
        const attrs = match[1];
        // Strip any nested tags inside the span (shouldn't happen, but safety first)
        const innerText = decodeHtmlEntities(match[2].replace(/<[^>]+>/g, ""));
        if (!innerText) continue;

        const styleMatch = attrs.match(/style="([^"]*)"/);
        const styleStr = styleMatch ? styleMatch[1] : "";

        const colorMatch    = styleStr.match(/(?:^|;)\s*color:\s*([^;]+)/);
        const textDecoMatch = styleStr.match(/text-decoration:\s*([^;]+)/);
        const fontWeightMatch = styleStr.match(/font-weight:\s*([^;]+)/);
        const fontStyleMatch  = styleStr.match(/font-style:\s*([^;]+)/);

        const runColor = colorMatch
            ? cssColorToHex(colorMatch[1].trim())
            : baseColor;

        const decorations  = textDecoMatch ? textDecoMatch[1].trim() : "";
        const isUnderline  = decorations.includes("underline");
        const isStrike     = decorations.includes("line-through");

        const isBold = fontWeightMatch
            ? fontWeightMatch[1].trim() === "bold" ||
              parseInt(fontWeightMatch[1].trim()) >= 700
            : baseBold;

        const isItalic = fontStyleMatch
            ? fontStyleMatch[1].trim() === "italic"
            : baseItalic;

        const runOpts: PptxGenJS.TextPropsOptions = {
            fontSize: baseFontSize,
            fontFace: baseFontFace,
            color: runColor,
            bold: isBold,
            italic: isItalic,
        };
        if (isUnderline) runOpts.underline = { style: "sng" };
        if (isStrike)    runOpts.strike    = "sngStrike";

        runs.push({ text: innerText, options: runOpts });
    }

    // Fallback: strip all tags and return plain run
    if (runs.length === 0) {
        runs.push({
            text: html.replace(/<[^>]+>/g, "") || "",
            options: {
                fontSize: baseFontSize,
                fontFace: baseFontFace,
                color: baseColor,
                bold: baseBold,
                italic: baseItalic,
            },
        });
    }

    return runs;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const { slides } = await req.json();

        if (!slides || !Array.isArray(slides)) {
            return NextResponse.json({ error: "Slides missing" }, { status: 400 });
        }

        const CANVAS_WIDTH  = slides[0].width;
        const CANVAS_HEIGHT = slides[0].height;

        const pptx = new PptxGenJS();

        pptx.defineLayout({
            name: "CUSTOM",
            width:  pxToIn(CANVAS_WIDTH),
            height: pxToIn(CANVAS_HEIGHT),
        });
        pptx.layout = "CUSTOM";

        for (const slide of slides) {
            const sld = pptx.addSlide();

            // ── Background ───────────────────────────────────────────────────
            const bg = slide.background;
            if (typeof bg === "string" && bg.startsWith("url(")) {
                const m = bg.match(/url\((.*?)\)/);
                if (m?.[1]) sld.background = { path: m[1].replace(/['"]/g, "") };
            } else if (typeof bg === "string") {
                sld.background = { color: bg.replace("#", "") };
            }

            // ── Elements ─────────────────────────────────────────────────────
            for (const el of slide.elements) {
                const data = el.data;

                // ── TEXT ─────────────────────────────────────────────────────
                if (data.type === "text") {
                    const htmlSource = data.html || data.text || "";
                    const richRuns   = parseHtmlToRuns(htmlSource, data);

                    sld.addText(richRuns, {
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                        fontFace: data.fontFamily,
                        align:    data.textAlign  || "left",
                        valign:   "top",
                        wrap:     true,
                    });
                }

                // ── BUTTON ───────────────────────────────────────────────────
                if (data.type === "button") {
                    const shapeOptions: Record<string, unknown> = {
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                    };

                    if (data.gradientFrom && data.gradientTo) {
                        shapeOptions.fill = {
                            type: "gradient",
                            stops: [
                                { pos: 0,   color: data.gradientFrom.replace("#", "") },
                                { pos: 100, color: data.gradientTo.replace("#", "")   },
                            ],
                        };
                    } else if (data.backgroundColor) {
                        shapeOptions.fill = { color: data.backgroundColor.replace("#", "") };
                    }

                    if (data.borderWidth && data.borderWidth > 0) {
                        shapeOptions.line = {
                            color: data.borderColor?.replace("#", "") || "000000",
                            pt:    data.borderWidth,
                        };
                    } else {
                        shapeOptions.line = { type: "none" };
                    }

                    if (data.borderRadius) {
                        shapeOptions.rectRadius = pxToIn(data.borderRadius);
                    }

                    sld.addShape(pptx.ShapeType.rect, shapeOptions);

                    const textOptions: Record<string, unknown> = {
                        x:       pxToIn(data.x),
                        y:       pxToIn(data.y),
                        w:       pxToIn(data.width),
                        h:       pxToIn(data.height),
                        fontSize: data.fontSize * 0.75,
                        fontFace: data.fontFamily,
                        bold:    data.fontWeight === "bold",
                        color:   data.textColor?.replace("#", "") || "000000",
                        align:   "center",
                        valign:  "middle",
                        wrap:    false,
                    };

                    if (data.link && typeof data.link === "string") {
                        textOptions.hyperlink = { url: data.link };
                    }

                    sld.addText(data.text || "", textOptions);
                }

                // ── INTERACTION ──────────────────────────────────────────────
                // A deck cannot run quizzes or page-flips, but the element was
                // being dropped entirely — so the slide lost the button, its
                // label and its link. Export it as a shape + label + hyperlink.
                if (data.type === "interaction") {
                    const shapeOptions: Record<string, unknown> = {
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                        line: { type: "none" },
                    };
                    if (data.backgroundColor) {
                        shapeOptions.fill = { color: data.backgroundColor.replace("#", "") };
                    }
                    if (data.borderRadius) {
                        shapeOptions.rectRadius = pxToIn(Number(data.borderRadius) || 0);
                    }
                    sld.addShape(pptx.ShapeType.rect, shapeOptions);

                    const label = interactionFlatLabel(data);
                    if (label) {
                        const textOptions: Record<string, unknown> = {
                            x: pxToIn(data.x),
                            y: pxToIn(data.y),
                            w: pxToIn(data.width),
                            h: pxToIn(data.height),
                            fontSize: (data.fontSize || 13) * 0.75,
                            fontFace: data.fontFamily,
                            color: data.textColor?.replace("#", "") || "FFFFFF",
                            align: "center",
                            valign: "middle",
                            wrap: false,
                        };
                        const href = data.url || data.link;
                        if (typeof href === "string" && /^https?:\/\//i.test(href)) {
                            textOptions.hyperlink = { url: href };
                        }
                        sld.addText(label, textOptions);
                    }
                }

                // ── IMAGE ────────────────────────────────────────────────────
                if (data.type === "image" && data.src) {
                    sld.addImage({
                        path: data.src,
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                    });
                }

                // ── SHAPE ────────────────────────────────────────────────────
                if (data.type === "shape") {
                    sld.addShape(pptx.ShapeType.rect, {
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                        fill: { color: data.fill },
                        line: {
                            color: data.stroke || "FFFFFF",
                            width: data.strokeWidth || 0,
                        },
                    });
                }

                // ── SVG ──────────────────────────────────────────────────────
                if (data.type === "svg") {
                    const finalSvg = data.svg.replace(
                        /currentColor/g,
                        data.color || "#000000"
                    );
                    const base64 =
                        "data:image/svg+xml;base64," +
                        Buffer.from(finalSvg).toString("base64");

                    sld.addImage({
                        data: base64,
                        x: pxToIn(data.x),
                        y: pxToIn(data.y),
                        w: pxToIn(data.width),
                        h: pxToIn(data.height),
                    });
                }
            }
        }

        // ── Generate & upload ─────────────────────────────────────────────────
        const result = await pptx.stream();
        let buffer: Buffer;

        if (typeof result === "string") {
            buffer = Buffer.from(result, "base64");
        } else if (Buffer.isBuffer(result)) {
            buffer = result;
        } else if (result instanceof ArrayBuffer) {
            buffer = Buffer.from(new Uint8Array(result));
        } else if (result instanceof Uint8Array) {
            buffer = Buffer.from(result);
        } else if (typeof Blob !== "undefined" && result instanceof Blob) {
            buffer = Buffer.from(new Uint8Array(await result.arrayBuffer()));
        } else {
            buffer = Buffer.from(String(result));
        }

        const fileKey = `Kd_SlideEditor/temp-ppt/${Date.now()}.pptx`;

        await s3.send(
            new PutObjectCommand({
                Bucket:      KD_AWS_S3_BUCKET_NAME,
                Key:         fileKey,
                Body:        buffer,
                ContentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            })
        );

        // Auto-delete after 10 minutes
        setTimeout(async () => {
            try {
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: KD_AWS_S3_BUCKET_NAME,
                        Key:    fileKey,
                    })
                );
            } catch (err) {
                console.error("Auto delete failed:", err);
            }
        }, 10 * 60 * 1000);

        return NextResponse.json({
            url: `https://${KD_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}