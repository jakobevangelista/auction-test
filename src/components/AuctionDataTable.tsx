"use client";

import { api } from "@/trpc/react";
import { columns, type Auction } from "../app/auction/columns";
import { DataTable } from "../app/auction/data-table";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

interface AuctionDataTableProps {
  initialData: {
    name: string;
    publicId: string;
    startTime: Date;
  }[];
}

type AuctionWebsocket = {
  name: string;
  startTime: Date;
  endTime: Date;
  picURL: string | undefined;
  description: string | undefined;
};

export default function AuctionDataTable({
  initialData,
}: AuctionDataTableProps) {
  const { data } = api.auction.getDataTableData.useQuery(undefined, {
    initialData,
  });
  const utils = api.useUtils();

  const tableData = data as Auction[];

  useEffect(() => {
    pusherClient.subscribe("auction");

    pusherClient.bind("new-auction", async () => {
      await utils.auction.getDataTableData.invalidate();
    });

    return () => {
      pusherClient.unsubscribe("auction");
    };
  }, [utils.auction.getDataTableData]);

  return (
    <>
      <DataTable columns={columns} data={tableData} />
    </>
  );
}
