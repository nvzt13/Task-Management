import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    return (
      <>
        giriş yok
        <Link href={"/api/auth/signin"}>sign in</Link>
      </>
    );
  }
  return (
    <div>
      <Link
        href={"/groups"}
        className="p-2 rounded-lg border text-white text-bold bg-black hover:bg-gray-500"
      >
        {" "}
        Groups{" "}
      </Link>
    </div>
  );
}
