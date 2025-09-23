'use client';

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/store/store'
import { play, pause, stop, setTime, toggleExpand } from '@/store/slices/playerSlice';
import { usePathname } from 'next/navigation';
import { useUpdateViewsMutation } from '@/store/api/podcastApi';
import { GoScreenFull } from "react-icons/go";
import FullScreenPlayer from './FullScreenPlayer';


const GlobalPlayer = () => {
    const { title, imgUrl, audioUrl, author, audioDuration, isPlaying, podcastID, currentTime } = useSelector((state: RootState) => state.player);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playedTime = useRef(0);
    const lastTime = useRef(0);
    const [hasCounted, setHasCounted] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [duration, setDuration] = useState('');
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [isMute, setIsMute] = useState(false);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const [volume, setVolume] = useState(1);
    const [updateViews] = useUpdateViewsMutation();


    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = currentTime ?? 0;

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioUrl]);

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

    useEffect(() => {
        if (pathname === '/create-podcast' && isPlaying) {
            dispatch(pause());
        }
    }, [pathname, isPlaying]);

    if (pathname === '/create-podcast') return null;


    if (!title || !audioUrl)
        return null;


    function handleCurrentTime() {
        if (!audioRef.current)
            return null;

        dispatch(setTime(audioRef.current.currentTime));

        const time = audioRef.current.currentTime;
        setCurrentSeconds(time);
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formatTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        setDuration(formatTime);
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
        const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);

        audioRef.current.volume = percentage;
        setVolume(percentage);
    };

    function handleEnded (){
        updateViews({id:podcastID});
    }

    const isExpanded=true;


    return (
        <>
        {isExpanded &&  <FullScreenPlayer/>}
        <div className="fixed bottom-[60px] md:bottom-0 left-0 w-full z-[1000] text-white bg-black/70 backdrop-blur-md flex flex-col md:h-[14vh] h-[8vh]">
            
            <div ref={progressBarRef} className="w-full bg-gray-700 h-1 relative cursor-pointer" onClick={handleSeek}>
                <div
                    className="bg-white h-1"
                    style={{ width: `${(currentSeconds / totalTime) * 100}%` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
                    style={{ left: `${(currentSeconds / totalTime) * 100}%` }}
                />
            </div>

            <div className="flex flex-row justify-between items-center p-2 md:p-3 gap-2 md:gap-4 cursor-pointer"  >
                <div className='flex items-center gap-2 md:gap-3 w-1/3' onClick={() => dispatch(toggleExpand())}>
                    <Image
                        src={imgUrl}
                        alt='thumbnail'
                        width={50}
                        height={50}
                        className="rounded-sm w-[40px] h-[40px] md:w-[70px] md:h-[70px] object-cover"
                    />
                    <div className='truncate'>
                        <h2 className='font-bold text-xs md:text-base lg:text-lg truncate'>{title}</h2>
                        <p className='text-[10px] md:text-sm lg:text-base truncate'>{author}</p>
                    </div>
                </div>


                <div className='flex items-center gap-2 md:gap-4 w-1/3 justify-center'>
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => audioRef.current && (audioRef.current.currentTime -= 15)}>
                        <Image src="/icons/reverse.svg" alt="reverse" width={18} height={18} />
                        <p className="text-[8px] md:text-[10px]">-15</p>
                    </div>

                    {isPlaying ? (
                        <Image src='/icons/Pause.svg' alt='Pause' width={40} height={40} className='cursor-pointer w-[30px] h-[30px] md:w-[40px] md:h-[40px]' onClick={() => dispatch(pause())} />
                    ) : (
                        <Image src='/icons/Play.svg' alt='Play' width={40} height={40} className='cursor-pointer w-[30px] h-[30px] md:w-[40px] md:h-[40px]' onClick={() => dispatch(play())} />
                    )}

                    <div className="flex flex-col items-center cursor-pointer" onClick={() => audioRef.current && (audioRef.current.currentTime += 15)}>
                        <Image src="/icons/forward.svg" alt="forward" width={18} height={18} />
                        <p className="text-[8px] md:text-[10px]">+15</p>
                    </div>
                </div>


                <div className='hidden md:flex items-center gap-2 md:gap-4 w-1/3 justify-end'>
                    <p className='text-xs md:text-sm'>{duration}/{Number(audioDuration).toFixed(2)}</p>
                    {isMute ? (
                        <Image src='/icons/unmute.svg' alt='unmute' width={20} height={20} className='cursor-pointer' onClick={() => setIsMute(false)} />
                    ) : (
                        <Image src='/icons/mute.svg' alt='mute' width={20} height={20} className='cursor-pointer' onClick={() => setIsMute(true)} />
                    )}

                    <div ref={volumeBarRef} className='hidden sm:block bg-gray-700 h-1 w-20 cursor-pointer rounded-lg' onClick={handleVolume}>
                        <div className='bg-white h-1 w-full rounded-lg' style={{ width: `${volume * 100}%` }}></div>
                    </div>
                </div>
                <div className='cursor-pointer' onClick={() => dispatch(toggleExpand())} >
                    <GoScreenFull size={24} /> 
                </div>
            </div>

            <audio ref={audioRef} src={audioUrl} className='hidden' onEnded={handleEnded} onTimeUpdate={handleCurrentTime} />
        </div>
        </>
    )
}



export default GlobalPlayer
