"use client";
import { Button } from "@/components/ui/button";
import { auction } from "@/server/db/schema";
import { api } from "@/trpc/react";

interface BidButtonProps {
  auctionPublicId: string;
}

export default function BidButton({ auctionPublicId }: BidButtonProps) {
  const addBid = api.auction.placeBid.useMutation();

  const handleClick = () => {
    addBid.mutate({
      bidAmount: 10,
      publicId: auctionPublicId,
    });
  };

  return (
    <>
      <Button onClick={handleClick}>Bid +10</Button>
    </>
  );
}
