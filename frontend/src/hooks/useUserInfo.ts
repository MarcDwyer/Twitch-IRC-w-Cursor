import { useTwitchCtx } from "../context/twitchctx.tsx";

export function useUserInfo() {
  const { twitchAPI } = useTwitchCtx();

  return twitchAPI?.userInfo;
}
