import { configureStore } from '@reduxjs/toolkit'
import { podcastApi } from './api/podcastApi'
import PlayerReducer from './slices/playerSlice'

export const store = configureStore({
  reducer: {
    player:PlayerReducer,
    [podcastApi.reducerPath]: podcastApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(podcastApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
