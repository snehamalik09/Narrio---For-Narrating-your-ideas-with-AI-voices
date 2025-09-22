import Image from 'next/image'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { closePlayer } from '@/store/slices/playerSlice';
import { motion, useAnimation } from "framer-motion";

const FullScreenPlayer = () => {
    const dispatch = useDispatch();
    const controls = useAnimation();
    const { isExpanded, imgUrl, isPlaying } = useSelector((state: RootState) => state.player);

    const startRotation = () => {
        controls.start({
            rotate: [0, 360],
            transition: {
                repeat: Infinity,
                ease: "linear",
                duration: 8,
            },
        });
    };

    useEffect(() => {
        if (isPlaying) {
            startRotation();
        } else {
            controls.stop();
        }
    }, [isPlaying, controls]);

    useEffect(() => {
        if (isPlaying) {
            startRotation();
        }
    }, []);

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

            <motion.div
                animate={controls}
                className="relative w-[50vw] h-[50vw] md:w-[500px] md:h-[500px] z-50"
            >
                <Image
                    src="/images/CD.png"
                    alt="CD base"
                    fill
                    className="rounded-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 z-50 w-[30%] h-[30%] -translate-y-1/2 -translate-x-1/2">
                    <Image src={imgUrl} alt="Thumbnail" fill className="rounded-full" />
                </div>
            </motion.div>

            <div className="fixed top-10 right-0 w-[300px] max-h-[400px] bg-black backdrop-blur-md p-4 rounded-xl text-white overflow-y-auto shadow-lg z-50">
                <h2 className="text-lg font-semibold mb-2">Transcript</h2>
                <div className="text-sm space-y-1">
                    <p><span className="font-bold">Host:</span> Welcome to our podcast...</p>
                    <p><span className="font-bold">Guest:</span> Thank you for having me...</p>
                    <p>...</p>
                    <p>...</p>
                    <p>......</p>
                    <p>.....</p>
                </div>
            </div>


        </div>
    ) : null;
};

export default FullScreenPlayer;
