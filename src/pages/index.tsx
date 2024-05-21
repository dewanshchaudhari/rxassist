import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  React.useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [router, status]);
  return <></>;
}
