import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { env } from "@/env";
import {
  BriefcaseMedical,
  Calendar,
  CircleDollarSign,
  Menu,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const { status } = useSession();
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Welcome to {env.NEXT_PUBLIC_APP_NAME}</SheetTitle>
          <SheetDescription>
            {status === "unauthenticated" && (
              <Button
                className="h-12 w-full rounded-full"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            )}
            <Separator orientation="horizontal" className="my-4" />
          </SheetDescription>
        </SheetHeader>

        <div className="flex w-full flex-col items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/home">
              <BriefcaseMedical /> Drug savings
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/upload">
              <Calendar /> Upload Prescription
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/home#works">
              <CircleDollarSign /> How {env.NEXT_PUBLIC_APP_NAME} works
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
          >
            <BriefcaseMedical /> Drug savings
          </Button>
        </div>
        <Separator orientation="horizontal" className="my-4" />
        <div className="flex w-full flex-col items-center justify-between gap-2">
          {/* <div className="flex w-full flex-row items-center justify-start gap-2 rounded-full border px-4 py-2 text-sm font-normal shadow-sm">
            <BriefcaseMedical /> Drug savings
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-2 rounded-full border px-4 py-2 text-sm font-normal shadow-sm">
            <BriefcaseMedical /> Drug savings
          </div>

          <div className="flex w-full flex-row items-center justify-start gap-2 rounded-full border px-4 py-2 text-sm font-normal shadow-sm">
            <BriefcaseMedical /> Drug savings
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-2 rounded-full border px-4 py-2 text-sm font-normal shadow-sm">
            <BriefcaseMedical /> Drug savings
          </div> */}
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
