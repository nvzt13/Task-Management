"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";

const Header = () => {
  const session = useSession();

  return (
    <div className="flex w-full justify-between p-8">
      <Link href="/" className="font-bold text-3xl">Nevzat Atlatay</Link>
      <div>
        {session.status === "loading" && <Loader2 className="animate-spin" />}
        {session.status === "authenticated" && session.data.user && <UserAvatar user={session.data.user}/>}
        {session.status === "unauthenticated" && (
          <Link href={"/app/api/auth/signin"} />
        )}
      </div>
    </div>
  );
};

export default Header;
