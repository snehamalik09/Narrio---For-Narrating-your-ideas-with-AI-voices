import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@radix-ui/react-label'
import { IGenerateImageProps } from '@/types'
import { toast } from "sonner"
import { Input } from './ui/input'
import Image from 'next/image'
import { useGenerateThumbnailMutation } from '@/store/api/podcastApi'



const GenerateThumbnail: React.FC<IGenerateImageProps> = ({ imgPrompt, setImgPrompt, setImgFile, imgUrl, setImgUrl, setImgStorageID }) => {
  const [AIGenerated, setAIGenerated] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createThumbnailMutation] = useGenerateThumbnailMutation();

  async function handleFile(e: any) {
    const file = e.target.files[0];
    setImgFile(file);
    setImgUrl(URL.createObjectURL(file));
  }


  async function handleGeneration() {

    if (!imgPrompt) {
      toast.error("Please add prompt to generate the thumbnail.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createThumbnailMutation({ imgPrompt }).unwrap();
      console.log("Thumbnail created : ", res);
      const img = res?.result?.data?.results[0]?.thumb;
      if (img) {
        setImgUrl(img);
        toast.success("Thumbnail created");        
      }
    }
    catch (err) {
      console.log("Error generating thumbnail", err);
      toast.error("Error generating thumbnail");
    }
    finally {
      setIsSubmitting(false);
    }
  }


  return (
    <>
      <div className='!mt-[30px] bg-black-1  flex flex-col justify-between  gap-2.5 w-full max-w-[520px] rounded-lg border px-2.5 py-2 md:flex-row md:gap-0 border-[#15171c]'>
        <div className={` rounded-xl transition-all duration-500  ${AIGenerated ? 'bg-[#222429]' : ''}`}>
          <Button type="button" onClick={() => setAIGenerated(true)} className={`text-16 font-bold text-white cursor-pointer w-full`}> Use AI to generate Thumbnail</Button>
        </div>
        <div className={`rounded-xl transition-all duration-500 ${!AIGenerated ? 'bg-[#222429]' : ''}`}>
          <Button type="button" onClick={() => setAIGenerated(false)} className={`text-16 font-bold text-white cursor-pointer w-full`}> Use Custom Image</Button>
        </div>
      </div>

      {AIGenerated ? (
        <div className='flex flex-col gap-2.5 pt-5'>
          <Label className='text-16 font-bold text-white'> AI prompt to generate Thumbnail</Label>
          <Textarea rows={5} value={imgPrompt} onChange={(e) => setImgPrompt(e.target.value)} className="input_class bg-black-1 text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]" placeholder="Provide prompt to AI to generate thumbnail" />

          <div className="pt-5">
            <Button type="button" onClick={handleGeneration} disabled={isSubmitting} className={`p-5 cursor-pointer bg-orange-500 text-16 font-semibold border-2 transition-all duration-500 border-orange-500 hover:border-white `}> {isSubmitting ? (<> Generating <Loader size={20} className="animate-spin" />  </>) : 'Generate Thumbnail'}</Button>
          </div>
        </div>
      ) : (
        <>
          <div className='image_div' onClick={() => fileInputRef?.current?.click()}>
            <Input ref={fileInputRef} type="file" className='hidden' accept="image/*" onChange={handleFile} />
            <Image alt='upload-image' src='/icons/upload-image.svg' width={30} height={30} />
            <p className='font-bold text-white text-14'> <span className='text-orange-500'>Click to Upload</span> or drag and drop </p>
          </div>
        </>
      )}

      {imgUrl && (
        <Image
          width={150} height={150}
          src={imgUrl}
          alt="AI Generated Thumbnail"
          className="!mt-[20px] rounded-lg border border-gray-700 text-center justify-center"
        />
      )}
    </>
  )
}

export default GenerateThumbnail



  //OPEN ROUTER - GEMINI API
  // async function handleGeneration() {

  //   if (!imgPrompt) {
  //     toast.error("Please add prompt to generate the thumbnail.");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   try {
  //     const res = await createThumbnailMutation({ imgPrompt }).unwrap();
  //     const imageBase64 = res?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  //     console.log('response is : ', imageBase64);
  //     if (imageBase64) {
  //       setImgFile(null);
  //       setImgUrl(imageBase64);
  //       toast.success("Thumbnail created");
  //     }
  //   }
  //   catch (err) {
  //     console.log("Error generating thumbnail", err);
  //     toast.error("Error generating thumbnail");
  //   }
  //   finally {
  //     setIsSubmitting(false);
  //   }
  // }

  //RAPID API