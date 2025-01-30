import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import React from 'react'

const SingleGroup = async ( {params}: {params: {groupId: string}}) => {

  const session = await auth()

  if (!session || !session.user?.id) {
    return <div> Unauthorized </div>
  }

  const group = await prisma.group.findFirst({
    where: {
      id:params.groupId,
      groupUsers: {
        some: {
          id: session.user.id
        }
      }
    }
  })
  if (!group) {
    return <div> Unauthorized or not found</div>
  }
  return (
    <div>
      {group.description}
      { params.groupId}
      </div>
  )
}

export default SingleGroup