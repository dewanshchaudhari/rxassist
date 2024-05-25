import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShopkeeperCard({
  shopName,
  address,
  website,
  whatsapp,
  discount,
  phone,
  distance,
  hot,
}: {
  shopName: string;
  address: string | null;
  website: string | null;
  whatsapp: string | null;
  discount: string | null;
  distance: string | null;
  phone: string | null;
  hot?: boolean;
}) {
  return (
    <Card
      className={cn(
        "m-4",
        hot === true
          ? "hover:animate-background  rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
          : "",
      )}
    >
      <CardHeader className="rounded-xl bg-white">
        <CardTitle className="flex flex-row items-center justify-between">
          <h2>{shopName}</h2>
          <p className="text-sm text-muted-foreground">{distance} KM</p>
        </CardTitle>
        <CardDescription className="rounded-xl bg-white">
          {address ?? ""}
          <div className="mt-4 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-4">
              <Link href={website ?? "#"} target="_blank">
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <Image src={"/web.svg"} alt="web" height={30} width={30} />
                </Button>
              </Link>
              <Link href={whatsapp ?? "#"} target="_blank">
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <Image
                    src={"/whatsapp.svg"}
                    alt="whatsapp"
                    height={30}
                    width={30}
                  />
                </Button>
              </Link>
              <Link href={`tel:${phone}` ?? "#"} target="_blank">
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <Phone />
                </Button>
              </Link>
            </div>
            <h3>{discount ?? ""}</h3>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
