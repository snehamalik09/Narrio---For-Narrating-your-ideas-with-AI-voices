'use client';

import React, { useEffect } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation';

// function debounce(func: Function, delay: number) {
//     let timer: NodeJS.Timeout;
//     return function(...args: any[]) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             func(...args);
//         }, delay);
//     };
// }

function debounce(func: Function, delay: number) {
    let timer: NodeJS.Timeout;
    const debounced = function(...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}


const SearchBar = () => {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    function handleSearch(query:string) {
            router.push(`/discover/?search=${query}`);

    }

    const debouncedSearchRef = useRef(debounce(handleSearch, 500));


    return (
        <div className='input_class flex justify-start gap-2 items-center bg-black-1 py-1 px-2 '>
            <Image src='/icons/search.svg' alt='search' width={16} height={16} className='cursor-pointer' onClick={ () => handleSearch(search)} />
            <Input onChange={(e)=> {setSearch(e.target.value); debouncedSearchRef.current(e.target.value); }} value={search} type='text' className='input_class focus:outline-none focus:ring-1 focus:ring-[#15171c] ' placeholder='Type here to search' />
        </div>
    )
}

export default SearchBar


    // function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    //     if (event.key === 'Enter') {
    //         if (search)
    //             router.push(`/discover/?search=${search}`);
    //         else if (!search && pathname === '/discover')
    //             router.push(`/discover`);
    //         setSearch('');
    //     }
    // }
