import ShopkeeperCard from "@/components/shopkeeperCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";
import useMediaQuery from "@/hooks/mediaQuery";
import { cn, getRandomNumber } from "@/lib/utils";
import { api } from "@/utils/api";
import { Loader2, Lock, Orbit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
export default function Medicine({ params }: { params: { id: string } }) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [location, setLocation] = useLocalStorage<{
    pincode: string | null;
    city: string | null;
    state: string | null;
    lat: string | null;
    lon: string | null;
  }>("location", {
    city: null,
    state: null,
    pincode: null,
    lat: null,
    lon: null,
  });
  const { data: sh, isPending } = api.user.getNearestShopkeepers.useQuery(
    {
      lat: location.lat!,
      lon: location.lon!,
      pincode: location.pincode!,
    },
    {
      enabled:
        location.lat !== null &&
        location.lon !== null &&
        location.pincode !== null,
    },
  );
  const router = useRouter();
  console.log(router.query);
  const medicineId =
    typeof router.query.id === "string"
      ? router.query.id.split("-").at(-1)
      : "";
  const {
    data: medicine,
    isLoading: isMedicineLoading,
    isError: isMedicineError,
  } = api.medicine.getMedicineById.useQuery(
    {
      id: medicineId ?? "",
    },
    {
      enabled: !!medicineId,
    },
  );
  if (isMedicineLoading)
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  if (!medicine)
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <h1>No medicine found</h1>
      </div>
    );

  return (
    <div className={`h-full ${isMobile ? "w-full" : "mx-auto w-[60%]"}`}>
      {env.NEXT_PUBLIC_APP_ID === "2" &&
        medicine.AlternativeMedicine.length !== 0 && (
          <div className="w-full p-4 text-center text-muted-foreground">
            We recommend the below JanAushadhi substitute for your searched
            medicine.
          </div>
        )}
      {env.NEXT_PUBLIC_APP_ID === "2" &&
        medicine.AlternativeMedicine.length === 0 && (
          <div className="w-full p-4 text-center text-muted-foreground">
            We don&#39;t have substitute for {medicine?.name}
          </div>
        )}
      {env.NEXT_PUBLIC_APP_ID === "1" &&
        medicine.AlternativeMedicine.length !== 0 && (
          <div className="w-full p-4 text-center text-muted-foreground">
            We recommend{" "}
            {medicine?.AlternativeMedicine[0]?.alternateMedicine.name} instead
            of {medicine?.name}
          </div>
        )}
      {env.NEXT_PUBLIC_APP_ID === "1" &&
        medicine.AlternativeMedicine.length === 0 && (
          <div className="w-full p-4 text-center text-muted-foreground">
            We don&#39;t have substitute for {medicine?.name}
          </div>
        )}
      <div className="raidal relative z-10 mt-2 flex flex-col items-center justify-center">
        {medicine.AlternativeMedicine.length !== 0 ? (
          <Button className="rounded-full" variant={"outline"}>
            <Orbit className="mr-4" />
            Salt Composition in both
          </Button>
        ) : (
          <Button className="rounded-full" variant={"outline"}>
            <Orbit className="mr-4" />
            Salt Composition
          </Button>
        )}
        {/* <Separator className="absolute left-0 top-5 z-0" /> */}
        <h3 className="mt-2 text-muted-foreground">{medicine.Salt?.salt}</h3>
      </div>
      <div className="relative m-2 flex flex-row justify-center gap-2">
        <div className={`w-full py-1 ${!isMobile ? "max-w-[400px]" : ""}`}>
          <div
            className={cn(
              "w-full rounded-lg bg-gray-200 py-1",
              medicine.AlternativeMedicine.length !== 0 ? "mt-8" : "",
            )}
          >
            <h3 className="ml-2 text-sm">You Searched</h3>
            <Image
              className="mt-2 p-4"
              src={"/product.png"}
              alt="product"
              width={200}
              height={200}
            />
            <div className="p-2">
              <h2 className="text-sm font-semibold">{medicine.name}</h2>
              <h3 className="text-muted-foreground">{medicine.Brand?.brand}</h3>
              <h3 className="text-sm text-muted-foreground">
                {medicine.packaging}
              </h3>
              <h2 className="mt-2 text-xl font-semibold">
                ₹{Number(medicine.mrp).toFixed(2)}
              </h2>
            </div>
          </div>
          {medicine.AlternativeMedicine.length !== 0 && (
            <Card className="mt-2">
              <CardDescription className="relative p-2 text-sm">
                We only sell the best substitute from top {"   "}
                Brands
                <Image
                  src={"/arrow.svg"}
                  alt=""
                  width={80}
                  height={80}
                  className="absolute -bottom-5 -right-2"
                />
              </CardDescription>
            </Card>
          )}
        </div>
        <div className={`w-full py-1 ${!isMobile ? "max-w-[400px]" : ""}`}>
          {medicine.AlternativeMedicine.length !== 0 && (
            <div className="flex h-8 flex-row items-center justify-center rounded-t-lg bg-green-600 p-2 text-center text-sm text-white">
              {(
                (1 -
                  Number(
                    medicine.AlternativeMedicine[0]?.alternateMedicine.sp,
                  ) /
                    Number(medicine.mrp)) *
                100
              ).toFixed(0)}
              {"% "}
              More Savings
            </div>
          )}
          {medicine.AlternativeMedicine.length !== 0 && (
            <div className="rounded-lg bg-green-100">
              <h3 className="ml-2 text-sm">Our Recommendation</h3>
              <Image
                className="mt-2 p-4"
                src={"/product.png"}
                alt="product"
                width={200}
                height={200}
              />
              <div className="p-2">
                <h2 className="text-sm font-semibold">
                  {medicine.AlternativeMedicine[0]?.alternateMedicine.name}
                </h2>
                <h3 className="text-muted-foreground">
                  {
                    medicine.AlternativeMedicine[0]?.alternateMedicine.Brand
                      ?.brand
                  }
                </h3>
                <h3 className="text-sm text-muted-foreground">
                  {medicine.AlternativeMedicine[0]?.alternateMedicine.packaging}
                </h3>
                <h2 className="mt-2 text-xl font-semibold text-green-600">
                  ₹
                  {Number(
                    medicine.AlternativeMedicine[0]?.alternateMedicine.sp,
                  ).toFixed(2)}
                </h2>
                {env.NEXT_PUBLIC_APP_ID === "2" && (
                  <div className="flex flex-row items-start justify-start">
                    <h2 className="text-sm text-muted-foreground">MRP ₹</h2>
                    <h2 className="text-sm text-muted-foreground line-through">
                      {Number(
                        medicine.AlternativeMedicine[0]?.alternateMedicine.mrp,
                      ).toFixed(2)}
                    </h2>
                  </div>
                )}
                <Card>
                  <CardContent className="flex h-full flex-row justify-between p-2">
                    <div className="flex flex-col items-center justify-start text-sm">
                      Marketed by
                      <Image src={"/cipla.png"} alt="" width={75} height={75} />
                    </div>
                    <div className="flex flex-col items-center justify-start text-sm">
                      Assured by
                      <Image src={"/plus.svg"} alt="" width={25} height={25} />
                    </div>
                  </CardContent>
                  <div className="m-1 flex flex-row items-center justify-center gap-2 rounded-xl border p-2 text-xs">
                    <Lock className="h-4 w-4" />
                    {getRandomNumber(1000, 5000)}+ Customers trust
                  </div>
                </Card>
              </div>
            </div>
          )}
          {medicine.AlternativeMedicine.length === 0 && (
            <div className="rounded-lg border">
              {/* <h3 className="ml-2 text-sm">Our Recommendation</h3> */}
              <Image
                className="mt-2 p-4"
                src={"/sea.svg"}
                alt="product"
                width={200}
                height={200}
              />
              <div className="p-2">
                <h2 className="text-sm font-semibold">
                  We don&#39;t have substitute
                </h2>
                <h3 className="mt-2 text-justify text-sm text-muted-foreground">
                  Sorry. We were not able to find a JanAushadhi substitute for
                  this medicine.
                </h3>
                <h4 className="mt-2">
                  We recommend buying a generic substitute of this medicine from
                  your nearest pharmacy
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-center gap-4 p-10 ${isMobile ? "flex-col" : "flex-row"}`}
      >
        <Button className="w-full max-w-[560px]" variant="outline" asChild>
          <Link href={"/upload"}>Get free Pharmacist consultation</Link>
        </Button>

        <Button className="w-full max-w-[560px]" asChild>
          <Link
            href={`tel:${sh?.pref?.Shopkeeper?.phone ? sh?.pref.Shopkeeper.phone : sh?.shops[0]?.phone}`}
          >
            Call to order
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="mt-4 w-full text-center text-2xl font-medium">
          Nearby JanAushadhi Kendras
        </h1>
        {isPending && (
          <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        <div className={!isMobile ? "flex flex-wrap justify-center" : ""}>
          {sh?.pref?.Shopkeeper && (
            <div className={!isMobile ? "min-w-[560px] max-w-[80%]" : ""}>
              <ShopkeeperCard
                key={sh?.pref?.Shopkeeper.id}
                address={sh?.pref?.Shopkeeper.address}
                shopName={sh?.pref?.Shopkeeper.shopName}
                discount={sh?.pref?.Shopkeeper.discount}
                website={sh?.pref?.Shopkeeper.website}
                whatsapp={sh?.pref?.Shopkeeper.whatsapp}
                phone={sh?.pref.Shopkeeper.phone}
                distance={sh.pref.distance.toFixed(0)}
                hot={true}
              />
            </div>
          )}
          {sh?.shops?.length !== 0 &&
            sh?.shops?.map((shop) => (
              <div className={!isMobile ? "min-w-[560px] max-w-[80%]" : ""}>
                <ShopkeeperCard
                  key={shop.id}
                  address={shop.address}
                  shopName={shop.shopName}
                  discount={shop.discount}
                  website={shop.website}
                  whatsapp={shop.whatsapp}
                  phone={shop.phone}
                  distance={shop.distance.toFixed(0)}
                  hot={false}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
