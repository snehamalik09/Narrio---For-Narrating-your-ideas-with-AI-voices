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

    await Author.findOneAndUpdate(
      { clerkId: user.id },
      {
        $set: { role: "author" },
        $inc: { podcastCount: 1 },
        $push: { podcasts: newPodcast._id }
      },
      { new: true }
    );
    return NextResponse.json(newPodcast, { status: 201 });
  } catch (error) {
    console.error("Error creating podcast:", error);
    return NextResponse.json({ error: "Failed to create podcast" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  await connectDB();
  const body = await req.json();
  const { id } = body;

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedPodcast = await Podcast.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } 
    );

    if (!updatedPodcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    const updatedAuthor = await Author.findOneAndUpdate({clerkID:updatedPodcast.authorID}, { $inc : {totalViews:1}}, {new:true});


    return NextResponse.json(updatedPodcast, { status: 200 });
  } catch (error) {
    console.error("Error updating podcast views:", error);
    return NextResponse.json(
      { error: "Failed to update podcast views" },
      { status: 400 }
    );
  }
}



// async function addAuthor(user: any, podcastId: string) {
//   const author = await Author.findOne({ clerkID: user.id });

//   if (author) {
//     await Author.findOneAndUpdate(
//       { clerkID: user.id },
//       {
//         $set: { role: "author" },
//         $inc: { podcastCount: 1 },
//         $push: { podcasts: podcastId },
//       },
//       { new: true }
//     );
//   }  else {
//     await Author.create({
//       clerkID: user.id,
//       username: user.fullName,
//       email: user.primaryEmailAddress?.emailAddress || "",
//       imgUrl: user.imageUrl,
//       podcasts: [podcastId],
//     });
//   }
// }
