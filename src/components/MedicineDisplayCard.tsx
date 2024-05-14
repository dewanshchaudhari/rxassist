import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Cross, PlusCircle, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";

export default function MedicineDisplayCard({
  name,
  mrp,
  sp,
  discount,
  id,
  addToCart,
  removeFromCart,
  bg,
  brand,
  imageLink,
}: {
  name: string;
  mrp: string;
  sp: string;
  discount: string;
  id: string;
  addToCart: boolean;
  removeFromCart?: boolean;
  bg?: boolean;
  brand?: string;
  imageLink?: string | null;
}) {
  const [cart, setCart] = useLocalStorage<string[]>("cart", []);
  const [calculator, setCalculator] = useLocalStorage<string[]>(
    "calculator",
    [],
  );
  const router = useRouter();

  return (
    <Card
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        bg && "bg-green-100",
      )}
    >
      <div className="relative h-full w-full px-4 pt-4">
        {/* {addToCart && (
          <Button
            variant={"link"}
            size={"sm"}
            className="absolute right-2 top-2 rounded-full border"
            onClick={() => setCart([...new Set([...cart, id])])}
          >
            <PlusCircle className="h-6 w-6" />
            Add
          </Button>
        )} */}
        {removeFromCart && (
          <Button
            variant={"link"}
            size={"icon"}
            className="absolute right-0 top-0"
            onClick={() => {
              const index = calculator.indexOf(id);
              if (index > -1) {
                calculator.splice(index, 1);
                setCalculator(calculator);
              }
            }}
          >
            <XCircle className="h-6 w-6" />
          </Button>
        )}
        {imageLink ? (
          <Image
            src={imageLink}
            alt="Generic Medicine Image"
            width={512}
            height={512}
            onClick={() =>
              router.push(
                `/medicine/${encodeURIComponent(
                  name.replaceAll(" ", "-"),
                )}-${id}`,
              )
            }
          />
        ) : (
          <Image
            src={"/product.png"}
            alt="Generic Medicine Image"
            width={512}
            height={512}
            onClick={() =>
              router.push(
                `/medicine/${encodeURIComponent(
                  name.replaceAll(" ", "-"),
                )}-${id}`,
              )
            }
          />
        )}
      </div>
      <div
        className="flex h-full w-full flex-row items-start justify-between px-4 py-4"
        onClick={() =>
          router.push(
            `/medicine/${encodeURIComponent(name.replaceAll(" ", "-"))}-${id}`,
          )
        }
      >
        <div className="w-full">
          <h3 className="text-xs">{name}</h3>
          {brand && (
            <h4 className="mt-1 text-[0.7rem] text-slate-500">by {brand}</h4>
          )}
        </div>
      </div>
      {/* <div className="mb-2 flex w-full flex-col items-start justify-start pl-4 text-sm">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="text-slate-400">Price</div>
          <h3 className="font-bold">₹{Number(mrp).toFixed(1)} </h3>
        </div>
      </div> */}
    </Card>
  );
}
