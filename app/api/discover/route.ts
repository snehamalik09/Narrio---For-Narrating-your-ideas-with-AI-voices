import { NextResponse } from "next/server";
import Podcast from "@/models/Podcast.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const search = url.searchParams.get("search")||"";

  console.log("search route.ts : ", search);

  try {
    if (search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");

      const query = {
        $or: [
          { podcastTitle: searchRegex },
          { podcastDescription: searchRegex },
          { author: searchRegex },
        ],
      };

      const podcasts = await Podcast.find(query);
      console.log("podcasts are : ", podcasts);
      return NextResponse.json(podcasts, { status: 200 });
    } 
    else {
      const podcasts = await Podcast.find({});
      return NextResponse.json(podcasts, { status: 200 });
    }
  } 
  catch (error) {
    console.error("Error fetching podcast by search query:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcast" },
      { status: 500 }
    );
  }
}
