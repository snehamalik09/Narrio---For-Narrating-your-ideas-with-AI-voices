'use client';

import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { voiceDetails } from "@/constants";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Label } from "@radix-ui/react-label";

const formSchema = z.object({
    podcastTitle: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    podcastDescription: z.string().min(5, {
        message: "Description must be at least 5 characters.",
    }),
})

const CreatePodcast = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    
    const [voicePrompt, setVoicePrompt] = useState<string>("");
    const [voiceType, setVoiceType] = useState<string>('Achernar');

    const [audioUrl, setAudioUrl] = useState('');
    const [audioStorageID, setAudioStorageID] = useState("");
    const [audioDuration, setAudioDuration] = useState<number | null>(null);
    const [imgUrl, setImgUrl] = useState("");
    const [imgStorageID, setImgStorageID] = useState("");
    const [imgPrompt, setImgPrompt] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);


    return (
        <section className="flex flex-col w-full h-min-screen">
            <h1 className="text-20 font-bold"> Create Podcasts </h1>
            <Form {...form}>
                <form className="flex flex-col w-full pt-10" onSubmit={form.handleSubmit(onSubmit)} >
                    <div className="flex flex-col gap-[30px] border-b border-gray-700 pb-10">
                        <FormField
                            control={form.control}
                            name="podcastTitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2.5">
                                    {/* <FormLabel className="text-16 font-bold text-white">Podcast Title</FormLabel> */}
                                    <Label htmlFor={field.name} className='text-16 font-bold text-white'> Podcast Title</Label>
                                    
                                    <FormControl>
                                        <Input className="input_class bg-black-1 text-gray-400  focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]  transition duration-200 ease-in-out
" placeholder="My Podcast" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-16 font-bold text-white" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="podcastDescription"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2.5">
                                    {/* <FormLabel className="text-16 font-bold text-white">Description</FormLabel> */}
                                    <Label htmlFor={field.name} className='text-16 font-bold text-white'> Description</Label>
                                    <FormControl>
                                        <Textarea rows={5} className="input_class bg-black-1 text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]" placeholder="Write a short description about the podcast" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-16 font-bold text-white" />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex flex-col gap-2.5">
                            <Label htmlFor="voice-type" className='text-16 font-bold text-white'> Category</Label>
                            {/* <Select onValueChange={(value) => setVoiceType(value)}> */}
                                <Select>
                                <SelectTrigger id="voice-type" className="w-full bg-black-1 border-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c] ">
                                    <SelectValue placeholder="Select AI Voice" className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]"/>
                                </SelectTrigger>
                                <SelectContent className="border-none bg-black-1 text-16 font-bold text-white " >
                                    {voiceDetails.map(({id, name}) => {
                                        return (
                                            <SelectItem className="text-16 text-white hover:bg-orange-500 cursor-pointer capitalize" value={name} key={id}>{name}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                                {voiceType && ( <audio src={`/${voiceType}.wav`} className='hidden' autoPlay /> )}
                            </Select>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col">
                        <GeneratePodcast 
                            voiceType={voiceType} 
                            voicePrompt={voicePrompt} 
                            setVoicePrompt={setVoicePrompt}
                            audio = {audioUrl}
                            setAudio = {setAudioUrl}
                            setAudioStorageID = {setAudioStorageID}
                            setAudioDuration = {setAudioDuration}
                        />
                        <GenerateThumbnail 
                            imgPrompt={imgPrompt} 
                            setImgPrompt={setImgPrompt}
                            imgUrl = {imgUrl}
                            setImgUrl = {setImgUrl}
                            setImgStorageID = {setImgStorageID}
                        />
                    </div>

                    <div className="pt-10">
                        <Button disabled={isSubmitting} type="submit" className={`w-full cursor-pointer bg-orange-500 text-16 font-bold transition-all duration-500 hover:bg-black-1 `}> {isSubmitting? (<> Submitting <Loader size={20} className="animate-spin" />  </>) : 'Submit & Publish Podcast'}</Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}


export default CreatePodcast;