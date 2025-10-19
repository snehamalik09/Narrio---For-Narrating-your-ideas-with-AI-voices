import { NextResponse } from "next/server";
import Author from "@/models/Author.model";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const authorDetails = await Author.findOne({ clerkID: params.id, role:"author" });
    if (!authorDetails) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({authorDetails });
  } catch (error) {
    console.error("Error fetching Author:", error);
    return NextResponse.json({ error: "Failed to fetch Author Details" }, { status: 500 });
  }
}
