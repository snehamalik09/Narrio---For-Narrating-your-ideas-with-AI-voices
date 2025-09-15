'use client';

import React, { useCallback } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from 'next/navigation'
import { IAuthor } from "@/types";
import LoaderSpinner from './LoaderSpinner';
import CarouselCard from './CarouselCard';

interface CarouselProps {
  fansLikeDetails: IAuthor[];
}

const EmblaCarousel = ({ fansLikeDetails }: CarouselProps) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay || !("stopOnInteraction" in autoplay.options)) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? (autoplay.reset as () => void)
        : (autoplay.stop as () => void)

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  const slides = fansLikeDetails && fansLikeDetails?.filter((item) => item.podcastCount > 0);

  if (!slides) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.slice(0, 5).map((item, index) => (
            <CarouselCard item={item} index={index} key={index} />
          ))}
      </div>

        <div className="flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index==selectedIndex}
            />
          ))}
        </div>
     </section>
  )
}

export default EmblaCarousel
