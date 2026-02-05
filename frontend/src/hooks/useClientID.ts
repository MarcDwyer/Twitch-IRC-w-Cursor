import { useCallback } from "react";
import { useTwitchCtx } from "../context/twitchctx.tsx";
import { CLIENT_ID_KEY } from "../util/storageKeys.ts";

export const useClientID = () => {
  const { clientID, _setClientID } = useTwitchCtx();

  const setClientID = useCallback(
    (newClientID: string | null) => {
      if (newClientID) {
        localStorage.setItem(CLIENT_ID_KEY, newClientID);
      } else {
        localStorage.removeItem(CLIENT_ID_KEY);
      }
      _setClientID(newClientID);
    },
    [_setClientID],
  );

  return {
    clientID,
    setClientID,
  };
};
