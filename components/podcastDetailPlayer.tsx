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
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from "framer-motion";


const PodcastDetailPlayer = ({ podcastThumbnail, podcastTitle, audioDuration, audioUrl, podcastID, authorID, authorName, authorImgUrl }: {
  podcastThumbnail: string;
  podcastTitle: string;
  audioDuration: number;
  audioUrl: string;
  authorID: string;
  authorName?: string;
  authorImgUrl?: string;
  podcastID: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsRef = useRef<HTMLDivElement>(null);
  const [deletePodcastByID] = useDeletePodcastMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { podcastID: pID, title, imgUrl, audioUrl: audio, isPlaying, author, audioDuration: duration } = useSelector((state: RootState) => state.player)

  const { user } = useUser();
  const isOwner = user?.id == authorID;

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
      author: authorName,
      audioDuration
    }));
  }

  return (
    <div className="flex gap-12 pt-8 justify-center relative">


      <div className="">
        <Image src={podcastThumbnail} alt='podcastThumbnail' width={200} height={200} className='rounded-xl' />
      </div>
      <div className="flex-1 flex flex-col  gap-2 pt-7 ">

        <h1 className='font-bold text-20 text-white'>{podcastTitle}</h1>

        <div className='flex items-center gap-2' >
          {authorImgUrl && <Image src={authorImgUrl} alt="author Image" width={30} height={30} className='rounded-full cursor-pointer' onClick={() => router.push(`/profile/${authorID}`)}  />}

          <p className='text-12 font-normal cursor-pointer' onClick={() => router.push(`/profile/${authorID}`)}>{authorName}</p>
        </div>

        <div
          onClick={() => {
            isPlaying && pID === podcastID ? dispatch(pause()) : handlePlayPodcast();
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white 
             font-semibold flex justify-center items-center gap-2 
             cursor-pointer w-60 py-1 rounded-full 
             shadow-lg hover:shadow-xl 
             transition-all duration-500 ease-in-out 
             hover:scale-105 active:scale-100 absolute bottom-12"
        >
          <Image
            src={isPlaying && pID === podcastID ? '/icons/Pause.svg' : '/icons/Play.svg'}
            alt={isPlaying && pID === podcastID ? 'Pause' : 'Play'}
            width={20}
            height={20}
          />
          <p className="tracking-wide">
            {isPlaying && pID === podcastID ? 'Pause' : 'Play Podcast'}
          </p>
        </div>


      </div>
      {isOwner &&
        <div className="flex flex-col justify-start items-end relative">
          <div ref={threeDotsRef}>
            <Image src='/icons/three-dots.svg' alt='three dots' width={25} height={25} className='cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
          </div>
          {isOpen && (


            <div className='absolute z-50 rounded-xl right-0 top-6 pr-12 pl-3 text-left py-4 bg-black-1 text-14' ref={dropdownRef}>
              <div className='flex justify-start gap-2 pb-2 cursor-pointer'>
                <Image src='/icons/edit.svg' alt='edit' width={20} height={20} />
                <p>Edit</p>
              </div>
              <div className='flex justify-start gap-2 cursor-pointer' onClick={() => setConfirmDelete(true)}>
                <Image src='/icons/delete.svg' alt='delete' width={20} height={20} />
                <p>Delete</p>
              </div>
            </div>
          )}

        </div>
      }
      <AnimatePresence>
        {confirmDelete &&
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500 shadow-2xl'>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -100 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="bg-orange-500 rounded-lg p-6 text-center shadow-lg flex flex-col gap-8 text-16 font-bold">
              <p className='whitespace-nowrap'> Are you sure you want to delete this podcast permanently ? </p>
              <div className='flex justify-between w-full gap-2'>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={handleDeletePodcast} className='bg-orange-700 shadow-xl text-center w-full cursor-pointer text-20 transition-colors duration-300 hover:bg-orange-800 '>
                  <Button className='cursor-pointer'> Yes </Button>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={() => setConfirmDelete(false)} className='bg-orange-700 shadow-xl text-center w-full cursor-pointer text-20 transition-colors duration-300 hover:bg-orange-800 '>
                  <Button className='cursor-pointer' > Cancel </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>

  )
}

export default PodcastDetailPlayer
