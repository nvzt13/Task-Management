"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";

const Header = () => {
  const session = useSession();

  return (
    <header className="flex w-full justify-between items-center p-6 bg-gray-900 text-white shadow-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="https://ih1.redbubble.net/image.570226677.0235/st,small,507x507-pad,600x600,f8f8f8.u1.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="font-bold text-2xl">Nevzat Atalay</span>
      </Link>

      {/* Session-based content */}
      <div className="flex items-center space-x-4">
        {session.status === "loading" && (
          <Loader2 className="animate-spin text-white" size={24} />
        )}

        {session.status === "authenticated" && session.data.user && (
          <div className="flex items-center space-x-4">
            {/* Notification Component */}
            <Notification />

            {/* User Avatar Component */}
            <UserAvatar user={session.data.user} />
          </div>
        )}

        {session.status === "unauthenticated" && (
          <Link
            href={"/api/auth/signin"}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
