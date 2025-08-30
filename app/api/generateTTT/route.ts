import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveImage } from "@/lib/server-utils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const MODEL_ID = "gemini-2.0-flash-exp";

export async function POST(req: NextRequest) {
  try {
    const { prompt, options } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: { code: "MISSING_PROMPT", message: "Prompt is required" } }, { status: 400 });
    }

    // Generate content
    const result = await genAI.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"]
      }
    });

    const candidate = result?.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];

    let imageData: string | null = null;
    let textResponse: string | null = null;
    let mimeType = "image/png";

    for (const part of parts) {
      if (part?.inlineData?.data) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType ?? "image/png";
      } else if (part?.text) {
        textResponse = part.text;
      }
    }

    if (!imageData) {
      return NextResponse.json({ success: false, error: { code: "NO_IMAGE_GENERATED", message: "No image was generated" } }, { status: 500 });
    }

    const metadata = await saveImage(imageData, prompt, mimeType, options);

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: metadata.url,
        description: textResponse,
        metadata
      }
    });

  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "GENERATION_FAILED",
        message: "Failed to generate image",
        details: error.message ?? String(error)
      }
    }, { status: 500 });
  }
}
