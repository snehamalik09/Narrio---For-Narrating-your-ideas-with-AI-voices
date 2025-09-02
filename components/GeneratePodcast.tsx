import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { IGeneratePodcastProps } from '@/types'
import { useState } from 'react'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { current } from '@reduxjs/toolkit'
import { useGeneratePodcastMutation } from '@/store/api/podcastApi'
import { toast } from "sonner"

const GeneratePodcast: React.FC<IGeneratePodcastProps> = ({voiceType, voicePrompt, setVoicePrompt, audio, setAudio, setAudioStorageID, setAudioBase64, setAudioDuration}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatePodcastMutation] = useGeneratePodcastMutation();

  function base64ToWavUrl(base64: string) {
  // Decode Base64 to binary
  const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  // Create WAV header
  const numChannels = 1;
  const sampleRate = 24000; // Gemini TTS PCM default
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = buffer.length;

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt subchunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write PCM data
  new Uint8Array(wavBuffer, 44).set(buffer);

  const blob = new Blob([wavBuffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

function handleGeneration() {
  if(!voiceType){
    toast.error("Please select an AI voice first to generate the podcast.");
    return;
  }
  if(!voicePrompt){
    toast.error("Please add prompt to generate the podcast.");
    return;
  }
  setIsSubmitting(true);
  generatePodcastMutation({ voiceType, voicePrompt }).unwrap()
  .then((res) => {
    console.log("url is : ",res.audioBase64);
    setAudioBase64(res.audioBase64);
    const url = base64ToWavUrl(res.audioBase64);
    setAudio(url);
  })
  .finally(() => setIsSubmitting(false));
}

  return (
    <div className='flex flex-col gap-2.5'>
      <Label className='text-16 font-bold text-white'> AI prompt to generate Podcast</Label>
      <Textarea rows={5} value={voicePrompt} onChange={(e) => setVoicePrompt(e.target.value)} className="input_class bg-black-1 text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#15171c]" placeholder="Provide prompt to AI to generate audio"  />

      <div className="pt-5">
        <Button type="button" onClick={handleGeneration} disabled={isSubmitting} className={`p-5 cursor-pointer bg-orange-500 text-16 font-semibold border-2 transition-all duration-500 border-orange-500 hover:border-white `}> {isSubmitting? (<> Generating <Loader size={20} className="animate-spin" />  </>) : 'Generate Podcast'}</Button>
      </div>

      {audio && (<audio key={audio} src={audio} controls autoPlay className='pt-5 w-full' onLoadedMetadata={ (e) => setAudioDuration(e.currentTarget.duration)} />)}
    </div>
  )
}

export default GeneratePodcast
