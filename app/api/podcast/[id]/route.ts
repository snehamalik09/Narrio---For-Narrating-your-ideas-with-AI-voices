import { NextResponse } from "next/server";
import Podcast from "@/models/Podcast.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await context.params;
    console.log("podcast id server : ", id);

    const podcast = await Podcast.findById(id);
    if (!podcast)
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });

    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Error fetching podcast:", error);
    return NextResponse.json({ error: "Failed to fetch podcast" }, { status: 500 });
  }
}


export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await context.params;  

    const deletedPodcast = await Podcast.findByIdAndDelete(id);
    if (!deletedPodcast)
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });

    return NextResponse.json(deletedPodcast, { status: 200 });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 });
  }
}
