import mongoose, { Schema, Document, Model } from "mongoose";
import { IAuthor } from "@/types";
import Podcast from "./Podcast.model";

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
}, { timestamps: true });

const Author: Model<IAuthor> = mongoose.models.Author || mongoose.model("Author", AuthorSchema);

export default Author;
