'use client';

import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { voiceDetails } from "@/constants";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { generateSignature } from "@/lib/generateSignature";
import { base64ToBlob } from "@/lib/base64ToBlob";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import { useUploadThumbnailMutation } from "@/store/api/podcastApi";
import { useCreatePodcastMutation } from "@/store/api/podcastApi";



const formSchema = z.object({
    podcastTitle: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    podcastDescription: z.string().min(5, {
        message: "Description must be at least 5 characters.",
    }),
})

const CreatePodcast = () => {
    const { user, isSignedIn } = useUser();
    const router = useRouter();
    const [uploadThumbnailMutation] = useUploadThumbnailMutation();
    const [publishPodcast] = useCreatePodcastMutation();
    const [voicePrompt, setVoicePrompt] = useState<string>("");
    const [voiceType, setVoiceType] = useState<string | null>(null);

    const [audioUrl, setAudioUrl] = useState<string>('');
    const [audioStorageID, setAudioStorageID] = useState("");
    const [audioDuration, setAudioDuration] = useState<number | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [imgUrl, setImgUrl] = useState("");
    const [imgStorageID, setImgStorageID] = useState("");
    const [imgPrompt, setImgPrompt] = useState("");
    const [imgFile, setImgFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
        },
    })

    const { reset } = form;

    async function uploadThumbnailToCloudinary(image: File | string) {
        let fileToUpload: File | Blob;

        if (typeof image === "string") {
            const result = await uploadThumbnailMutation(image).unwrap();
            return result;
        } else {
            fileToUpload = image;
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = { timestamp, folder: "podcast_thumbnails" };

        return new Promise<any>((resolve, reject) => {
            generateSignature({
                paramsToSign,
                callback: async (signature: string) => {
                    try {
                        const formData = new FormData();
                        formData.append("file", fileToUpload);
                        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
                        formData.append("timestamp", timestamp.toString());
                        formData.append("signature", signature);
                        formData.append("folder", "podcast_thumbnails");

                        const res = await fetch(
                            `https://api.cloudinary.com/v1_1/di2wbqdwj/image/upload`,
                            { method: "POST", body: formData }
                        );

                        const data = await res.json();
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                },
            });
        });
    }



    async function uploadAudioToCloudinary(audioBlob: Blob) {
        return new Promise<any>((resolve, reject) => {
            const timestamp = Math.floor(Date.now() / 1000);
            const paramsToSign = {
                timestamp,
                folder: "podcast_audio",
            };

            generateSignature({
                paramsToSign,
                callback: async (signature: string) => {
                    try {
                        console.log("audio blob is : ", audioBlob);
                        const formData = new FormData();
                        formData.append("file", audioBlob, 'podcast.wav');
                        formData.append("folder", "podcast_audio");
                        formData.append("timestamp", timestamp.toString());
                        formData.append("signature", signature);
                        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);

                        const uploadResponse = await fetch(
                            `https://api.cloudinary.com/v1_1/di2wbqdwj/video/upload`,
                            {
                                method: "POST",
                                body: formData,
                            }
                        );

                        const data = await uploadResponse.json();
                        console.log("Uploaded audio URL:", data);
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                },
            });
        });
    }



    let uploadedImgUrl = imgUrl;
    let uploadedImgStorageID = imgStorageID;
    let uploadedAudioUrl = audioUrl;
    let uploadedAudioStorageID = audioStorageID;




    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isSignedIn) {
            toast.error("You must be signed in to submit a podcast");
            setTimeout(() => {
                router.push("/sign-in");
            }, 2000);
            return;
        }
        console.log(values);
        setIsSubmitting(true);

        try {
            if (!values.podcastTitle || !values.podcastDescription) {
                toast.error("Title/Description are necessary to publish the podcast.")
                return;
            }

            if (!imgUrl) {
                toast.error("Upload the thumbnail Image to publish the podcast.")
                return;
            }

            if (!audioBlob) {
                toast.error("Upload the podcast audio to publish the podcast.")
                return;
            }

            if (audioBlob) {
                console.log("audioBlob is prresnt.")
            }

            if (imgFile || imgUrl) {
                try {
                    const thumbnailUpload = await uploadThumbnailToCloudinary(imgFile || imgUrl);
                    uploadedImgStorageID = thumbnailUpload.asset_id;
                    uploadedImgUrl = thumbnailUpload.secure_url;
                    setImgStorageID(thumbnailUpload.asset_id);
                    setImgUrl(thumbnailUpload.secure_url);
                    console.log("Thumbnail uploaded : ", thumbnailUpload);
                } catch (err) {
                    toast.error("Error publishing the podcast");
                    console.error("Error uploading thumbnail:", err);
                }
            }


            try {
                const audioUpload = await uploadAudioToCloudinary(audioBlob);
                uploadedAudioStorageID = audioUpload.asset_id;
                uploadedAudioUrl = audioUpload.secure_url;
                console.log("Uploaded audio URL:", audioUpload);
                setAudioStorageID(audioUpload.asset_id);
                setAudioUrl(audioUpload.secure_url);
                setAudioDuration(audioUpload.duration);
            }
            catch (err) {
                toast.error("Error publishing the podcast");
                console.error("Error uploading audio:", err);
            }

            const formDetails = {
                podcastTitle: values.podcastTitle,
                podcastDescription: values.podcastDescription,
                imgUrl: uploadedImgUrl,
                imgStorageID: uploadedImgStorageID,
                imgPrompt,
                audioUrl: uploadedAudioUrl,
                audioStorageID: uploadedAudioStorageID,
                voicePrompt,
                voiceType,
                audioDuration
            }

            try {
                const res = await publishPodcast(formDetails).unwrap();
                toast.success('Podcast is Published Successfully');
                console.log("Podcast published Successfully", res);
            }
            catch (err) {
                console.error("Error publishing podcast:", err);
                toast.error("Error publishing the podcast");
            }

        }
        catch (err) {
            console.error("Error publishing podcast:", err);
            toast.error("Error publishing the podcast");
        }
        finally {
            setIsSubmitting(false);
            setImgUrl('');
            setImgFile(null);
            setAudioBlob(null);
            setAudioDuration(null);
            setAudioStorageID('');
            setVoicePrompt('');
            setVoiceType(null);
            setImgPrompt('');
            setImgStorageID('');
            setAudioUrl('');

            uploadedImgUrl = '';
            uploadedImgStorageID = '';
            uploadedAudioUrl = '';
            uploadedAudioStorageID = '';

            reset();
        }

    }

    return (
        <section className="flex flex-col w-full h-min-screen !mb-32 md:!mb-15">
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
                            <Select value={voiceType ?? ''} onValueChange={(value) => setVoiceType(value)}>
                                <SelectTrigger id="voice-type" className="w-full bg-black-1 border-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c] ">
                                    <SelectValue placeholder="Select AI Voice" className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]" />
                                </SelectTrigger>
                                <SelectContent className="border-none bg-black-1 text-16 font-bold text-white " >
                                    {voiceDetails.map(({ id, name }) => {
                                        return (
                                            <SelectItem className="text-16 text-white hover:bg-orange-500 cursor-pointer capitalize" value={name} key={id}>{name}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                                {voiceType && (<audio src={`/${voiceType}.wav`} className='hidden' autoPlay />)}
                            </Select>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col">
                        <GeneratePodcast
                            voiceType={voiceType}
                            voicePrompt={voicePrompt}
                            setVoicePrompt={setVoicePrompt}
                            audio={audioUrl}
                            setAudio={setAudioUrl}
                            setAudioStorageID={setAudioStorageID}
                            setAudioDuration={setAudioDuration}
                            setAudioBlob={setAudioBlob}
                        />
                        <GenerateThumbnail
                            imgPrompt={imgPrompt}
                            setImgPrompt={setImgPrompt}
                            imgUrl={imgUrl}
                            setImgUrl={setImgUrl}
                            setImgStorageID={setImgStorageID}
                            setImgFile={setImgFile}
                        />
                    </div>

                    <div className="pt-10">
                        <Button disabled={isSubmitting} type="submit" className={`w-full cursor-pointer bg-orange-500 text-16 font-bold transition-all duration-500 hover:bg-black-1 `}> {isSubmitting ? (<> Submitting <Loader size={20} className="animate-spin" />  </>) : 'Submit & Publish Podcast'}</Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}


export default CreatePodcast;



// async function uploadThumbnailToCloudinary(base64Image: string | File) {
//         return new Promise<any>((resolve, reject) => {
//             const timestamp = Math.floor(Date.now() / 1000);
//             const paramsToSign = {
//                 timestamp,
//                 folder: "podcast_thumbnails",
//             };

//             // Get signature from your API
//             generateSignature({
//                 paramsToSign,
//                 callback: async (signature: string) => {
//                     try {
//                         console.log("signature is : ", signature);
//                         const formData = new FormData();
//                         formData.append("file", base64Image);
//                         formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
//                         formData.append("timestamp", timestamp.toString());
//                         formData.append("signature", signature);
//                         formData.append("folder", "podcast_thumbnails");

//                         const res = await fetch(
//                             `https://api.cloudinary.com/v1_1/di2wbqdwj/image/upload`,
//                             {
//                                 method: "POST",
//                                 body: formData,
//                             }
//                         );

//                         const data = await res.json();
//                         resolve(data);
//                     } catch (err) {
//                         reject(err);
//                     }
//                 },
//             });
//         });
//     }



