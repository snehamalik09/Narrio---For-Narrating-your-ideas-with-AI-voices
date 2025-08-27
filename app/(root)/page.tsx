import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";

const Home = () => {
    return (
        <div className="flex flex-col gap-9">
            <h1 className="text-20 font-bold"> Trending Podcasts </h1>
            <div className='podcast_grid'>
            {podcastData.map(({id, title, description, imgURL}) => {
                return (
                    <PodcastCard key={id} title={title} description={description} imgurl = {imgURL} podcastID={id} />
                )
            })}
            </div>
        </div>
    )
}


export default Home;