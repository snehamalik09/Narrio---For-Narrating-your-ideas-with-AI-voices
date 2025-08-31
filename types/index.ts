import mongoose, {Document } from "mongoose";

export interface IPodcast extends Document {
    _id: string;
  podcastTitle: string;
  podcastDescription: string;
  imgUrl: string;
  imgStorageID?: string;
  audioUrl?: string;
  audioStorageID?: string;
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

export interface IUser extends Document {
  email: string;
  username: string;
  imgUrl: string;
  clerkID: string;
}

export interface IGeneratePodcastProps {
  voicePrompt: string;
  setVoicePrompt: React.Dispatch<React.SetStateAction<string>>;
  setAudioStorageID: React.Dispatch<React.SetStateAction<string>>;
  setAudioDuration: React.Dispatch<React.SetStateAction<number|null>>;
  setAudio: React.Dispatch<React.SetStateAction<string>>;
  audio: string;
  voiceType: string; 
  setAudioBase64:React.Dispatch<React.SetStateAction<string>>;
}

export interface IGenerateImageProps {
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
  imgPrompt: string;
  imgUrl: string;
  setImgPrompt: React.Dispatch<React.SetStateAction<string>>;
  setImgStorageID: React.Dispatch<React.SetStateAction<string>>;
}