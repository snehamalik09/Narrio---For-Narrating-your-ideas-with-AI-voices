import { NextResponse } from "next/server";
import Podcast from "@/models/Podcast.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req:Request, {params}:{params : {id:string}}) {
  await connectDB()
  try {
    console.log("podcast id server : ", params.id);
    const podcast = await Podcast.findById(params.id);
    if(!podcast)
        return NextResponse.json({error:'Podcast not found'}, {status:404});
    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Error fetching podcast:", error);
    return NextResponse.json({ error: "Failed to fetch podcast" }, { status: 500 });
  }
}

export async function DELETE(req: Request, {params} : {params : {id:string}}) {
    await connectDB();

    try {
        const deletedPodcast = await Podcast.findByIdAndDelete(params.id);
        if (!deletedPodcast) 
            return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
        return NextResponse.json(deletedPodcast, { status: 200 });
    } catch (error) {
        console.error("Error deleting podcast:", error);
        return NextResponse.json({ error: "Failed to delete podcast" }, { status: 400 });
    }
}