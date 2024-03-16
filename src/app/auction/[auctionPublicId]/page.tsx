import { db } from "@/server/db";
import { auction } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Countdown from "./Countdown";
import BIdButton from "./BIdButton";

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
              <Countdown
                endTime={auctionInfo.endTime}
                publicId={params.auctionPublicId}
              />
            </div>
          </div>
          <BIdButton />
        </div>
      </div>
    </>
  );
}
