import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    return (
      <>
        giriş yok
        <Link href={"/api/auth/signin"}>sign in</Link>
      </>
    );
  }
  return <div>
    {session?.user?.name}
  </div>;
}
