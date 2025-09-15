import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imgPrompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
        // "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: imgPrompt || "A futuristic cyberpunk city at night with neon lights"
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("generate TTT : ", data);
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
