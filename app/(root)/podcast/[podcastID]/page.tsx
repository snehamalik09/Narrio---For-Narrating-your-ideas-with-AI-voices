'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useGetPodcastByIdQuery } from '@/store/api/podcastApi'
import LoaderSpinner from '@/components/LoaderSpinner'
import { useGetPodcastsQuery } from '@/store/api/podcastApi'
import { useGetPodcastsByAuthorIdQuery } from '@/store/api/podcastApi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'

const podcastDetails = () => {
    const params = useParams();
    const id = params.podcastID as string;
    const { data, error, isLoading, refetch } = useGetPodcastByIdQuery({ id });

    const { data: similarPodcasts, isLoading: similarPodcastLoading } = useGetPodcastsByAuthorIdQuery({id:data?.authorID??''});
    console.log('similar podcasts : ', similarPodcasts);
    

    

    if (isLoading || similarPodcastLoading) {
        return <LoaderSpinner />
    }

    return (
        <>

            <section className="flex flex-col w-full">
                <header className='mt-9 flex justify-between items-center'>
                    <h1 className="text-20 font-bold"> Currently Playing </h1>
                    <div className='flex justify-between gap-2'>
                        <Image alt="headphones" src='/icons/headphone.svg' width={24} height={24} />
                        <p className='font-bold tet-16'>{data?.views}</p>
                    </div>
                </header>

                <div className='flex flex-col w-full gap-7'>

                    {data &&
                        <PodcastDetailPlayer podcastID={data._id} podcastThumbnail={data.imgUrl} podcastTitle={data.podcastTitle} audioDuration={data.audioDuration} audioUrl={data.audioUrl} authorID={data.authorID} authorName={data.author} authorImgUrl={data.authorImgUrl}  />
                    }

                    <p className=' text-12 md:text-16 pt-[20px] font-normal max-md:text-left text-white'>{data?.podcastDescription}</p>

                    <div className='flex flex-col gap-8 w-full'>
                        <div className='flex flex-col gap-4'>
                            <h1 className='text-20 text-white font-bold'>Transcription</h1>
                            <p className='text-12 md:text-16 font-normal text-white'>{data?.voicePrompt}</p>
                        </div>
                        {data?.imgPrompt && (
                            <div className='flex flex-col gap-4'>
                                <h1 className='text-14 md:text-16 text-white font-bold'>Thumbnail Prompt</h1>
                                <p className='text-12 md:text-16 font-normal text-white'>{data?.imgPrompt}</p>
                            </div>
                        )}
                    </div>
                </div>

                {<section className='flex flex-col !mt-8 gap-5 !mb-30 md:!mb-20'>
                    <h1 className='text-20 text-white font-bold'>Similar Podcasts</h1>
                    {similarPodcasts && similarPodcasts.totalPodcasts && similarPodcasts.totalPodcasts.length <= 0 ? <EmptyState title='tst' buttonLink='/discover' search='no' /> :
                        (
                            <div className='podcast_grid'>
                                {similarPodcasts?.totalPodcasts?.map((data, index) => {
                                    return (
                                        <PodcastCard key={data._id} title={data.podcastTitle} description={data.podcastDescription} imgUrl={data.imgUrl} podcastID={data._id} />
                                    )
                                })}
                            </div>
                        )
                    }
                </section>}


            </section >
        </>
    )
}

export default podcastDetails
