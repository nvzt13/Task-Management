import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import AllUsers from "@/components/shared/users/AllUsers";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex w-full flex-col items-center justify-center h-screen bg-gray-100">
        {/* Logo */}
        <Image
  src="https://ih1.redbubble.net/image.570226677.0235/st,small,507x507-pad,600x600,f8f8f8.u1.jpg"
  alt="Logo"
  width={150}
  height={150}
  className="mb-8"
/>

        <h1 className="text-3xl font-bold mb-6">Welcome to Our App</h1>
        <Link
          href={"/api/auth/signin"}
          className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-gray-100">
      {/* Logo */}
      <Image
  src="https://ih1.redbubble.net/image.570226677.0235/st,small,507x507-pad,600x600,f8f8f8.u1.jpg"
  alt="Logo"
  width={150}
  height={150}
  className="mb-8"
/>
      <h1 className="text-3xl font-bold mb-6">Welcome Back, {session.user.name}</h1>

      <div className="flex space-x-4">
        <Link
          href={"/groups"}
          className="p-4 w-40 text-center rounded-lg bg-black text-white hover:bg-gray-500 transition duration-300 ease-in-out"
        >
          View Groups
        </Link>
      </div>
    </div>
  );
}
