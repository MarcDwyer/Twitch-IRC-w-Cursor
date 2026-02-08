import { useEffect } from "react";
import { useTwitchCtx } from "../context/twitchctx.tsx";
import { createTwitchAPI } from "../lib/twitch_api/twitch_api.ts";

export function useTwitchAPI() {
  const {
    oauth: { token },
    clientID,
    twitchAPI,
    _setTwitchAPI,
  } = useTwitchCtx();

  useEffect(() => {
    if (!twitchAPI && clientID && token) {
      createTwitchAPI(clientID, token).then((api) => _setTwitchAPI(api));
    }
  }, [clientID, token, _setTwitchAPI, twitchAPI]);
  return twitchAPI;
}
