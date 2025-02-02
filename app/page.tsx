import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    return (
      <>
        Home 
        <Link href={"/api/auth/signin"}>Sign In</Link>
      </>
    );
  }

  return (
    <div>
      Home
      <Link
        href={"/groups"}
        className="p-2 rounded-lg border text-white text-bold bg-black hover:bg-gray-500"
      >
        Groups
      </Link>
      <Link
        href={"/api/auth/signout"}
        className="p-2 ml-4 rounded-lg border text-white text-bold bg-red-500 hover:bg-red-700"
      >
        Sign Out
      </Link>
    </div>
  );
}
