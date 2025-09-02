'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useGetPodcastByIdQuery } from '@/store/api/podcastApi'
import LoaderSpinner from '@/components/LoaderSpinner'
import { useGetPodcastsQuery } from '@/store/api/podcastApi'
import EmptyState from '@/components/EmptyState'

const podcastDetails = () => {
    // const {data:similarPodasts, isLoading:similarPodcastLoading} = useGetPodcastsQuery();
    const [similarPodcasts, setSimilarPodcasts] = useState<[]>([]);
    const params = useParams();
    const id = params.podcastID as string;
    console.log("podcast id client : ", id);

    const {data, error, isLoading, refetch} = useGetPodcastByIdQuery({id});
    useEffect(()=>{
        console.log("data fetched : ", data);
    }, [data]);

    return (
        <section className="flex flex-col w-full">
            <header className='mt-9 flex justify-between items-center'>
                <h1 className="text-20 font-bold"> Currently Playing </h1>
                <div className='flex justify-between gap-2'>
                    <Image alt="headphones" src='/icons/headphone.svg' width={24} height={24} />
                    <p className='font-bold tet-16'>views</p>
                </div>
            </header>

            {/* {isLoading || similarPodcastLoading ? <LoaderSpinner/> : ''} */}

            <div className='flex flex-col w-full gap-9'>
                
                <p className='text-16 pb-8 pt-[45px] font-normal max-md:text-center text-white'>{data?.podcastDescription}</p>

                <div className='flex flex-col gap-8 w-full'>
                    <div className='flex flex-col gap-4'>
                    <h1 className='text-18 text-white font-bold'>Transcription</h1>
                    <p className='text-16 font-normal text-white'>{data?.voicePrompt}</p>
                    </div>
                    <div className='flex flex-col gap-4'>
                    <h1 className='text-18 text-white font-bold'>Thumbnail Prompt</h1>
                    <p className='text-16 font-normal text-white'>{data?.imgPrompt}</p>
                    </div>
                </div>
            </div>

            <section className='flex flex-col mt-8 gap-5'>
                 <h1 className='text-20 text-white font-bold'>Similar Podcasts</h1>
                 {similarPodcasts && similarPodcasts.length<=0 ? <EmptyState title='tst' buttonText='/discover' search=false /> : '' }
            </section>
            
           
        </section>
    )
}

export default podcastDetails
