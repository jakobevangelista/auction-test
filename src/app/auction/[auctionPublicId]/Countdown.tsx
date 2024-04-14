"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { api } from "@/trpc/react";

interface CountdownProps {
  publicId: string;
  endTime: Date;
}

export default function Countdown({ endTime, publicId }: CountdownProps) {
  // trpc getendtime and make realtime with websockets
  const { data } = api.auction.getEndTime.useQuery(
    {
      publicId,
    },
    {
      initialData: endTime,
    },
  );

  const localTime = new Date(data.getTime() - data.getTimezoneOffset() * 60000);

  const [days, hours, minutes, seconds] = useCountdown(localTime);
  return (
    <>
      {days + hours + minutes + seconds <= 0 ? (
        <div>Ended</div>
      ) : (
        <div className="flex flex-col">
          <div>
            {days}d {hours}h {minutes}m {seconds}s
          </div>
        </div>
      )}
    </>
  );
}
