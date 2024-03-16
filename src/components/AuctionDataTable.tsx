"use client";

import { api } from "@/trpc/react";
import { columns, type Auction } from "../app/auction/columns";
import { DataTable } from "../app/auction/data-table";

interface AuctionDataTableProps {
  initialData: {
    name: string;
    publicId: string;
    startTime: Date;
  }[];
}

export default function AuctionDataTable({
  initialData,
}: AuctionDataTableProps) {
  const { data } = api.auction.getDataTableData.useQuery(undefined, {
    initialData,
  });

  const tableData = data as Auction[];

  return (
    <>
      <DataTable columns={columns} data={tableData} />
    </>
  );
}
