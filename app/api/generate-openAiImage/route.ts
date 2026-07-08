import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt required" }, { status: 400 });
        }

        const image = await openai.images.generate({
            // model: "gpt-image-1",
            model: "dall-e-3",
            prompt,
            size: "1024x1024",
        });

        const imageUrl = image?.data?.[0]?.url;
        if (!imageUrl) {
            return NextResponse.json(
                { error: "No image returned from OpenAI" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: imageUrl,
        });
    } catch (error) {
        console.error("AI Image Error:", error);
        return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }
}

