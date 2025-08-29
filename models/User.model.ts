import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types";

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  imgUrl: { type: String },
  clerkID: { type: String }
}, {timestamps:true});

// This line prevents recompiling the model on hot reload in dev
const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
