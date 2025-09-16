'use client';

import React from 'react'
import { useGetTopPodcastersQuery } from "@/store/api/podcastApi";
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const TopPodcasters = () => {
  const { data: podcastData, isLoading, error, refetch } = useGetTopPodcastersQuery();
  const router = useRouter();

  return (
    <>
      <div className='flex flex-col gap-4 !mt-4'>
        {podcastData?.map((data, index) => {
          return (
            <figure
              onClick={() => router.push(`/profile/${data.clerkID}`)}
              key={index}
              className="flex items-center gap-3 w-full cursor-pointer"
            >
              <Image
                alt="thumbnail"
                src={data.imgUrl} 
                width={50}
                height={50}
                className="object-cover shrink-0 w-[50px] h-[50px]"  
              />

              <div className="flex flex-col flex-1 min-w-0"> 
                <h1 className="text-12 font-bold truncate">{data.username}</h1>
                <p className="text-xs font-normal">{data.podcastCount} podcasts</p>
              </div>

              <p className="text-12 font-normal text-gray-300 shrink-0">
                {data.totalViews} Views
              </p>
            </figure>

          )
        })}
      </div>
    </>
  )
}

export default TopPodcasters
