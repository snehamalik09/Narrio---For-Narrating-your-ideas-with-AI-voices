'use client';

import React from 'react'
import { useGetPodcastsByAuthorIdQuery } from "@/store/api/podcastApi";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { setPodcast } from '@/store/slices/playerSlice';
import { pause, play } from '@/store/slices/playerSlice';
import PodcastCard from '@/components/PodcastCard';
import EmptyState from '@/components/EmptyState';

const Profile = () => {

    const params = useParams();
    const id = params.clerkID as string;

    const dispatch = useDispatch();

    const { data: allPocasts, isLoading, error } = useGetPodcastsByAuthorIdQuery({ id });
    const { podcastID: pID, title, imgUrl, audioUrl: audio, isPlaying, author, audioDuration: duration } = useSelector((state: RootState) => state.player)


    const authorImageUrl = allPocasts?.totalPodcasts[0]?.authorImgUrl;
    const authorName = allPocasts?.totalPodcasts[0]?.author;

    async function handlePlayPodcast() {
        const firstPodcast = allPocasts?.totalPodcasts?.[0];
        if (!firstPodcast) {
            toast.error("No podcast to play");
            console.warn("No podcast data available to play");
            return;
        }
        dispatch(setPodcast({
            podcastID: firstPodcast._id,
            title: firstPodcast.podcastTitle,
            audioUrl: firstPodcast.audioUrl,
            imgUrl: firstPodcast.imgUrl,
            author: firstPodcast.author,
            audioDuration: firstPodcast.audioDuration,
        }));
    }

    return (
        <>
            <section className="flex flex-col w-full h-min-screen !mt-8">
                <h1 className="text-20 font-bold"> Podcaster Profile </h1>
                {/* 
                <div className="flex gap-12 !mt-8 justify-center relative">

                    <div className="flex-1 max-w-[400px]">
                        {authorImageUrl &&
                        <div className='w-[400px] h-[400px] relative'> 
                            <Image src={authorImageUrl} alt='authorImage' width={400} height={400} className='rounded-lg object-cover' />
                            </div>
                        }
                    </div>

                    <div className="flex-1 flex flex-col  gap-2 pt-7 ">

                        <h1 className='font-bold text-32 text-white'>{authorName}</h1>

                        <div className='flex gap-2.5'>

                            <Image src={'/icons/headphone.svg'} alt='headphones' width={30} height={30} />
                            <p>Views</p>
                        </div>

                        <div
                            onClick={() => {
                                isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? dispatch(pause()) : handlePlayPodcast();
                            }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white 
                             font-semibold flex justify-center items-center gap-2 
                             cursor-pointer min-w-[60] w-auto px-4 py-2 rounded-full 
                             shadow-lg hover:shadow-xl 
                             transition-all duration-500 ease-in-out 
                             hover:scale-105 active:scale-100 absolute bottom-12"
                        >
                            <Image
                                src={isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? '/icons/Pause.svg' : '/icons/Play.svg'}
                                alt={isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? 'Pause' : 'Play'}
                                width={20}
                                height={20}
                            />
                            <p className="tracking-wide">
                                {isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? 'Pause' : 'Play Random Podcast'}
                            </p>
                        </div>


                    </div>

                    <div className="flex flex-col justify-start items-end relative">

                    </div>
                </div> */}

                <div className="grid grid-cols-3 gap-12 !mt-8 items-start ">
                    <div className="flex justify-center ">
                        {authorImageUrl && (
                            <div className="w-[300px] h-[300px] relative">
                                <Image
                                    src={authorImageUrl}
                                    alt="authorImage"
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 col-span-2">
                        <h1 className="font-bold text-32 text-white">{authorName}</h1>

                        {/* view */}
                        <div className="flex gap-2.5 items-center">
                            <Image src={'/icons/Play.svg'} alt="Play" width={24} height={24} />
                            <p>Plays</p>  
                        </div>

                        <div className="flex gap-2.5 items-center">
                            <Image src={'/icons/headphone.svg'} alt="headphones" width={24} height={24} />
                            <p>Total Podcasts</p>
                        </div>
                    </div>

                    {/* <div className="flex flex-col justify-start items-end">
                    </div> */}
                </div>

                <button
                            onClick={() => {
                                isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? dispatch(pause()) : handlePlayPodcast();
                            }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white 
    font-semibold flex justify-center items-center !mx-auto !my-6 gap-2 
    cursor-pointer px-6 py-2 rounded-full shadow-lg hover:shadow-xl 
    transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
>
                            <Image
                                src={isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? '/icons/Pause.svg' : '/icons/Play.svg'}
                                alt={isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? 'Pause' : 'Play'}
                                width={20}
                                height={20}
                            />
                            <span>
                                {isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? 'Pause' : 'Play Random Podcast'}
                            </span>
                        </button>



                {/* <div className="w-full h-[0.5] min-h-0.5 bg-white/40 !mt-8 !mb-5"></div> */}


                {<section className='flex flex-col gap-5 !mb-20'>
                    <h1 className='text-20 text-white font-bold'>All Podcasts</h1>
                    {allPocasts && allPocasts.totalPodcasts && allPocasts.totalPodcasts.length <= 0 ? <EmptyState title='tst' buttonLink='/discover' search='no' /> :
                        (
                            <div className='podcast_grid'>
                                {allPocasts?.totalPodcasts?.map((data, index) => {
                                    return (
                                        <PodcastCard key={data._id} title={data.podcastTitle} description={data.podcastDescription} imgUrl={data.imgUrl} podcastID={data._id} />
                                    )
                                })}
                            </div>
                        )
                    }
                </section>}


            </section>
        </>
    )
}


export default Profile;

