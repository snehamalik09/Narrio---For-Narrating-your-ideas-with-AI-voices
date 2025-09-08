import React from 'react'
import { Loader } from 'lucide-react'

// const LoaderSpinner = () => {
//   return (
//     <div className='flex items-center justify-center h-full min-h-screen w-full'>
//       <Loader className="animate-spin text-orange-500 h-6 w-6" />
//     </div>
//   )
// }

const LoaderSpinner = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <Loader className="animate-spin text-orange-500 h-6 w-6" />
    </div>
  )
}


export default LoaderSpinner
