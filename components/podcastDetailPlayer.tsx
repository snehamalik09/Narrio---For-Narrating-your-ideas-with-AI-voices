import Image from 'next/image';
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useDeletePodcastMutation } from '@/store/api/podcastApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { setPodcast } from '@/store/slices/playerSlice';
import { pause, play } from '@/store/slices/playerSlice';

const PodcastDetailPlayer = ({ podcastThumbnail, podcastTitle, audioDuration, audioUrl, isOwner, podcastID }: {
  podcastThumbnail: string;
  podcastTitle: string;
  audioDuration: number;
  audioUrl: string;
  isOwner: boolean;
  podcastID: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsRef = useRef<HTMLDivElement>(null);
  const [deletePodcastByID] = useDeletePodcastMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { podcastID: pID, title, imgUrl, audioUrl: audio, isPlaying, author, audioDuration: duration } = useSelector((state: RootState) => state.player)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef && !dropdownRef.current?.contains(event.target as Node) && threeDotsRef.current && !threeDotsRef.current?.contains(event.target as Node))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => { document.removeEventListener('mousedown', handleClickOutside) };
  }, []);

  useEffect(() => {
    console.log('audio url is : ', audioUrl);

  }, [audioUrl]);

  async function handleDeletePodcast() {
    try {
      const res = await deletePodcastByID(podcastID).unwrap();
      console.log("Successfully deleted the podcast");
      toast.success("Successfully deleted the podcast");
      router.push(`/`, { 'scroll': true });
    }
    catch (err) {
      console.error("Error deleting podcast");
      toast.error("Error occured in deleting the podcast");
    }
    setIsOpen(false);
  }

  async function handlePlayPodcast() {
    dispatch(setPodcast({
      podcastID,
      title: podcastTitle,
      audioUrl,
      imgUrl: podcastThumbnail,
      author: 'authorName',
      audioDuration
    }));
  }

  return (
    <div className="flex gap-12 pt-8">
      <div className="">
        <Image src={podcastThumbnail} alt='podcastThumbnail' width={200} height={200} className='rounded-xl' />
      </div>
      <div className="flex-1 flex flex-col gap-2.5 pt-5">
        <h1 className='font-bold text-18 text-white'>{podcastTitle}</h1>
        <p>AuthorNAme</p>

          {isPlaying && pID == podcastID ?

            <div onClick={() => dispatch(pause())} className='bg-orange-500 text-16 font-bold text-white flex justify-center gap-2 items-center w-[60%] cursor-pointer p-2 rounded-xl'>
              <Image src='/icons/Pause.svg' alt='pause' width={20} height={20} />
              <p> Pause </p>
            </div>
            :

            <div onClick={handlePlayPodcast} className='bg-orange-500 text-16 font-bold text-white flex justify-center gap-2 items-center w-[60%] cursor-pointer p-2 rounded-xl'>
              <Image src='/icons/play-gray.svg' alt='play' width={20} height={20} />
              <p> Play Podcast </p>
            </div>
          }

      </div>
      {isOwner &&
        <div className="flex flex-col justify-start items-end relative">
          <div ref={threeDotsRef}>
          <Image  src='/icons/three-dots.svg' alt='three dots' width={25} height={25} className='cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
</div>
          {isOpen && (


            <div className='absolute z-50 rounded-xl right-0 top-6 pr-12 pl-3 text-left py-4 bg-black-1 text-14' ref={dropdownRef}>
              <div className='flex justify-start gap-2 pb-2 cursor-pointer'>
                <Image src='/icons/edit.svg' alt='edit' width={20} height={20} />
                <p>Edit</p>
              </div>
              <div className='flex justify-start gap-2 cursor-pointer' onClick={handleDeletePodcast}>
                <Image src='/icons/delete.svg' alt='delete' width={20} height={20} />
                <p>Delete</p>
              </div>
            </div>
          )}

        </div>
      }
    </div>

  )
}

export default PodcastDetailPlayer
