import * as React from "react";

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
import "react-phone-number-input/style.css";

import PhoneInputWithCountrySelect, {
  isPossiblePhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { type E164Number } from "libphonenumber-js/core";
import { api } from "@/utils/api";
import { Loader2, RefreshCw } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateRequestID } from "@/lib/utils";
import { TRUECALLER } from "@/lib/constants";
const requestId = generateRequestID();
const TRUECALLER_URL = `truecallersdk://truesdk/web_verify?requestNonce=${requestId}&partnerKey=${TRUECALLER.partnerKey}&partnerName=${TRUECALLER.partnerName}&lang=${TRUECALLER.lang}&privacyUrl=${TRUECALLER.privacyUrl}&termsUrl=${TRUECALLER.termsUrl}&loginPrefix=${TRUECALLER.loginPrefix}&loginSuffix=${TRUECALLER.loginSuffix}&ctaPrefix=${TRUECALLER.ctaPrefix}&ctaColor=${TRUECALLER.ctaColor}&ctaTextColor=${TRUECALLER.ctaTextColor}&btnShape=${TRUECALLER.btnShape}&skipOption=${TRUECALLER.skipOption}&ttl=${TRUECALLER.ttl}`;
export function PhoneAuthDrawer({ open }: { open: boolean }) {
  const [phone, setPhone] = React.useState<E164Number>();
  const [showOtpScreen, setShowOtpScreen] = React.useState(false);
  const [error, showError] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [show, setShow] = React.useState(open);
  const router = useRouter();

  const { data } = api.user.getTrueCallerRequestId.useQuery(
    { requestId },
    {
      enabled: true,
      refetchInterval: 2000,
    },
  );
  const { mutate: setKey } = api.user.setTrueCallerRequestId.useMutation();
  React.useEffect(() => {
    setKey({ requestId });
  }, []);
  console.log(data, requestId);
  React.useEffect(() => {
    void (async () => {
      if (data) {
        const signInResponse = await signIn("credentials", {
          requestId,
          redirect: false,
          callbackUrl: "/home",
        });
        if (signInResponse?.ok) {
          void router.push(`/home`);
        } else {
          if (signInResponse?.error?.includes("Wrong OTP")) {
            showError(true);
          }
        }
      }
    })();
    return;
  }, [data, router]);
  const { isPending, mutate } = api.otp.sendOtp.useMutation({
    onSuccess: () => {
      setShowOtpScreen(true);
    },
  });
  const sendOtp = () => {
    const parsedPhoneNumber = parsePhoneNumber(phone ?? "");
    if (!parsedPhoneNumber) return;
    mutate({
      countryCallingCode: parsedPhoneNumber.countryCallingCode,
      nationalNumber: parsedPhoneNumber.nationalNumber,
      number: parsedPhoneNumber.number.replace("+", ""),
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signInResponse = await signIn("credentials", {
      phone: parsePhoneNumber(phone ?? "")?.number.replace("+", "") ?? "",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      otp: (e.target as any).otp.value as string,
      redirect: false,
      callbackUrl: "/home",
    });
    if (signInResponse?.ok) {
      void router.push(signInResponse.url ?? "/home");
    } else {
      if (signInResponse?.error?.includes("Wrong OTP")) {
        showError(true);
      }
    }
  };
  return (
    <Drawer open={show} onOpenChange={setShow}>
      <DrawerTrigger asChild className="p-4">
        <Button variant="default" className="w-full">
          Login
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Login</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex h-20 w-full flex-col items-center justify-center gap-4">
              {!showOtpScreen ? (
                <>
                  <div
                    className="w-full"
                    onClick={() => {
                      if (!clicked) {
                        window.location.assign(TRUECALLER_URL);
                        setClicked(true);
                      }
                    }}
                  >
                    <PhoneInputWithCountrySelect
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={setPhone}
                      addInternationalOption={false}
                      defaultCountry="IN"
                      className="mb-2 flex h-full w-full flex-row items-center justify-between"
                    />
                  </div>
                  <Button
                    disabled={!isPossiblePhoneNumber(phone ?? "") || isPending}
                    onClick={sendOtp}
                    className="w-full"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <form
                    onSubmit={(e) => void handleSubmit(e)}
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <Input
                      placeholder="OTP"
                      minLength={6}
                      type="number"
                      name="otp"
                      required
                      onClick={() => showError(false)}
                      className={`${error === true ? "border-red-200" : ""}`}
                    />
                    <Button type="submit">Login</Button>
                    <Button
                      variant="link"
                      size={"icon"}
                      disabled={
                        !isPossiblePhoneNumber(phone ?? "") || isPending
                      }
                      onClick={sendOtp}
                    >
                      <RefreshCw />
                    </Button>
                  </form>
                  {error && <h2 className="text-red-300">INVALID OTP</h2>}

                  <h1 className="mt-4 flex flex-row items-center justify-between text-sm">
                    We have sent an OTP on your Phone number.
                  </h1>
                </>
              )}
            </div>
          </div>
          <DrawerFooter>
            <div></div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
