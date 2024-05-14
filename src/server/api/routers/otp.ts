import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { env } from "@/env";
import { generateOTP } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

export const otpRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(
      z.object({
        countryCallingCode: z.string(),
        nationalNumber: z.string(),
        number: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const url = "https://www.fast2sms.com/dev/bulkV2";
      const OTP = generateOTP();
      const response = await axios.post(
        url,
        {
          variables_values: OTP,
          route: "otp",
          numbers: input.nationalNumber,
        },
        {
          headers: {
            authorization: env.FAST2SMS_API_KEY,
          },
        },
      );
      console.log(response);
      const data = response.data as { return: boolean };
      if (data.return !== true) {
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "FAILED_TO_SEND_OTP",
        });
      }
      return ctx.db.otpAuth.upsert({
        where: {
          phone: input.number,
        },
        create: {
          phone: input.number,
          otp: OTP,
        },
        update: {
          otp: OTP,
        },
        select: {
          phone: true,
        },
      });
    }),
});
