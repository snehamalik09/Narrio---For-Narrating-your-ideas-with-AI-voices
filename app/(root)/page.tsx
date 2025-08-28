'use client';

import PodcastCard from "@/components/PodcastCard";
import {useEffect, useState} from 'react';


const Home = () => {
    const [podcastData, setPodcastData] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            const res = await fetch('/api/podcast');
            const data = await res.json();
            setPodcastData(data);
        }
        fetchData();
    }, [])

    useEffect(()=>{
        console.log('podcast data is : ', podcastData);
    }, [podcastData])

    useEffect(()=>{
        async function sendData(){
            const body = {
                podcastTitle:'Test', 
                podcastDescription:'test desc', 
                imgUrl:'/images/bg-img.png'
            };
            const req = await fetch('/api/podcast',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(body)
            });
            const res = await req.json();
            console.log("response from api : ", res);
        }
        sendData();
    },[]);

    return (
        <div className="flex flex-col gap-9">
            <h1 className="text-20 font-bold"> Trending Podcasts </h1>
            <div className='podcast_grid'>
            {podcastData?.map((data, index) => {
                return (
                    <PodcastCard key={index} title={data.podcastTitle} description={data.podcastDescription} imgurl = {data.imgUrl} podcastID={data._id} />
                )
            })}
            </div>
        </div>
    )
}


export default Home;