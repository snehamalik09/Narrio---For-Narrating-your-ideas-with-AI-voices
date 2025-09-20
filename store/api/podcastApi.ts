import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IAuthor, IGeneratePodcastProps, IPodcast, AuthorPodcastsResponse, AuthorDetailsResponse } from '@/types';

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

    updateViews: builder.mutation<IPodcast, {id:string}>({
      query: ({id}) => ({
        url: 'podcast',
        method: 'PATCH',
        body:{id},
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

    getPodcastsByAuthorId: builder.query<AuthorPodcastsResponse, { id: string }>({
      query: ({ id }) => `author/${id}`,
    }),

    deletePodcast: builder.mutation<IPodcast, string>({
      query: (id) => ({
        url: `podcast/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Podcast'],
    }),

    uploadThumbnail: builder.mutation<any, string>({
      query: (imgUrl) => ({
        url: "upload-thumbnail",   
        method: "POST",
        body: { imgUrl },
      }),
    }),

    getTopPodcasters: builder.query<IAuthor[], void>({
      query: () => 'top-podcasters',
      // providesTags: ['Author'],
    }), 

    getProfileById: builder.query<AuthorDetailsResponse, {id:String}>({
      query: ({id}) => `profile/${id}`,
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

export const { useGetPodcastsQuery, useUploadThumbnailMutation, useUpdateViewsMutation, useGetProfileByIdQuery, useGetTopPodcastersQuery, useGetPodcastsByAuthorIdQuery, useGetPodcastBySearchQuery, useCreatePodcastMutation, useDeletePodcastMutation, useGetPodcastByIdQuery, useGeneratePodcastMutation, useGenerateThumbnailMutation } = podcastApi
