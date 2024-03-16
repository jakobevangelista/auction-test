"use client";

import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Auction = {
  name: string;
  publicId: string;
  startTime: Date;
};

export const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: (row) => {
      return new Date(row.getValue<Date>()).toLocaleString();
    },
  },
  {
    accessorKey: "publicId",
    header: "Public ID",
  },
];
