'use client'
import { addUserToGroup } from '@/actions/groups/add-user-to-group'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AddUserToGroup = ({groupId}: {groupId: string}) => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")

    const handleAddUserToGroup = async () => {
        setLoading(true)
        const resp = addUserToGroup(groupId, email)
        toast((await resp).message)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
       if ( e.key === "Enter") {
        handleAddUserToGroup()
       } 
    }
  return (

    <div>
        <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Who you want to add?'
        className={cn({
          "w-full": true,
          "opacity-40": loading
        })}
        />
    </div>
  )
}

export default AddUserToGroup