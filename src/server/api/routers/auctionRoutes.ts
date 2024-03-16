import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { auction, bid, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { addSeconds } from "date-fns";

export const auctionRoutes = createTRPCRouter({
  signUp: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        userName: z.string(),
        clerkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertUser = await ctx.db.insert(user).values({
        email: input.email,
        name: input.userName,
        clerkId: input.clerkId,
      });

      return insertUser;
    }),
  getDataTableData: protectedProcedure.query(async ({ ctx }) => {
    const auctionData = await ctx.db.query.auction.findMany({
      columns: {
        publicId: true,
        startTime: true,
        name: true,
      },
    });

    if (!auctionData) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auction data not found",
      });
    }

    return auctionData;
  }),
  addAuction: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        startTime: z.date().min(new Date(), {
          message: "Start time must be in the future",
        }),
        picURL: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // console.log("server start time: ", input.startTime.toLocaleString());
      // console.log("server name: ", input.name);
      const utcTime = new Date(
        input.startTime.getTime() + input.startTime.getTimezoneOffset() * 60000,
      );
      const utcEndTime = addSeconds(new Date(utcTime), 30);

      const insertAuction = await ctx.db.insert(auction).values({
        name: input.name,
        startTime: utcTime,
        endTime: utcEndTime,
        picURL: input.picURL,
        description: input.description,
      });

      revalidatePath("/auction");

      return insertAuction;
    }),
  getEndTime: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const auctionData = await ctx.db.query.auction.findFirst({
        where: eq(auction.publicId, input.publicId),
      });

      if (!auctionData) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Auction data not found",
        });
      }

      return auctionData.endTime;
    }),
  placeBid: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
        bidAmount: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const auctionData = await ctx.db.query.auction.findFirst({
        where: eq(auction.publicId, input.publicId),
      });

      const userInfo = await ctx.db.query.user.findFirst({
        where: eq(user.clerkId, ctx.user.userId),
      });

      if (!auctionData) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Auction data not found",
        });
      }

      if (!userInfo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      await ctx.db
        .insert(bid)
        .values({
          userId: userInfo.id,
          auctionId: auctionData.id,
          price: input.bidAmount,
        })
        .then(async () => {
          await ctx.db.update(auction).set({
            endTime: addSeconds(auctionData.endTime, 30),
          });
        });
    }),
});
