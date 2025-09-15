import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGetPodcastByIdQuery } from '@/store/api/podcastApi'

const CarouselCard = ({item, index} : {item:any, index:number}) => {
    const router = useRouter();
    const {data, isLoading} = useGetPodcastByIdQuery({id:item.podcasts[0].toString()})
   
    return (
        <figure key={index}
            className="carousel_box"
            onClick={() => router.push(`/podcast/${item.podcasts[0]}`)}
        >
            <Image
                src={item.imgUrl}
                alt={item.username}
                fill
                className="size-full absolute border-none rounded-xl"
            />
            <div className='glassmorphism-black relative flex flex-col z-10 rounded-b-xl p-4'>
                <h1 className="text-xs font-semibold ">
                    {item.username}
                </h1>
                <h1 className="text-xs font-semibold  truncate">
                    {data?.podcastTitle}
                </h1> 
            </div>
        </figure>
    )
}

export default CarouselCard
