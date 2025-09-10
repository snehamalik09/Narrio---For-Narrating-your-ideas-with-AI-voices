'use client'

import SearchBar from "@/components/SearchBar";
import { useGetPodcastsQuery } from "@/store/api/podcastApi";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EmptyState from "@/components/EmptyState";
import { useGetPodcastBySearchQuery } from "@/store/api/podcastApi";
import * as React from 'react'
import { useSearchParams } from "next/navigation";



const Discover = () => {
    const searchParams = useSearchParams(); 
    const search = searchParams.get("search") || "";
    console.log("searchParams dicover : ", search);
    const { data: podcastData, isLoading, error, refetch } = useGetPodcastBySearchQuery({search});
    const router = useRouter();

    function handleViews(podcastID: string) {
        router.push(`/podcast/${podcastID}`, { 'scroll': true });
    }

    return (
        <>
            <SearchBar />
            <section className="flex flex-col w-full h-min-screen !mt-8">
                <h1 className="text-20 font-bold !mb-8"> Discover Community Podcasts </h1>

                <div className="w-full h-[0.5] min-h-0.5 bg-white !mb-8"></div>

                {isLoading && <LoaderSpinner/>}

                {podcastData && podcastData.length>0 ? (

                    <div className='podcast_grid'>
                        {podcastData?.map((data, index) => {
                            return (
                                <figure key={index} className='flex flex-col gap-2 cursor-pointer w-[150px]' onClick={() => handleViews(data._id)}>
                                    <Image alt='thumbnail' src={data.imgUrl} width={150} height={150} className='aspect-square rounded-lg object-cover' />
                                    <div className="w-full">
                                        <h1 className='text-14 font-bold truncate'>{data.podcastTitle}</h1>
                                        <h1 className='text-12 truncate'>authorName</h1>
                                    </div>
                                </figure>
                            )
                        })}
                    </div>

                ) : (
                    <EmptyState title="No results found" search='yes' buttonLink="/" />
                )}
            </section>
        </>
    )
}


export default Discover;