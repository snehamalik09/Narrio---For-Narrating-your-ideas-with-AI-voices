import { NextResponse } from "next/server";
import Podcast from "@/models/Podcast.model";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB()
  try {
    const podcasts = await Podcast.find({});
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
  }
}


export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const newPodcast = await Podcast.create(body); 
        return NextResponse.json(newPodcast, { status: 201 });
    } catch (error) {
        console.error("Error creating podcast:", error);
        return NextResponse.json({ error: "Failed to create podcast" }, { status: 400 });
    }
}


