import Link from "next/link";
import Image from "next/image";

const RightSideBar = () => {
    return (
        <>
            <section className="text-white bg-black-1 min-h-screen">
                <nav className="right_sidebar gap-7">

                    <div className="flex flex-col gap-2 md:gap-4 font-bold cursor-pointer">
                        profile
                    </div>
                    <div className="flex justify-between gap-2 md:gap-4 font-bold">
                        <p>Fans Also Like</p>
                        <button className="text-orange-600 font-semibold cursor-pointer">See All</button>
                    </div>

                    <div className="flex justify-between gap-2 md:gap-4 font-bold">
                        <p>Top Podcasters</p>
                        <button className="text-orange-600 font-semibold cursor-pointer">See All</button>
                    </div>
                </nav>
            </section>
        </>
    )
}


export default RightSideBar;