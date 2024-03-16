"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import AuctionForm from "./AuctionForm";

export default function AddAuctionButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Auction</DialogTitle>
          <DialogDescription>Create a new auction</DialogDescription>
        </DialogHeader>
        <AuctionForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
