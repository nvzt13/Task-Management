import { cn } from "@/lib/utils";
import { GroupUsersListProps } from "@/type/types";
import Image from "next/image";
import Link from "next/link";


const GroupUserList: React.FC<GroupUsersListProps> = ( {groupUsers, currentGroupId, currentUserId} ) => {
    return (
        <Link href={`/groups/${currentGroupId}/${currentUserId}`} className="flex w-full" >
        {groupUsers.map((user) => (
            <div key={user.id} className={cn({
                "div w-full p-3 flex gap-4 rounded border-b": true,
                "border-green-600 ": user.id === currentGroupId
            })} >
                <Image 
                src={user.image}
                alt="user imager"
                width={40}
                height={40}
                className="rounded-full"
                />
                <div className="flex flex-col w-full">
                    <p>@{user.name ?? ""}</p>
                    <p className="truncate mr-12 text-muted-foreground text-sm"> {user.email} </p>
                </div>
            </div>
        ))}
        </Link>
    )
}

export default GroupUserList
