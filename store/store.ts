import { configureStore } from '@reduxjs/toolkit'
import { podcastApi } from './api/podcastApi'

export const store = configureStore({
  reducer: {
    [podcastApi.reducerPath]: podcastApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(podcastApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
