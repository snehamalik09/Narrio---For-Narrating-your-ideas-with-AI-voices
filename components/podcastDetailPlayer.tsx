import Image from 'next/image';
import React from 'react'
import { useState, useEffect, useRef } from 'react';

const PodcastDetailPlayer = ({ podcastThumbnail, podcastTitle, audioDuration, audioUrl }: {
  podcastThumbnail: string;
  podcastTitle: string;
  audioDuration: number;
  audioUrl: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    function handleClickOutside (event:MouseEvent) {
      if(dropdownRef && !dropdownRef.current?.contains(event.target as Node))
          setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () =>  { document.removeEventListener('mousedown', handleClickOutside) };
  }, []);

  return (
    <div className="flex gap-12 pt-8">
      <div className="">
        <Image src={podcastThumbnail} alt='podcastThumbnail' width={200} height={200} className='rounded-xl' />
      </div>
      <div className="flex-1 flex flex-col pt-5">
        <h1 className='font-bold text-16 text-white'>{podcastTitle}</h1>
      </div>
      <div className="flex flex-col justify-start items-end">
        <Image src='/icons/three-dots.svg' alt='three dots' width={25} height={25} className='cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

        {isOpen && (


          <div className='flex flex-col rounded-xl pl-4 pr-10 py-4 gap-4 bg-black-1 !mt-2' ref={dropdownRef}>
            <div className='flex justify-start gap-2 cursor-pointer'>
              <Image src='/icons/edit.svg' alt='edit' width={25} height={25} />
              <p>Edit</p>
            </div>
            <div className='flex justify-start gap-2 cursor-pointer'>
              <Image src='/icons/delete.svg' alt='delete' width={25} height={25} />
              <p>Delete</p>
            </div>
          </div>
        )}

      </div>
    </div>

  )
}

export default PodcastDetailPlayer
