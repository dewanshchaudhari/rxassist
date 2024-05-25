import { PhoneAuthDrawer } from "@/components/PhoneAuthDrawer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  React.useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [router, status]);
  return (
    <div className="flex h-[100svh] flex-col items-center justify-between">
      <div className="h-full w-full bg-[url('/bg.jpg')] bg-cover"></div>
      <div className="p-5">
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-primary"></div>
          <span className="mx-4 flex-shrink text-primary">
            Log in or sign up
          </span>
          <div className="flex-grow border-t border-primary"></div>
        </div>
        {status === "unauthenticated" && <PhoneAuthDrawer open={true} />}
        <p className="pt-4 text-center text-primary">
          By continuing, you agree to our{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2">
            Privacy policy
          </Link>{" "}
          &{" "}
          <Link
            href="/terms-and-conditions"
            className="underline underline-offset-2"
          >
            Terms of service
          </Link>
        </p>
        <p className="text-center text-primary"></p>
      </div>
    </div>
  );
}
