import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/utils/api";
import { Loader2, Orbit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
export default function Medicine({ params }: { params: { id: string } }) {
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

  if (!medicine.AlternativeMedicine.length)
    return (
      <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
        <h1>No Alternative Medicine found</h1>
      </div>
    );
  return (
    <div className="h-full w-full">
      <span className="flex flex-row p-4 text-muted-foreground">
        We recommend {medicine?.AlternativeMedicine[0]?.alternateMedicine.name}{" "}
        instead of {medicine?.name}
      </span>
      <div className="relative z-10 mt-2 flex flex-col items-center justify-center">
        <Button className="rounded-full" variant={"outline"}>
          <Orbit className="mr-4" />
          Salt Composition in both
        </Button>
        {/* <Separator className="absolute left-0 top-5 z-0" /> */}
        <h3 className="text-muted-foreground">{medicine.Salt?.salt}</h3>
      </div>
      <div className="relative m-2 flex flex-row items-start justify-between gap-2">
        <div className="w-full py-1">
          <div className="mt-8 w-full rounded-lg bg-gray-200 py-1">
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
          <Card className="mt-2">
            <CardDescription className="relative p-2 text-lg ">
              We only sell the best substitute from top {"   "}
              Brands
              <Image
                src={"/arrow.jpg"}
                alt=""
                width={80}
                height={80}
                className="absolute -bottom-10 right-0 rotate-[-105deg]"
              />
            </CardDescription>
          </Card>
        </div>
        <div className="w-full  py-1">
          <div className="flex h-8 flex-row items-center justify-center rounded-t-lg bg-green-600 p-2 text-center text-sm text-white">
            {(
              ((Number(medicine.sp) -
                Number(medicine.AlternativeMedicine[0]?.alternateMedicine.sp)) /
                Number(medicine.sp)) *
              100
            ).toFixed(0)}
            {"% "}
            More Savings
          </div>
          <div className="rounded-lg bg-green-100 ">
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
              <div className="flex flex-row items-start justify-start">
                <h2 className="text-sm text-muted-foreground">MRP ₹</h2>
                <h2 className="text-sm text-muted-foreground line-through">
                  {Number(
                    medicine.AlternativeMedicine[0]?.alternateMedicine.mrp,
                  ).toFixed(2)}
                </h2>
              </div>
              <Card>
                <CardContent className="flex h-full flex-row justify-between p-2">
                  <div className="flex flex-col items-center justify-start text-xs">
                    Marketed by
                    <Image src={"./plus.svg"} alt="" width={20} height={20} />
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex flex-col items-center justify-start text-xs">
                    Assured by
                    <Image src={"./plus.svg"} alt="" width={20} height={20} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <Shopkeeper /> */}
      {/* <MedicineCard medicineId={medicineId} />
      <AlternateMedicineCard medicineId={medicineId} />
      <SuggestionCard medicineId={medicineId} />
      <Card className="m-4">
        <CardContent className="flex flex-row items-center justify-around pt-6">
          <div className="flex flex-col items-center justify-center">
            <Image src={"/10k.png"} alt="" width={60} height={60} />
            <h4 className="mt-2 text-center text-xs">10K+ Happy Customers</h4>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image src={"/quality.png"} alt="" width={60} height={60} />
            <h4 className="mt-2 text-center text-xs">Quality Guarantee</h4>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image src={"/safe.png"} alt="" width={60} height={60} />
            <h4 className="mt-2 text-center text-xs">
              Safe and Secure Payments
            </h4>
          </div>
        </CardContent>
      </Card>
      <div className="border-y-2 border-gray-200 p-4">
        <h3 className="text-xl">Disclaimer</h3>
        {readMore ? (
          <h4 className="text-sm text-slate-500">
            <p className="inline">
              The contents here is for informational purposes only and not
              intended to be a substitute for professional medical advice,
              diagnosis, or treatment. Please seek the advice of a physician or
              other qualified health provider with any questions you may have
              regarding a medical condition. JanMedico App on any information
              and subsequent action or inaction is solely at the user&#39;s
              risk, and we do not assume any responsibility for the same. The
              content on the Platform should not be considered or used as a
              substitute for professional and qualified medical advice. Please
              consult your doctor for any query pertaining to medicines, tests
              and/or diseases, as we support, and do not replace the
              doctor-patient relationship. This is a private BPPI and does not
              have any association with the government. To buy directly from
              store offline you can visit us. Click here.
            </p>
            <p
              className="inline font-bold text-blue-300"
              onClick={() => setReadMore(false)}
            >
              Read Less.
            </p>
          </h4>
        ) : (
          <h4 className="text-sm text-slate-500">
            <p className="inline">
              The contents here is for informational purposes only and not
              intended to be a substitute for professional medical advice,
              diagnosis, or treatment.{" "}
            </p>
            <p
              className="inline font-bold text-blue-300"
              onClick={() => setReadMore(true)}
            >
              Read More.
            </p>
          </h4>
        )}

        <h3 className="mt-4">
          India&#39;s most trusted generic medicine pharmacy chain. Trusted by
          10k customers all over India.
        </h3>
      </div> */}
    </div>
  );
}
