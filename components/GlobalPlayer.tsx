'use client';

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/store/store'
import { play, pause } from '@/store/slices/playerSlice';
import { usePathname } from 'next/navigation';

const GlobalPlayer = () => {
    const { title, imgUrl, audioUrl, author, audioDuration, isPlaying } = useSelector((state: RootState) => state.player);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState('');
    const [totalTime, setTotalTime] = useState(0);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [isMute, setIsMute] = useState(false);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying)
                audioRef.current.play();
            else
                audioRef.current.pause();
        }

    }, [isPlaying]);

    useEffect(() => {
        console.log('audio url is : ', audioUrl);

    }, [audioUrl]);

    useEffect(() => {
        if (audioDuration)
            setTotalTime(audioDuration);

    }, [audioDuration]);

    if (!title || !audioUrl)
        return null;

    if (pathname === '/create-podcast')
        return null;

    function handleCurrentTime() {
        if (!audioRef.current)
            return null;

        const time = audioRef.current.currentTime;
        setCurrentSeconds(time);
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formatTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        setCurrentTime(formatTime);
    };

    function handleReverse() {
        if (!audioRef.current)
            return null;

        audioRef.current.currentTime -= 15;
    }

    function handleForward() {
        if (!audioRef.current)
            return null;

        audioRef.current.currentTime += 15;
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!audioRef.current || !progressBarRef.current) return

  const rect = progressBarRef.current.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * totalTime

  audioRef.current.currentTime = newTime
  setCurrentSeconds(newTime)
}


    return (

        <div  className="text-white fixed bottom-0 left-0 bg-black/40 backdrop-blur-md w-full h-[14%] flex flex-col " >
            {/* <div className={'bg-white p-0.5'} style={{ width: `${(currentSeconds / totalTime) * 100}%` }}></div> */}
            <div ref={progressBarRef} className="w-full bg-gray-700 h-1 relative cursor-pointer" onClick={handleSeek}>
                <div
                    className="bg-white h-1"
                    style={{ width: `${(currentSeconds / totalTime) * 100}%` }}
                ></div>

                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
                    style={{ left: `${(currentSeconds / totalTime) * 100}%` }}
                ></div>
            </div>

            <div className=" flex justify-around p-3">
                <div className='flex flex-1 gap-5'>
                    <Image src={imgUrl} alt='thubmnail' width={70} height={50} />
                    <div className='flex flex-col gap-1'>
                        <h2 className='font-bold text-14'>{title}</h2>
                        <p className='text-12'>{author}</p>
                    </div>
                </div>

                <div className='flex flex-1 flex-row gap-2.5 justify-center items-center'>

                    <Image src='/icons/reverse.svg' alt='reverse' width={25} height={25} className='cursor-pointer' onClick={handleReverse} />
                    <p className='text-12'>-15</p>



                    {isPlaying ? (
                        <Image src='/icons/Pause.svg' alt='Pause button' width={45} height={45} className='cursor-pointer' onClick={() => dispatch(pause())} />
                    ) : <Image src='/icons/Play.svg' alt='play button' width={45} height={45} className='cursor-pointer' onClick={() => dispatch(play())} />
                    }

                    <p className='text-12'>+15</p>
                    <Image src='/icons/forward.svg' alt='forward' width={25} height={25} className='cursor-pointer' onClick={handleForward} />
                </div>

                <div className='flex flex-1 flex-row gap-2.5 justify-center items-center'>
                    <p className='text-12'>{currentTime}/{Number(audioDuration).toFixed(2)}</p>
                    {isMute ? <Image src='/icons/unmute.svg' alt='unmute' width={25} height={25} className='cursor-pointer' onClick={() => setIsMute(false)} /> :
                        <Image src='/icons/mute.svg' alt='mute' width={25} height={25} className='cursor-pointer' onClick={() => setIsMute(true)} />
                    }


                    <div className='bg-gray-700 rounded-xl py-1 w-30 cursor-pointer'></div>
                </div>

                <audio ref={audioRef} src={audioUrl} className='hidden' onEnded={() => dispatch(pause())} onTimeUpdate={handleCurrentTime} />
            </div>
        </div>

    )
}

export default GlobalPlayer
