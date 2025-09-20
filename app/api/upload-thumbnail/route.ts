import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import stream from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { imgUrl } = await req.json(); 

    // Fetch image from AI server (server-side → no CORS)
    const response = await fetch(imgUrl);
    const buffer = await response.arrayBuffer();

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "podcast_thumbnails" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const readable = new stream.Readable();
      readable._read = () => {};
      readable.push(Buffer.from(buffer));
      readable.push(null);
      readable.pipe(uploadStream);
    });

    return NextResponse.json(result); // secure_url + public_id
  } catch (err: any) {
    console.error("Error uploading thumbnail:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
