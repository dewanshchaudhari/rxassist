import Image from "next/image";
import { Sidebar } from "./sidebar";
import { env } from "@/env";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 flex h-12 w-full flex-row items-center justify-between border-b border-border/40 bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Sidebar />
      <div
        className="flex flex-row items-center justify-between gap-4"
        onClick={() => router.push("/home")}
      >
        <Image src={"./plus.svg"} height={30} width={30} alt="h" />
        {env.NEXT_PUBLIC_APP_NAME}
      </div>
      <div>bye</div>
    </nav>
  );
}
