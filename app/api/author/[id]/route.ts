import { NextResponse } from "next/server";
import Author from "@/models/Author.model";
import Podcast from "@/models/Podcast.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const authorDetails = await Author.findOne({ clerkID: params.id, role:"author"});
    if (!authorDetails) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const podcastIds = authorDetails.podcasts || [];

    const totalPodcasts = await Promise.all(
      podcastIds.map((id) => Podcast.findById(id))
    );

    return NextResponse.json({totalPodcasts });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
  }
}
