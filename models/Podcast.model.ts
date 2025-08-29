import mongoose, { Schema, Document, Model } from "mongoose";
import { IPodcast } from "@/types";

const PodcastSchema: Schema = new Schema(
  {
    podcastTitle: { type: String, required: true },
    podcastDescription: { type: String, required: true },
    imgUrl: { type: String },
    imgStorageID: { type: String },
    audioUrl: { type: String },
    audioStorageID: { type: String },
    author: { type: String },
    authorID: { type: String },
    authorImgUrl: { type: String },
    voicePrompt: { type: String },
    imagePrompt: { type: String },
    voiceType: { type: String },
    audioDuration: { type: Number },
    views: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: "User"},
  },
  { timestamps: true }
);

// Prevent recompiling model on hot reload in dev
const Podcast: Model<IPodcast> =
  mongoose.models.Podcast || mongoose.model("Podcast", PodcastSchema);

export default Podcast;
