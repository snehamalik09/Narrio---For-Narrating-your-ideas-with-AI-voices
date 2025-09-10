'use client';

import React from 'react'
import { useGetPodcastsQuery } from "@/store/api/podcastApi";
import Image from 'next/image';


const TopPodcasters = () => {
  const { data: podcastData, isLoading, error, refetch } = useGetPodcastsQuery()

  return (
    <>
      <div className='flex flex-col gap-4 !mt-4'>
        {podcastData?.map((data, index) => {
          return (
            <figure key={index} className='flex gap-2 w-full md:gap-4 cursor-pointer justify-around items-start' >
              <Image alt='thumbnail' src={data.imgUrl} width={50} height={50} className='aspect-square' />
              <div className='flex flex-col'>
                <h1 className='text-12 font-bold truncate'>AuthorName</h1>
                <p className='text-12 font-normal'>category</p>
              </div>
                
                <p className='text-12 font-normal text-gray-300'>34 Podcasts</p>
            </figure>
          )
        })}
      </div>
    </>
  )
}

export default TopPodcasters
