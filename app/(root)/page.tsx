'use client';

import PodcastCard from "@/components/PodcastCard";
import { useEffect, useState, useRef } from 'react';
import { useGetPodcastsQuery } from "@/store/api/podcastApi";
import PodcastSkeleton from "@/components/PodcastSkeleton";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from 'next/navigation';


const Home = () => {

    const { data: podcastData, isLoading, error, refetch } = useGetPodcastsQuery();
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    function handleSearch(query: string) {
        router.push(`/discover/?search=${query}`);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            if (search)
                router.push(`/discover/?search=${search}`);
            else if (!search && pathname === '/discover')
                router.push(`/discover`);
            setSearch('');
        }
    }


    return (
        <>
            <div className="flex flex-col gap-9">
                <div className="flex justify-center items-center text-xs lg:text-lg">
                    <div className='input_class gap-2 flex flex-row items-center bg-black-1 py-1 px-2 md:w-1/2 w-[85vw] '  >
                        <Image src='/icons/search.svg' alt='search' width={16} height={16} className='cursor-pointer' onClick={() => handleSearch(search)} />
                        <Input onKeyDown={handleKeyDown} onChange={(e) => { setSearch(e.target.value); }} value={search} type='text' className='input_class focus:outline-none focus:ring-1 focus:ring-[#15171c] rounded-xl  text-xs md:text-lg' placeholder='What do you want to listen?' />
                    </div>
                </div>

                <h1 className="text-20 font-bold"> Trending Podcasts </h1>
                <div className='podcast_grid'>

                    {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <PodcastSkeleton key={index} />
                        ))
                        : podcastData?.map((data) => (
                            <PodcastCard
                                key={data._id}
                                audioUrl={data.audioUrl}
                                audioDuration={data.audioDuration}
                                author={data.author}
                                title={data.podcastTitle}
                                description={data.podcastDescription}
                                imgUrl={data.imgUrl}
                                podcastID={data._id}
                            />
                        ))}
                </div>
            </div>

        </>
    )
}


export default Home;

// Views an podcast count/profile page
// edit fucntionality
// when deleting podcast delete attached audio and image
// s trending podcasts
// add category
