import { GroupHeaderProps } from '@/type/types'
import { GroupSettings } from './GroupSettings'

 const GroupHeader:React.FC<GroupHeaderProps>  = ( { group, isAdmin}) => {
return (
    <header className='flex w-full items-center justify-between h-20 border-b p-4'>
        <div className='flex flex-col gap-2'>
            <p className='font-semibold text-lg'> {group.groupName} </p>
            <p className='text-muted-foreground'> {group.description} </p>
        </div>
        <div>
            <GroupSettings />
        </div>
    </header>
)
}

export default GroupHeader