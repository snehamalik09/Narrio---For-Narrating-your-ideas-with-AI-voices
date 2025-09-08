import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

const unlink = promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { audioBase64 } = await req.json();

    if (!audioBase64) {
      return NextResponse.json({ error: "No audioBase64 provided" }, { status: 400 });
    }

    // Convert base64 → buffer
    const cleaned = audioBase64.includes(",") ? audioBase64.split(",")[1] : audioBase64;
    const buffer = Buffer.from(cleaned, "base64");

    // Save temp WAV file
    const tempDir = os.tmpdir();
    const tempWav = path.join(tempDir, `input-${Date.now()}.wav`);
    const tempMp3 = path.join(tempDir, `output-${Date.now()}.mp3`);
    fs.writeFileSync(tempWav, buffer);

    // Convert WAV → MP3
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempWav)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(tempMp3);
    });

    // Upload MP3 to Cloudinary
    const result = await cloudinary.uploader.upload(tempMp3, {
      resource_type: "video", // audio must go through video endpoint
      folder: "podcast_audio",
    });

    // Cleanup temp files
    await unlink(tempWav);
    await unlink(tempMp3);

    return NextResponse.json({ url: result.secure_url, assetId: result.asset_id });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
