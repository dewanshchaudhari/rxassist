import { env } from "@/env";

export const TRUECALLER = {
  partnerKey: env.NEXT_PUBLIC_TRUECALLER_APP_KEY,
  partnerName: "Save With Janaushadhi",
  lang: "en",
  privacyUrl: "https://savewithjanaushadhi.com/privacy-policy",
  termsUrl: "https://savewithjanaushadhi.com/terms-and-conditions",
  loginPrefix: "getstarted",
  loginSuffix: "login",
  ctaPrefix: "continuewith",
  ctaColor: "%23f75d34",
  ctaTextColor: "%23f75d34",
  btnShape: "round",
  skipOption: "manualdetails",
  ttl: "20000",
} as const;
