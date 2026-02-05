import { useCallback, useEffect, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

export function useFollowing() {
  const [following, setFollowing] = useState<Stream[] | null>(null);
  const twitchAPI = useTwitchAPI();

  const getFollowing = useCallback(() => {
    if (!twitchAPI) return;
    twitchAPI
      ?.getLiveFollowedChannels()
      .then((resp) => setFollowing(resp.data));
  }, [twitchAPI, setFollowing]);

  useEffect(() => {
    if (!following && twitchAPI) {
      getFollowing();
    }
  }, [following, getFollowing]);

  useEffect(() => {
    let interval: number;
    if (twitchAPI) {
      interval = setInterval(getFollowing, 5 * 60 * 1000);
    }
    return function () {
      if (interval) {
        clearInterval(interval);
        console.log("cleared following");
      }
    };
  }, [getFollowing]);

  return following;
}
