import { env } from "@/env";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar";
export default function Nav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const { status } = useSession();
  return (
    <nav
      className={cn(
        "flex h-16 flex-row items-center justify-between space-x-4 border-b",
        className,
      )}
      {...props}
    >
      <Sidebar />
      <div
        className="flex flex-row items-center justify-between gap-4"
        onClick={() => router.push("/home")}
      >
        <Image src={"./plus.svg"} height={30} width={30} alt="h" />
        {env.NEXT_PUBLIC_APP_NAME}
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        {status === "authenticated" ? (
          <LogOut
            className="mr-2 h-6 w-6"
            onClick={() =>
              void signOut({
                callbackUrl: "/login",
                redirect: true,
              })
            }
          />
        ) : (
          <LogOut className="invisible mr-2 h-6 w-6" />
        )}
      </div>
    </nav>
  );
}
