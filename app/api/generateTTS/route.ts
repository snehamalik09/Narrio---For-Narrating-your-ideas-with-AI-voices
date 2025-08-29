import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";



export async function POST(req: NextRequest) {
    const ai = new GoogleGenAI({});
  try {
    const body: { voiceType: string; voicePrompt: string } = await req.json();

    if (!body.voiceType || !body.voicePrompt) {
      return NextResponse.json(
        { error: "voiceType and voicePrompt are required" },
        { status: 400 }
      );
    }

    // Call Gemini TTS API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: body.voicePrompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: body.voiceType } },
        },
      },
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!data) {
      return NextResponse.json({ error: "No audio returned" }, { status: 500 });
    }

    return NextResponse.json({ audioBase64: data }, { status: 200 });
  } 
  catch (err) {
    console.error("TTS generation error:", err);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
