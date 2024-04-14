import { env } from "@/env.mjs";
import PusherClient from "pusher-js";

// export const pusherServer = new PusherServer({
//   appId: env.PUSHER_APP_ID,
//   key: env.PUSHER_APP_KEY,
//   secret: env.PUSHER_APP_SECRET,
//   useTLS: true,
//   host: env.PUSHER_HOST,
//   port: "443",
//   cluster: "us2",
// });

/**
 * The following pusher client uses auth, not neccessary for the video chatroom example
 * Only the cluster would be important for that
 * These values can be found after creating a pusher app under
 * @see https://dashboard.pusher.com/apps/<YOUR_APP_ID>/keys
 */

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  wsHost: env.NEXT_PUBLIC_PUSHER_HOST,
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  // encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  cluster: "us2",
});
