import { db } from "@/server/db";
import { auction } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import InteractiveElements from "./InteractiveElements";

interface AuctionPageProps {
  params: {
    auctionPublicId: string;
  };
}
export default async function AuctionPage({ params }: AuctionPageProps) {
  const auctionInfo = await db.query.auction.findFirst({
    where: eq(auction.publicId, params.auctionPublicId),
  });

  if (!auctionInfo) {
    redirect("/auction");
  }

  return (
    <>
      <div className="container py-10">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Auction: {auctionInfo.name}
          </h1>
          <InteractiveElements
            auctionInfo={auctionInfo}
            auctionPublicId={params.auctionPublicId}
          />
        </div>
      </div>
    </>
  );
}
