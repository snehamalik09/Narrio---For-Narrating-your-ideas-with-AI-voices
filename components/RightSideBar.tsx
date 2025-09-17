'use client';

import Link from "next/link";
import Image from "next/image";
import TopPodcasters from "./TopPodcasters";
import { useGetTopPodcastersQuery } from "@/store/api/podcastApi";

import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import EmblaCarousel from "./EmblaCarousel";

const RightSideBar = () => {
    const { data: podcastData, isLoading, error, refetch } = useGetTopPodcastersQuery()

    return (
        <>
            <section className="text-white bg-black-1 min-h-screen">
                <nav className="right_sidebar gap-7">
                    <div className=" flex justify-end">
                        <SignedOut>
                            <SignInButton>
                                <button className='text-14 font-bold bg-orange-500 text-white px-12 py-1 cursor-pointer rounded-lg'>
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>

                    </div>

                    <div className="flex justify-between text-16 gap-2 md:gap-4 font-bold">
                        <p>Fans Also Like</p>
                        <Link href='/discover'>
                            <button className="text-orange-500 font-semibold cursor-pointer active:scale-95">See All</button>
                        </Link>
                    </div>

                    <EmblaCarousel fansLikeDetails={podcastData ?? []} />

                    <div className="flex flex-col text-16 justify-between gap-2 md:gap-4 font-bold">
                        <div className="flex justify-between">
                            <p>Top Podcasters</p>
                            <Link href='/discover'>
                                <button className="text-orange-500 font-semibold cursor-pointer active:scale-95">See All</button>
                            </Link>
                        </div>
                        <TopPodcasters />
                    </div>
                </nav>
            </section>
        </>
    )
}


export default RightSideBar;





{/* <Link href="/profile">
                        <div className="flex gap-2 w-full md:gap-4 font-bold cursor-pointer justify-around items-center cursor-pointer">
                            <Image src="/images/player1.png" alt="user Image" className="rounded-full" width={50} height={50} />
                            <p className="font-bold text-white text-16 ">Marvin James</p>
                            <Image src="/icons/right-arrow.svg" alt="right arrow" className="rounded-full" width={30} height={30} />
                        </div>
                    </Link> */}