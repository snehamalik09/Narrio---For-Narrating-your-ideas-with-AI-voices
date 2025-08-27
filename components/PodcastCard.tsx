import Image from 'next/image'
import React from 'react'

const PodcastCard = ( {title, description, imgurl, podcastID} : {imgurl:string, title:string, description:string, podcastID:number}) => {
  return (
    <figure className='flex flex-col gap-2 cursor-pointer'>
      <Image alt='thumbnail' src={imgurl} width={174} height={174} className='aspect-square w-full h-fit rounded-xl 2xl:w-[200px] 2xl:h-[200px]' />
      <div>
        <h1 className='text-16 font-bold truncate'>{title}</h1>
        <h1 className='text-12 truncate'>{description}</h1>
      </div>
    </figure>
  )
}

export default PodcastCard
