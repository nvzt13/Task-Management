"use client";
import { cn } from "@/lib/utils";
import { GroupUsersListProps } from "@/type/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CrownIcon } from "lucide-react"; // Admini göstermek için bir ikon

const GroupUserList: React.FC<GroupUsersListProps> = ({
  groupUsers,
  currentGroupId,
  adminId,
}) => {
  const pathName = usePathname();

  // Admini en üste almak için sıralama
  const sortedUsers = [...groupUsers].sort((a, b) => (a.id === adminId ? -1 : b.id === adminId ? 1 : 0));

  return (
    <div className="">
  {sortedUsers.map((user) => (
    <Link
      href={`/groups/${currentGroupId}/${user.id}`}
      key={user.id}
      className={cn({
        "flex rounded border-b transition-colors items-center mb-2 p-2": true,
        "bg-gray-800 text-white": pathName.endsWith(`${user.id}`),
        "bg-gradient-to-r from-yellow-100 to-yellow-50": adminId === user.id, 

            })}
    >
      <Image
        src={user.image as string}
        alt="user image"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <p
            className={cn("font-semibold overflow-hidden", {
              "text-yellow-600": adminId === user.id, // Admin metin rengi
            })}
          >
            @{user.name ?? ""}
          </p>
          {adminId === user.id && (
            <CrownIcon
              className="ml-2 text-yellow-500 animate-pulse" // Animasyonlu ikon
              aria-label="Admin"
              size={20} // İkon boyutu
            />
          )}
        </div>
      </div>
    </Link>
  ))}
</div>

  );
};

export default GroupUserList;
