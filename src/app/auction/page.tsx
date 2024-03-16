import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { UserButton, currentUser } from "@clerk/nextjs";
import { QueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import AddAuctionButton from "../../components/AddAuctionButton";
import AuctionDataTable from "../../components/AuctionDataTable";
import { type Auction } from "./columns";

async function getAuctionData() {
  return await db.query.auction.findMany({
    columns: {
      publicId: true,
      startTime: true,
      name: true,
    },
  });
}

async function Auction() {
  const clerkUser = await currentUser();
  const queryClient = new QueryClient();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const loggedInUser = await db.query.user.findFirst({
    where: eq(user.clerkId, clerkUser.id),
  });

  if (!loggedInUser) {
    redirect("/onboarding");
  }

  const auctionData = await getAuctionData();

  // await queryClient.prefetchQuery({
  //   queryKey: getQueryKey(api.auction),
  //   queryFn: getAuctionData,
  // });

  return (
    <div className="container py-10">
      <h1 className="mb-4 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Auction
      </h1>
      <UserButton />
      <div className="flex flex-row justify-end">
        <AddAuctionButton />
      </div>
      <div>
        {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <AuctionDataTable initialData={auctionData} />
        {/* </HydrationBoundary> */}
      </div>
    </div>
  );
}

export default Auction;
