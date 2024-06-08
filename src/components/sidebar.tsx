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
  EarthLock,
  FileTerminal,
  Menu,
  Phone,
  Rss,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { PhoneAuthDrawer } from "./PhoneAuthDrawer";

export function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const { status } = useSession();
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
              <PhoneAuthDrawer open={false} rounded={true} />
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
              <Rss /> Blogs
            </Link>
          </Button>
        </div>
        <Separator orientation="horizontal" className="my-4" />
        <div className="flex w-full flex-col items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/terms-and-conditions">
              <FileTerminal /> Terms & Condition
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/privacy-policy">
              <EarthLock /> Privacy Policy
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex w-full flex-row items-center justify-start gap-2 rounded-full"
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href="/contact">
              <Phone /> Contact us
            </Link>
          </Button>
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
