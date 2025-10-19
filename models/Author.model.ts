import mongoose, { Schema, Document, Model } from "mongoose";
import { IAuthor } from "@/types";

export enum UserRole {
  LISTENER = "listener",
  AUTHOR = "author",
}

const AuthorSchema: Schema = new Schema({
  clerkID: { type: String, required: true, unique: true }, 
  username: { type: String, required: true },
  email: { type: String, required: true },
  imgUrl: { type: String },
  totalViews: { type: Number, default: 0 },   
  podcastCount: { type: Number, default: 0 },
  podcasts:[
    { type: Schema.Types.ObjectId, ref: "Podcast"}
  ],
  role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.LISTENER,
    },
}, { timestamps: true });

const Author: Model<IAuthor> = mongoose.models.Author || mongoose.model("Author", AuthorSchema);

export default Author;
