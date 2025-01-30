import { chdir } from 'process'
import React, { ReactNode } from 'react'

const SingleGroupLayout = ({children} : {children: ReactNode}) => {
  return (
    <div>{children}</div>
  )
}

export default SingleGroupLayout