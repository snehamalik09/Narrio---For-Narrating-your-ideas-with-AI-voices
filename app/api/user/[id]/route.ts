import { NextResponse } from "next/server";
import User from "@/models/User.model";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET({params}:{params : {id:string}}) {
  await connectDB()
  try {
    const user = await User.findOne( {_id: new mongoose.Types.ObjectId(params.id), role:"author"});
    if(!user)
        return NextResponse.json({error:'User not found'}, {status:404});
    return NextResponse.json(User);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}

export async function DELETE(req: Request, {params} : {params : {id:string}}) {
    await connectDB();

    try {
        const deletedUser = await User.findByIdAndDelete(params.id);
        if (!deletedUser) 
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        return NextResponse.json(deletedUser, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 400 });
    }
}