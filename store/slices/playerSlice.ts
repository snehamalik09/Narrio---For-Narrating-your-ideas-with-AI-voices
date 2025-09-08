import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerState } from "@/types"; 

const initialState: PlayerState = {
  podcastID: "",
  title: "",
  imgUrl: "",
  audioUrl: "",
  isPlaying: false,
  author: "",
  audioDuration: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPodcast: (
      state,
      action: PayloadAction<{
        podcastID: string;
        title: string;
        imgUrl: string;  
        audioUrl: string;
        author?: string;
        audioDuration?: number | null;
      }>
    ) => {
      state.podcastID = action.payload.podcastID;
      state.title = action.payload.title;
      state.imgUrl = action.payload.imgUrl;
      state.audioUrl = action.payload.audioUrl;
      state.author = action.payload.author ?? "";
      state.audioDuration = action.payload.audioDuration ?? null;
      state.isPlaying = true;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    stop: (state) => {
      state.podcastID = "";
      state.title = "";
      state.imgUrl = "";
      state.audioUrl = "";
      state.isPlaying = false;
      state.author = "";
      state.audioDuration = null;
    },
  },
});

export const { setPodcast, play, pause, stop } = playerSlice.actions;
export default playerSlice.reducer;
