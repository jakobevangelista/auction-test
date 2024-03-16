"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { api } from "@/trpc/react";

interface CountdownProps {
  publicId: string;
  endTime: Date;
}

export default function Countdown({ endTime, publicId }: CountdownProps) {
  // trpc getendtime and make realtime with websockets
  const { data } = api.auction.getEndTime.useQuery({
    publicId,
  });

  const [days, hours, minutes, seconds] = useCountdown(endTime);
  return (
    <>
      <div>
        {days}d {hours}h {minutes}m {seconds}s
      </div>
    </>
  );
}
