"use client";
import { api } from "@/trpc/react";
import BidButton from "./BIdButton";
import Countdown from "./Countdown";
import { auction } from "@/server/db/schema";
import { useEffect } from "react";

interface InteractiveElementsProps {
  auctionInfo: {
    id: number;
    name: string;
    publicId: string;
    createdAt: Date;
    updatedAt: Date | null;
    picURL: string | null;
    description: string | null;
    startTime: Date;
    endTime: Date;
  };

  auctionPublicId: string;
}
export default function InteractiveElements({
  auctionInfo,
  auctionPublicId,
}: InteractiveElementsProps) {
  const { data } = api.auction.getEndTime.useQuery(
    {
      publicId: auctionPublicId,
    },
    {
      initialData: auctionInfo.endTime,
    },
  );

  //   useEffect(() => {}, [])

  return (
    <>
      <div>
        End Time:{" "}
        {new Date(
          auctionInfo.endTime.getTime() -
            new Date().getTimezoneOffset() * 60000,
        ).toLocaleString()}
      </div>

      <div className="flex flex-row justify-center">
        <p>Time remaining: </p>
        <div className="ml-2">
          <Countdown endTime={auctionInfo.endTime} publicId={auctionPublicId} />
        </div>
      </div>
      <BidButton auctionPublicId={auctionPublicId} />
    </>
  );
}
