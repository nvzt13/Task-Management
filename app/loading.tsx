import React from 'react'
import { Loader2 } from 'lucide-react'
const loading = () => {
  return (
    <div className='w-full h-[500px] flex flex-col items-center justify-center'>
      <Loader2 className='animate-spin' />   
    </div>
  )
}

export default loading