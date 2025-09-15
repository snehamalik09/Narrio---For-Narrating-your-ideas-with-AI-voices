import { NextResponse } from "next/server";
import Author from "@/models/Author.model";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB()
  try {
    const topAuthors = await Author.find({}).sort({totalViews:-1});
    console.log("top authors : ", topAuthors);
    return NextResponse.json(topAuthors);
  } catch (error) {
    console.error("Error fetching Authors:", error);
    return NextResponse.json({ error: "Failed to fetch Authors" }, { status: 500 });
  }
}


