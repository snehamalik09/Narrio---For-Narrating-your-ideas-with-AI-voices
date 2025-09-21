'use client';

import React from 'react'
import { useGetPodcastsByAuthorIdQuery, useGetProfileByIdQuery } from "@/store/api/podcastApi";
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
import LoaderSpinner from '@/components/LoaderSpinner';
import { Button } from '@/components/ui/button';
import { IPodcast } from '@/types';

const Profile = () => {
    const params = useParams();
    const id = params.clerkID as string;

    const { podcastID: pID, title, imgUrl, audioUrl: audio, isPlaying, author, audioDuration: duration } = useSelector((state: RootState) => state.player)
    const { data: allPocasts, isLoading, error } = useGetPodcastsByAuthorIdQuery({ id });
    const authorImageUrl = allPocasts?.totalPodcasts[0]?.authorImgUrl;
    const authorName = allPocasts?.totalPodcasts[0]?.author;
    const { data: PodcasterDetails, isLoading: podcasterLoading } = useGetProfileByIdQuery({ id });
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [podcasts, setPodcasts] = useState<IPodcast[]>([]);
    const [page, setPage] = useState(2);
    const dispatch = useDispatch();
    const pageLimit = 4;


    useEffect(() => {
        if (allPocasts?.totalPodcasts) {
            const initialBatch = allPocasts.totalPodcasts.slice(0, pageLimit);
            setPodcasts(initialBatch);
            if (allPocasts.totalPodcasts.length <= pageLimit) setHasMore(false);
        }
    }, [allPocasts]);


    if (isLoading || podcasterLoading)
        return <LoaderSpinner />

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
            currentTime:0
        }));
    }

    function fetchPodcasts() {
        if (!allPocasts?.totalPodcasts)
            return;
        setLoading(true);
        const start = (page - 1) * pageLimit;
        const end = pageLimit + start;
        const nextBatch = allPocasts.totalPodcasts.slice(start, end);
        setPodcasts(prev => [...prev, ...nextBatch]);
        if (end >= allPocasts.totalPodcasts.length) {
            setHasMore(false);
        }
        setPage(prev => prev + 1);
        setLoading(false);
    }

    return (
        <>
            <section className="flex flex-col w-full h-min-screen !mt-8">
                <h1 className="text-20 font-bold"> Podcaster Profile </h1>


                <div className=" flex flex-col !mx-auto xl:grid xl:grid-cols-3 gap-12 !mt-8 items-start ">
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
                        <div className="flex gap-1.5 items-center">
                            <Image src={'/icons/Play.svg'} alt="Play" width={24} height={24} />
                            <p className='font-bold'>{PodcasterDetails?.authorDetails?.totalViews}</p>
                            <p>Plays</p>
                        </div>

                        <div className="flex gap-1.5 items-center">
                            <Image src={'/icons/headphone.svg'} alt="headphones" width={24} height={24} />
                            <p className='font-bold'>{PodcasterDetails?.authorDetails?.podcastCount}</p>
                            <p>Total Podcasts</p>
                        </div>
                    </div>


                </div>

                <button
                    onClick={() => {
                        isPlaying && pID === allPocasts?.totalPodcasts[0]._id ? dispatch(pause()) : handlePlayPodcast();
                    }}
                    className="
  bg-gradient-to-r from-purple-500 to-blue-500 text-white 
  font-semibold flex justify-center items-center !mx-auto !my-6 gap-2 
  cursor-pointer px-6 py-2 rounded-full shadow-lg 
  transition-all duration-500 ease-in-out
  hover:scale-102 hover:shadow-2xl 
  hover:bg-gradient-to-l hover:from-purple-600 hover:to-blue-600
  active:scale-95 w-fit
"

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



                <div className="w-full h-[0.5] min-h-0.5 bg-white/40 !mt-3 !mb-6"></div>


                {<section className='flex flex-col gap-5 !mb-20'>
                    <h1 className='text-20 text-white font-bold'>All Podcasts</h1>

                    {allPocasts && allPocasts.totalPodcasts && allPocasts.totalPodcasts.length <= 0 ? <EmptyState title='No podcasts here yet. Explore others while you wait' buttonLink='/discover' search='no' /> :
                        (
                            <div className='podcast_grid'>
                                {podcasts?.map((data, index) => {
                                    return (
                                        <PodcastCard
                                            key={index}
                                            title={data?.podcastTitle || 'No Title'}
                                            description={data?.podcastDescription || 'No description available'}
                                            imgUrl={data?.imgUrl || '/fallback-image.png'}
                                            podcastID={data?._id || ''}
                                            author={data?.author}
                                            audioUrl={data?.audioUrl} audioDuration={data?.audioDuration}
                                        />)
                                })}
                            </div>
                        )
                    }
                    {hasMore &&
                        <div className="flex justify-center mt-10">
                            <Button
                                onClick={fetchPodcasts}
                                disabled={loading}
                                className={`
                                bg-orange/30 text-white font-medium 
                                px-6 py-2 rounded-md 
                                border border-white/20
                                shadow-sm hover:bg-white/10 hover:shadow-md
                                active:scale-95 transition-all duration-150 cursor-pointer
                                ${loading ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                            >
                                {loading ? <span className='animate-pulse'>Loading...</span> : "Load More"}
                            </Button>
                        </div>



                    }

                </section>}


            </section>
        </>
    )
}


export default Profile;

