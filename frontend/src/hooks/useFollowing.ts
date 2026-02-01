import { useCallback, useEffect, useState } from "react";
import { createTwitchAPI, TwitchAPI } from "../lib/twitch_api/twitch_api.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useCredentials } from "../context/credentials.tsx";

export function useFollowing(refreshMins: number) {
  const {
    oauth: { token },
    clientID,
  } = useCredentials();
  const [following, setFollowing] = useState<Stream[] | null>(null);
  const [twitchAPI, setTwitchAPI] = useState<TwitchAPI | null>(null);

  const getFollowing = useCallback(() => {
    if (!twitchAPI) return;
    console.log("refreshing following");
    twitchAPI
      ?.getLiveFollowedChannels()
      .then((resp) => setFollowing(resp.data));
  }, [twitchAPI, setFollowing]);

  useEffect(() => {
    if (!twitchAPI && clientID && token) {
      createTwitchAPI(clientID, token).then((api) => setTwitchAPI(api));
    }
  }, [clientID, token, setTwitchAPI, twitchAPI]);

  useEffect(() => {
    if (!following && twitchAPI) {
      getFollowing();
    }
  }, [following, getFollowing]);

  useEffect(() => {
    let interval: number;
    if (twitchAPI) {
      interval = setInterval(getFollowing, refreshMins * 60 * 1000);
    }
    return function () {
      if (interval) {
        clearInterval(interval);
        console.log("cleared following");
      }
    };
  }, [getFollowing]);

  return { twitchAPI, following };
}
