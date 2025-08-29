import { NextResponse } from "next/server";
import User from "@/models/User.model";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB()
  try {
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}


export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const newUser = await User.create(body); 
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating new user:", error);
        return NextResponse.json({ error: "Failed to create new user" }, { status: 400 });
    }
}


