'use client';

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/store/store'
import { play, pause } from '@/store/slices/playerSlice';
import { usePathname } from 'next/navigation';
import { useUpdateViewsMutation } from '@/store/api/podcastApi';

const GlobalPlayer = () => {
    const { title, imgUrl, audioUrl, author, audioDuration, isPlaying, podcastID } = useSelector((state: RootState) => state.player);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playedTime = useRef(0);
    const lastTime = useRef(0);
    const [hasCounted, setHasCounted] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [totalTime, setTotalTime] = useState(0);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [isMute, setIsMute] = useState(false);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const [volume, setVolume] = useState(1);
    const [updateViews] = useUpdateViewsMutation();

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying)
                audioRef.current.play();
            else
                audioRef.current.pause();
        }

    }, [isPlaying]);

    useEffect(() => {
        if (podcastID && audioRef.current && isPlaying) {
            // audioRef.current.load(  );
            audioRef.current.play();
        }
    }, [podcastID]);

    //Count views
    // useEffect(() => {
    //     const audio = audioRef.current;
    //     if (!audio || !podcastID) return;

    //     function handleTimeUpdate() {
    //         if ( audio && !audio.seeking && !audio.paused) {
    //             const current = Math.floor(audio.currentTime);

    //             if (current > lastTime.current) {
    //                 playedTime.current += current - lastTime.current;
    //                 lastTime.current = current;
    //             }

    //             if (playedTime.current >= 10 && !hasCounted) {
    //                 updateViews({ id: podcastID });
    //                 setHasCounted(true);
    //             }
    //         }
    //     }

    //     audio.addEventListener("timeupdate", handleTimeUpdate);

    //     return () => {
    //         audio.removeEventListener("timeupdate", handleTimeUpdate);
    //         lastTime.current = 0;
    //         playedTime.current = 0;
    //         setHasCounted(false);
    //     };
    // }, [podcastID]);

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



    const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !volumeBarRef.current) return;

        const rect = volumeBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.min(Math.max(clickX / rect.width, 0), 1); // clamp 0-1

        audioRef.current.volume = percentage;
        setVolume(percentage);
    };



    return (

        <div className="text-white fixed bottom-0 left-0 bg-black/40 backdrop-blur-md w-full h-auto flex flex-col z-50">
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

            <div className=" flex md:flex-row justify-between items-center gap-4 p-3">
                <div className='flex items-center gap-3 w-full md:w-1/3'>
                    <Image src={imgUrl} alt='thubmnail' width={70} height={50} />
                    <div className='font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-[200px]'>
                        <h2 className='font-bold text-14'>{title}</h2>
                        <p className='text-12'>{author}</p>
                    </div>
                </div>

                <div className='flex items-center gap-3 md:gap-5 w-full md:w-1/3 justify-center'>

                    <div className="flex flex-col items-center cursor-pointer" onClick={handleReverse}>
                        <Image src="/icons/reverse.svg" alt="reverse" width={22} height={22} />
                        <p className="text-[10px] md:text-xs">-15</p>
                    </div>



                    {isPlaying ? (
                        <Image src='/icons/Pause.svg' alt='Pause button' width={45} height={45} className='cursor-pointer' onClick={() => dispatch(pause())} />
                    ) : <Image src='/icons/Play.svg' alt='play button' width={45} height={45} className='cursor-pointer' onClick={() => dispatch(play())} />
                    }

                    <div className="flex flex-col items-center cursor-pointer" onClick={handleForward}>
                        <Image src="/icons/forward.svg" alt="forward" width={22} height={22} />
                        <p className="text-[10px] md:text-xs">+15</p>
                    </div>
                </div>

                <div className='hidden md:flex items-center gap-3 w-full md:w-1/3 justify-end md:justify-center'>
                    <p className='text-xs md:text-sm'>{currentTime}/{Number(audioDuration).toFixed(2)}</p>
                    {isMute ? <Image src='/icons/unmute.svg' alt='unmute' width={25} height={25} className='cursor-pointer' onClick={() => setIsMute(false)} /> :
                        <Image src='/icons/mute.svg' alt='mute' width={25} height={25} className='cursor-pointer' onClick={() => setIsMute(true)} />
                    }


                    <div ref={volumeBarRef} className='hidden sm:block bg-gray-700 h-1 w-20 cursor-pointer rounded-lg' onClick={handleVolume}>
                        <div className='bg-white h-1 w-full rounded-lg' style={{ width: `${volume * 100}%` }}></div>
                    </div>
                </div>

                <audio ref={audioRef} src={audioUrl} className='hidden' onEnded={() => dispatch(pause())} onTimeUpdate={handleCurrentTime} />
            </div>
        </div>

    )
}

export default GlobalPlayer
