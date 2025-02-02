"use client";
import { cn } from "@/lib/utils";
import { GroupUsersListProps } from "@/type/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddUserToGroup from "./AddUserToGroup";

const GroupUserList: React.FC<GroupUsersListProps> = ({
  groupUsers,
  currentGroupId,
  currentUserId,
  isAdmin
}) => {
  const pathName = usePathname();
  return (
    <div className="w-full">
      {groupUsers.map((user) => (
        <Link
          href={`/groups/${currentGroupId}/${user.id}`}
          key={user.id}
          className={cn({
            "div w-full p-3 flex gap-4 bg-gray-400 rounded border-b": true,
            "border-red-600 bg-slate-400": user.id === currentUserId,
            "bg-sky-800 text-white": pathName.startsWith(
              `/groups/${currentGroupId}/${currentUserId}`
            ),
          })}
        >
          <Image
            src={user.image as string}
            alt="user imager"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col w-full">
            <p>@{user.name ?? ""}</p>
            <p className="truncate mr-12 text-muted-foreground text-sm">
              {" "}
              {user.email}{" "}
            </p>
          </div>
        </Link>
      ))}
      { isAdmin && <AddUserToGroup groupId={currentGroupId} /> }
    </div>
  );
};

export default GroupUserList;
