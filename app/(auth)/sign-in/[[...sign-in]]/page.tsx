import {SignIn} from '@clerk/nextjs'

import React from 'react'

const Page = () => {
  return (
    <div className='flex-center glassmorphism-auth h-screen w-full'>
      <SignIn />
    </div>
  )
}

export default Page



// import { Input } from '@/components/ui/input';
// import Image from 'next/image';
// import React from 'react';
// import Link from "next/link";

// const Auth = () => {
//     return (
//         <div style={{ backgroundImage: "url('/images/bg-img.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100vw", height: "100vh" }}>
//             <div className='flex justify-center items-center' style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)" }}>
//                 <div className=' bg-black-1 w-[30%] h-[75%] mx-auto rounded-lg flex flex-col p-8 '>

//                     {/* <div className='flex items-center gap-2 !my-4'> */}
//                         <Link href="/" className='flex items-center gap-2 !my-4'>
//                         <Image src="/icons/logo.svg" alt="logo" width={50} height={50}  className='cursor-pointer'/>
//                         <h1 className='text-32 font-bold cursor-pointer'>Narrio</h1>
//                         </Link>
//                     {/* </div> */}

//                     <p>to continue to Narrio</p>

//                     <div className='flex items-center gap-2 !my-6'>
//                         <Image src="/icons/google.png" alt="google" width={50} height={50} className='bg-black-1 border-2 border-black rounded-lg p-2 cursor-pointer' />
//                         <Image src="/icons/github.png" alt="github" width={50} height={50} className='bg-black-1 border-2 border-black rounded-lg p-2 cursor-pointer' />
//                     </div>

//                     <div className='flex flex-col w-full gap-4 !mb-6 !mt-10'>
//                         <p className='text-16 font-bold'>Email Address</p>
//                         <Input className='input_class bg-[#23252b] text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-orange-500' />


//                         <button className='text-16 font-bold bg-orange-500 text-white w-full p-2 cursor-pointer rounded-lg '>Continue</button>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Auth;