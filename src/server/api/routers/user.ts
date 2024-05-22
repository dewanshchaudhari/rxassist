import { string, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { calculateDistance } from "@/lib/utils";

export const userRouter = createTRPCRouter({
  getLocationInfo: publicProcedure.query(async ({ ctx }) => {
    let ip = ctx.ip;
    if (ip === "::1") ip = "121.46.115.247";
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=66842623&lang=en`,
    );
    const { zip, city, regionName, lat, lon } = response.data as {
      zip: string;
      city: string;
      regionName: string;
      lat: number;
      lon: number;
    };
    return { zip, city, regionName, lat, lon };
  }),
  getTrueCallerRequestId: publicProcedure
    .input(z.object({ requestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const truecallerAuth = await ctx.db.truecallerAuth.findFirst({
        where: {
          requestId: input.requestId,
        },
      });
      if (truecallerAuth?.accessToken) return true;
      else return false;
    }),
  getLocationFromCoordinates: publicProcedure
    .input(z.object({ lat: z.string().min(1), log: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const url = `https://geocode.maps.co/reverse?lat=${input.lat}&lon=${input.log}&api_key=${env.GEOCODE_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      const body = (await response.json()) as {
        place_id: number;
        licence: string;
        powered_by: string;
        osm_type: string;
        osm_id: number;
        lat: string;
        lon: string;
        display_name: string;
        address: {
          residential: string;
          city_district: string;
          city: string;
          village: string;
          county: string;
          state_district: string;
          state: string;
          postcode: string;
          country: string;
          country_code: string;
        };
      };
      return {
        pincode: body.address.postcode,
        city: body.address.city,
        state: body.address.state,
        lat: input.lat,
        lon: input.log,
      };
    }),
  getLocationFromZipcode: publicProcedure
    .input(
      z.object({
        pincode: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const r1 = await axios.get(
        `https://api.zipcodestack.com/v1/search?codes=${input.pincode}&country=in`,
        {
          headers: {
            apikey: "01HYH4G0KK32WQSYSKFB81B6GC",
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const { latitude, longitude } = r1.data.results[input.pincode][0] as {
        latitude: string;
        longitude: string;
      };
      const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${env.GEOCODE_API_KEY}`;
      const response = await axios.get(url);
      if (response.status !== 200)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      const body = response.data as {
        place_id: number;
        licence: string;
        powered_by: string;
        osm_type: string;
        osm_id: number;
        lat: string;
        lon: string;
        display_name: string;
        address: {
          residential: string;
          city_district: string;
          city: string;
          village: string;
          county: string;
          state_district: string;
          state: string;
          postcode: string;
          country: string;
          country_code: string;
        };
      };
      return {
        pincode: input.pincode,
        city: body.address.city ?? body.address.county,
        state: body.address.state,
        lat: latitude.toString(),
        lon: longitude.toString(),
      };
    }),
  getNearestShopkeepers: publicProcedure
    .input(
      z.object({
        lat: z.string().nullable(),
        lon: z.string().nullable(),
        pincode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shopkeepers = await ctx.db.shopkeeper.findMany();
      const shopkeeper = await ctx.db.delivery.findFirst({
        where: {
          pincode: input.pincode,
        },
        include: {
          Shopkeeper: true,
        },
      });
      const a = {
        ...shopkeeper,
        distance:
          input.lat && input.lon
            ? calculateDistance(
                Number(input.lat),
                Number(input.lon),
                Number(shopkeeper?.Shopkeeper?.lat),
                Number(shopkeeper?.Shopkeeper?.lon),
              )
            : 0,
      };
      const nearestShopkeeper = shopkeepers
        .map((e) => {
          return {
            ...e,
            distance:
              input.lat && input.lon
                ? calculateDistance(
                    Number(input.lat),
                    Number(input.lon),
                    Number(e.lat),
                    Number(e.lon),
                  )
                : 0,
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .filter((e) => e.id !== shopkeeper?.Shopkeeper?.id);
      return { shops: nearestShopkeeper, pref: a };
    }),
});
