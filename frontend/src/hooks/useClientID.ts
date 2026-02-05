import { useCallback, useContext } from "react";
import { CredentialsContext } from "../context/credentials.tsx";
import { CLIENT_ID_KEY } from "../util/storageKeys.ts";

export const useClientID = () => {
  const { credentials, setCredentials } = useContext(CredentialsContext);

  const setClientID = useCallback(
    (clientID: string | null) => {
      if (clientID) {
        localStorage.setItem(CLIENT_ID_KEY, clientID);
      } else {
        localStorage.removeItem(CLIENT_ID_KEY);
      }
      setCredentials((prevState) => ({ ...prevState, clientID }));
    },
    [setCredentials],
  );

  return {
    clientID: credentials.clientID,
    setClientID,
  };
};
