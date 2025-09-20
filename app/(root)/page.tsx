'use client';

import PodcastCard from "@/components/PodcastCard";
import { useEffect, useState } from 'react';
import { useGetPodcastsQuery, useCreatePodcastMutation, useDeletePodcastMutation } from "@/store/api/podcastApi";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Edit } from "lucide-react";
import PodcastDetails from "./podcast/[podcastID]/page";
import MobileNav from "@/components/MobileNav";
import Author from "@/models/Author.model";

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
            <div className="flex flex-col gap-9 !mb-32 md:!mb-15 ">
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
// pagination
// when deleting podcast delete attached audio and image
