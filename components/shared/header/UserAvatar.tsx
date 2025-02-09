import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { UserAvatarProps } from "../../../type/types";
import Image from "next/image";
import { LogInIcon } from "lucide-react";
import LogOutButton from "../button/LogOutButton";

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user.image ? (
          <Image
            src={user.image as string}
            className="w-12 rounded-full border-b"
            width={40}
            height={40}
            alt=""
          />
        ) : (
          <div className="w-20 p-2 rounded flex items-center justify-center">
            {user.name}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel> {user.name} </DropdownMenuLabel>
        <DropdownMenuSeparator />
      
        <DropdownMenuItem className="flex items-center justify-between text-destructive cursor-pointer">
          <LogInIcon />
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
