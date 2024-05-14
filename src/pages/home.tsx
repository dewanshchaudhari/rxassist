import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { states } from "@/lib/utils";
import { api } from "@/utils/api";
import { Loader2, LocateFixed, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { Search } from "@/components/search";
import ShopkeeperCard from "@/components/shopkeeperCard";

export default function Home() {
  const [isOpen, setIsOpen] = React.useState(false);
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
  const [loading, setLoading] = React.useState(false);
  const { data } = api.user.getLocationInfo.useQuery(undefined, {
    enabled: location.pincode === null,
  });
  const { mutate } = api.user.getLocationFromCoordinates.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      setLocation({
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        lat: data.lat,
        lon: data.lon,
      });
      // setLocation(`${data.pincode} ${data.city}, ${states[data.state] ?? ""}`);
      setLoading(false);
      setIsOpen(false);
    },
  });
  React.useEffect(() => {
    console.log("data", data);
    if (data) {
      console.log("Setting data");
      setLocation({
        city: data.city,
        pincode: data.zip,
        state: data.regionName,
        lat: data.lat.toString(),
        lon: data.lon.toString(),
      });
    }
  }, [data, setLocation, location]);
  function handleLocationClick() {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            ...location,
            lat: String(position.coords.latitude),
            lon: String(position.coords.longitude),
          });
          mutate({
            lat: String(position.coords.latitude),
            log: String(position.coords.longitude),
          });
        },
        (e) => {
          console.log(e);
        },
        {
          enableHighAccuracy: true,
        },
      );
    } else {
      console.log("Geolocation not supported");
    }
  }
  return (
    <div>
      <div className="flex w-full max-w-full flex-col justify-start bg-[#FFE574] bg-[url('https://images.ctfassets.net/4f3rgqwzdznj/664tECUWQfMzWmIbDht1Ky/6419be7ffddd0f1470e4fe460ae3e820/kcheli-rising-sun-compromise.svg')] bg-bottom bg-no-repeat px-4 pb-4 pt-12">
        <h1 className="w-full text-3xl font-medium md:text-center">
          Stop paying too much for prescriptions
        </h1>
        <h3 className="text-left">Compare prices and save up to 80%</h3>
        <div className="mt-4">
          <Search />
        </div>
      </div>
      <div>
        <h1 className="mt-4 w-full text-center text-2xl font-medium">
          Save at popular pharmacies
        </h1>
        <div className="flex flex-row items-center justify-center gap-2">
          <MapPin className="h-5 w-5" />
          {location.pincode
            ? `${location.pincode} ${location.city} ${states[location.state!]}`
            : ""}
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger>
              <Label className="text-blue-700">(Upload)</Label>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">
                  Set Your Location
                </DrawerTitle>
                <DrawerDescription>Find a location near you</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <Button
                  className="h-12 w-full gap-4 rounded-full"
                  onClick={() => handleLocationClick()}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <LocateFixed />
                  )}
                  Use my current location
                </Button>
                <h2 className="mb-2 mt-4 text-center text-sm text-muted-foreground">
                  Note: Your browser will ask permission first
                </h2>
                <h1 className="text-center text-muted-foreground">OR</h1>
                <div className="grid w-full max-w-sm items-center gap-1.5 p-4">
                  <Label htmlFor="zipcode">Zipcode</Label>
                  <Input type="text" id="zipcode" placeholder="Enter zipcode" />
                </div>
              </div>
              <DrawerFooter>
                <div className="flex w-full flex-row items-center justify-between gap-4">
                  <DrawerClose className="w-1/2">
                    <Button variant="outline" className="w-full rounded-full">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button className="w-1/2 rounded-full">Submit</Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {sh?.shops?.length === 0 && (
        <div className="flex flex-col items-center justify-between">
          <Image src={"/search.svg"} alt="" height={350} width={280} />
          <h3 className="w-full text-center text-xl font-normal">
            Sorry, we could not find savings for you in this location.
          </h3>
          <Button
            className="rounded-full border-blue-700 text-blue-700"
            variant={"outline"}
            onClick={() => setIsOpen(true)}
          >
            <MapPin className="mr-4 h-4 w-4" /> Update Location
          </Button>
        </div>
      )}
      {isPending && (
        <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      {sh?.pref?.Shopkeeper && (
        <ShopkeeperCard
          key={sh?.pref?.Shopkeeper.id}
          address={sh?.pref?.Shopkeeper.address}
          shopName={sh?.pref?.Shopkeeper.shopName}
          discount={sh?.pref?.Shopkeeper.discount}
          website={sh?.pref?.Shopkeeper.website}
          whatsapp={sh?.pref?.Shopkeeper.whatsapp}
          hot={true}
        />
      )}
      {sh?.shops?.length !== 0 &&
        sh?.shops?.map((shop) => (
          <ShopkeeperCard
            key={shop.id}
            address={shop.address}
            shopName={shop.shopName}
            discount={shop.discount}
            website={shop.website}
            whatsapp={shop.whatsapp}
            hot={false}
          />
        ))}
    </div>
  );
}