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
    const [voiceType, setVoiceType] = useState<string>('');

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
                                    <FormLabel className="text-16 font-bold text-white">Podcast Title</FormLabel>
                                    <FormControl>
                                        <Input className="input_class bg-black-1 text-gray-400  focus-visible:ring-orange-500" placeholder="My Podcast" {...field} />
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
                                    <FormLabel className="text-16 font-bold text-white">Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} className="input_class bg-black-1 text-gray-400 focus-visible:ring-orange-500" placeholder="Write a short description about the podcast" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-16 font-bold text-white" />
                                </FormItem>
                            )}
                        />

                        <div className="w-full">
                            <Select onValueChange={(value) => setVoiceType(value)}>
                                <SelectTrigger className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                    <SelectValue placeholder="Select AI Voice" />
                                </SelectTrigger>
                                <SelectContent className="border-none bg-black-1 text-16 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" >
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
                        <GenerateThumbnail/>
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