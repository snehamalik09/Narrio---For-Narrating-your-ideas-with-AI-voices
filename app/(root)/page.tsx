'use client';

import PodcastCard from "@/components/PodcastCard";
import { useEffect, useState } from 'react';
import { useGetPodcastsQuery, useCreatePodcastMutation, useDeletePodcastMutation } from "@/store/api/podcastApi";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Edit } from "lucide-react";

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

// similar podcasts
// ask user are you sure before deleting
// author name in PodcastDetailPlayer
// Views
// audiobar and vocie type still there after creating
// when deleting podcast delete attached audio and image
// audio increase decrease functionality
// if podcast is of author then only shoe Edit, delete button