import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react';
import { useDeletePodcastMutation } from '@/store/api/podcastApi';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { setPodcast } from '@/store/slices/playerSlice';
import { pause, play } from '@/store/slices/playerSlice';
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from "framer-motion";

const PodcastCard = ({ author, title, description, imgUrl, podcastID, audioDuration, audioUrl }: { author: string, audioDuration: number, audioUrl: string, imgUrl: string, title: string, description: string, podcastID: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [flipped, setFlipped] = useState(false);

  function handleFlip(e: React.MouseEvent) {
    e.stopPropagation();
    setFlipped(!flipped);
  }

  async function handlePlayPodcast() {
    dispatch(setPodcast({
      podcastID,
      title,
      audioUrl,
      imgUrl,
      author,
      audioDuration,
      currentTime:0
    }));
  }
  const { isPlaying, podcastID: pID } = useSelector((state: RootState) => state.player)


  function handleViews() {
    // increase views

    router.push(`/podcast/${podcastID}`, { 'scroll': true });
  }

  return (
    <div
      className='group perspective  w-full max-w-[180px] sm:max-w-[180px] h-[165px] 2xl:w-[190px] 2xl:h-[190px] cursor-pointer'
      onClick={handleViews}
    >
      <div className={` ${flipped?'rotate-y-180' : '' } relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180`}>

        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden" onClick={handleFlip}>
          <Image
            alt="thumbnail"
            src={imgUrl}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black-800 text-white p-4 flex flex-col justify-between rounded-xl">
          <div className='flex flex-col gap-2'>
            <h1 className='text-16 font-bold '>{title}</h1>
            <div className='items-end gap-2 text-sm  hidden md:flex'>
              <Image src='/icons/microphone.svg' alt='microphone' width={15} height={15} />
              <span className='truncate'>{author}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              isPlaying && pID === podcastID ? dispatch(pause()) : handlePlayPodcast();
            }}
            className='mt-4 cursor-pointer active:scale-98 scale-100 bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-full text-white text-12 font-semibold'
          >
            {isPlaying && pID === podcastID ? "Pause" : "Play Podcast"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default PodcastCard
