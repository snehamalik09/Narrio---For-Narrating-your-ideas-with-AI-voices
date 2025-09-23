import Image from 'next/image'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { closePlayer } from '@/store/slices/playerSlice';
import { motion, useAnimation } from "framer-motion";
import { useGetPodcastByIdQuery } from '@/store/api/podcastApi';
import { AnimatePresence } from 'framer-motion';

const FullScreenPlayer = () => {
    const dispatch = useDispatch();
    const controls = useAnimation();
    const { isExpanded, imgUrl, isPlaying, podcastID } = useSelector((state: RootState) => state.player);
    const { data, isLoading } = useGetPodcastByIdQuery({ id: podcastID }, { skip: !podcastID });


    return isExpanded ? (
        <div className="fixed inset-0 z-[999] text-white flex flex-col items-center justify-center">
            {/* Blurred Background Layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(10px)",
                }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div
                className="absolute top-10 left-10 text-16 font-bold text-gray-300 cursor-pointer active:scale-95 z-50"
                onClick={() => dispatch(closePlayer())}
            >
                Close
            </div>
            <AnimatePresence>
                <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : {}}
                    className="relative w-[50vw] h-[50vw] md:w-[500px] md:h-[500px] z-50"
                >
                    <Image
                        src="/images/CD.png"
                        alt="CD base"
                        fill
                        className="rounded-full object-cover"
                    />
                    <div className="absolute top-1/2 left-1/2 z-50 w-[20%] h-[20%] -translate-y-1/2 -translate-x-1/2">
                        <Image src={imgUrl} alt="Thumbnail" fill className="rounded-full" />
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className=" hidden md:block fixed top-5 right-5 w-[300px] h-[300px] max-h-[400px] bg-black backdrop-blur-md p-4 rounded-xl text-white overflow-y-auto shadow-lg z-50">
                <h2 className="text-lg font-semibold !mb-4">Transcript</h2>
                <div className="text-sm !space-y-4s overflow-y-auto">
                    <p > {isLoading ? '' : data?.voicePrompt}</p>
                </div>
            </div>


        </div>
    ) : null;
};

export default FullScreenPlayer;
