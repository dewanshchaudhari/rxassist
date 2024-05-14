import "react-phone-number-input/style.css";
import React from "react";
import PhoneInputWithCountrySelect, {
  isPossiblePhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { type E164Number } from "libphonenumber-js/core";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { Loader2, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateRequestID } from "@/lib/utils";
import { TRUECALLER } from "@/lib/constants";
const requestId = generateRequestID();
const TRUECALLER_URL = `truecallersdk://truesdk/web_verify?requestNonce=${requestId}&partnerKey=${TRUECALLER.partnerKey}&partnerName=${TRUECALLER.partnerName}&lang=${TRUECALLER.lang}&privacyUrl=${TRUECALLER.privacyUrl}&termsUrl=${TRUECALLER.termsUrl}&loginPrefix=${TRUECALLER.loginPrefix}&loginSuffix=${TRUECALLER.loginSuffix}&ctaPrefix=${TRUECALLER.ctaPrefix}&ctaColor=${TRUECALLER.ctaColor}&ctaTextColor=${TRUECALLER.ctaTextColor}&btnShape=${TRUECALLER.btnShape}&skipOption=${TRUECALLER.skipOption}&ttl=${TRUECALLER.ttl}`;
export default function PhoneAuth() {
  const [phone, setPhone] = React.useState<E164Number>();
  const [showOtpScreen, setShowOtpScreen] = React.useState(false);
  const [error, showError] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const router = useRouter();

  const { data } = api.user.getTrueCallerRequestId.useQuery(
    { requestId },
    {
      enabled: false,
      refetchInterval: 2000,
    },
  );
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
      void router.push(signInResponse.url ?? "/");
    } else {
      if (signInResponse?.error?.includes("Wrong OTP")) {
        showError(true);
      }
    }
  };
  return (
    <div className="flex h-20 w-full flex-col items-center justify-center">
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
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              disabled={!isPossiblePhoneNumber(phone ?? "") || isPending}
              onClick={sendOtp}
            >
              <RefreshCw />
            </Button>
          </form>
          {error && <h2 className="text-red-300">INVALID OTP</h2>}

          <h1 className="mt-4 flex flex-row items-center justify-between text-sm">
            We have sent an OTP on your WhatsApp number.
          </h1>
        </>
      )}
    </div>
  );
}
