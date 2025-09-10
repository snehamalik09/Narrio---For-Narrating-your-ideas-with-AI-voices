import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IGeneratePodcastProps, IPodcast } from '@/types';

export const podcastApi = createApi({
  reducerPath: 'podcastApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Podcast'],
  endpoints: (builder) => ({
    getPodcasts: builder.query<IPodcast[], void>({
      query: () => 'podcast',
      providesTags: ['Podcast'],
    }), 
    createPodcast: builder.mutation<IPodcast, Partial<any>>({
      query: (body) => ({
        url: 'podcast',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Podcast'],
    }),
    getPodcastById: builder.query<IPodcast, { id: string }>({
      query: ({ id }) => `podcast/${id}`,
      providesTags: ['Podcast'],
    }),

    getPodcastBySearch: builder.query<IPodcast[], { search: string }>({
      query: ({ search }) => `discover?search=${search}`,
    }),

    deletePodcast: builder.mutation<IPodcast, string>({
      query: (id) => ({
        url: `podcast/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Podcast'],
    }),

    generatePodcast: builder.mutation<
      { audioBase64: string; id?: string },  // response type
      { voiceType: string; voicePrompt: string } // request type
    >({
      query: (body) => ({
        url: 'generateTTS',
        method: 'POST',
        body,
      }),
    }),

    generateThumbnail: builder.mutation<any,  // response type
      {imgPrompt: string } // request type
    >({
      query: ({imgPrompt}) => ({
        url: 'generateTTT',
        method: 'POST',
        body:{imgPrompt},
      }),
    }),

  }),
})

export const { useGetPodcastsQuery, useGetPodcastBySearchQuery, useCreatePodcastMutation, useDeletePodcastMutation, useGetPodcastByIdQuery, useGeneratePodcastMutation, useGenerateThumbnailMutation } = podcastApi
