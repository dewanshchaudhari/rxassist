import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const medicineRouter = createTRPCRouter({
  searchMedicineByName: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        start: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.db.medicine.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          name: {
            startsWith: input.start,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getMedicineById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const medicine = await ctx.db.medicine.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Brand: true,
          Salt: true,
          AlternativeMedicine: {
            include: {
              alternateMedicine: {
                include: {
                  Brand: true,
                },
              },
            },
          },
        },
      });
      if (!medicine) {
        throw new TRPCError({
          message: "Medicine Not Found",
          code: "NOT_FOUND",
        });
      }
      return medicine;
    }),
});
