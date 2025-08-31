// 8a91427d-20fb-42ea-83ee-478858ab49c6
// app/api/sign/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paramsToSign } = body;

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json({ error: "Missing Cloudinary API secret" }, { status: 500 });
    }

    const stringToSign = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
    console.log("String to sign:", stringToSign);
    console.log("String to sign:", signature);

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
