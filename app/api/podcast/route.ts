import { NextResponse } from "next/server";
import Podcast from "@/models/Podcast.model";
import Author from "@/models/Author.model";
import { connectDB } from "@/lib/mongodb";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  await connectDB();
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

  const user = await currentUser(); 
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newPodcast = await Podcast.create({
      ...body,
      author: user.fullName || "Anonymous",
      authorID: user.id,
      authorImgUrl: user.imageUrl || "",
    });

    await addAuthor(user, newPodcast._id); 
    return NextResponse.json(newPodcast, { status: 201 });
  } catch (error) {
    console.error("Error creating podcast:", error);
    return NextResponse.json({ error: "Failed to create podcast" }, { status: 400 });
  }
}

async function addAuthor(user: any, podcastId: string) {
  const author = await Author.findOne({ clerkID: user.id });

  if (author) {
    await Author.findOneAndUpdate(
      { clerkID: user.id },
      { $inc: { podcastCount: 1 }, $push: { podcasts: podcastId } },
      { new: true }
    );
  } else {
    await Author.create({
      clerkID: user.id,
      username: user.fullName,
      email: user.primaryEmailAddress?.emailAddress || "",
      imgUrl: user.imageUrl,
      podcasts: [podcastId],
    });
  }
}
