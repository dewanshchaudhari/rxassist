import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/home");
  return null;
}
