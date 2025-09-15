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

// ask user are you sure before deleting
// Views an dpodcast count
// when deleting podcast delete attached audio and image
// change the auth-log0
// protecting every route
// edit fucntionality
// generate thumbnail cracked
// author details page
// profile page
// playing audio even after the podcast submitted for a few seconds until everything gets cleared

