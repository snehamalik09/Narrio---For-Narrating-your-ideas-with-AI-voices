'use client';

import PodcastCard from "@/components/PodcastCard";
import { useEffect, useState } from 'react';
import { useGetPodcastsQuery, useCreatePodcastMutation, useDeletePodcastMutation } from "@/store/api/podcastApi";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Edit } from "lucide-react";
import podcastDetails from "./podcast/[podcastID]/page";

const Home = () => {

    const { data: podcastData, isLoading, error, refetch } = useGetPodcastsQuery();
    useEffect(() => {
        console.log('podcast data is : ', podcastData);
    }, [podcastData])

    if (isLoading) {
        return <LoaderSpinner />
    }

    return (
        <>
            <div className="flex flex-col gap-9">
                <h1 className="text-20 font-bold"> Trending Podcasts </h1>
                <div className='podcast_grid'>
                    {podcastData?.map((data, index) => {
                        return (
                            <PodcastCard key={data._id} title={data.podcastTitle} description={data.podcastDescription} imgUrl={data.imgUrl} podcastID={data._id} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}


export default Home;

// Views an podcast count/profile page
// edit fucntionality
// generate thumbnail cracked
// all authors page
// play podcast placement
// while fetching all podcast , what if there are more than 50 or 100 podcasts add pagination
// when deleting podcast delete attached audio and image
// playing audio even after the podcast submitted for a few seconds until everything gets cleared

