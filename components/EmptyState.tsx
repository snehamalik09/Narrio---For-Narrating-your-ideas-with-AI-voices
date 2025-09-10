import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const EmptyState = ({ title, search, buttonLink }: { title: string; buttonLink: string; search: string; }) => {
  return (
    <section className='flex-center flex-col size-full gap-3'>
      <Image src='/icons/emptyState.svg' alt='empty State' width={250} height={250} />
      <div className='flex-center flex-col max-w-[254px] gap-3'>
        <h1 className='text-16 f flex font-normal text-center text-white'>{title}</h1>
        {search === 'yes' && <p className='text-16 font-normal text-center text-white'>Try adjusting your search to find what you're looking for</p>}

        {buttonLink == '/' ? (
          <Button className='bg-orange-500'>


            <Link href={buttonLink} className='gap-1 flex'>
              <Image src='/icons/home.svg' alt='home' width={20} height={20} />
              <h1 className='text-16 font-extrabold text-white'>Go to home</h1>
            </Link> </Button>
        ) : (
          <Button className='bg-orange-500'>


            <Link href={buttonLink} className='gap-1 flex'>
              <Image src='/icons/discover.svg' alt='discover' width={20} height={20} />
              <h1 className='text-16 font-extrabold text-white'>Discover</h1>
            </Link> </Button>
        )}

      </div>
    </section>
  )
}

export default EmptyState
