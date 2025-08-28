import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPodcast extends Document {
  podcastTitle: string;
  podcastDescription: string;
  imgUrl?: string;
  audioUrl?: string;
  author?: string;
  authorID?: string;
  authorImgUrl?: string;
  voicePrompt?: string;
  imagePrompt?: string;
  voiceType?: string;
  audioDuration?: number;
  views?: number;
  user?: mongoose.Schema.Types.ObjectId;
}

const PodcastSchema: Schema = new Schema(
  {
    podcastTitle: { type: String, required: true },
    podcastDescription: { type: String, required: true },
    imgUrl: { type: String },
    audioUrl: { type: String },
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
