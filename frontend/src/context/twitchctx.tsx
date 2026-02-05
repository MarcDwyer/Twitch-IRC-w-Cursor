import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CLIENT_ID_KEY, OAUTH_KEY } from "../util/storageKeys.ts";
import { TwitchAPI } from "../lib/twitch_api/twitch_api.ts";

export type OAuth = {
  token: string | null;
  validated: boolean;
  error: string | null;
};

export type TwitchContextType = {
  oauth: OAuth;
  _setOAuth: Dispatch<SetStateAction<OAuth>>;
  twitchAPI: TwitchAPI | null;
  _setTwitchAPI: Dispatch<SetStateAction<TwitchAPI | null>>;
  clientID: string | null;
  _setClientID: Dispatch<SetStateAction<string | null>>;
};
const InitialOAuth = {
  token: null,
  validated: false,
  error: null,
};
const InitialTwitchState: TwitchContextType = {
  clientID: null,
  oauth: InitialOAuth,
  twitchAPI: null,
  _setTwitchAPI: () => {},
  _setClientID: () => {},
  _setOAuth: () => {},
};

export const TwitchContext = createContext<TwitchContextType>(
  InitialTwitchState,
);

export const TwitchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [clientID, _setClientID] = useState<string | null>(null);
  const [oauth, _setOAuth] = useState<OAuth>(InitialOAuth);
  const [twitchAPI, _setTwitchAPI] = useState<TwitchAPI | null>(null);

  useEffect(() => {
    const lsClientID = localStorage.getItem(CLIENT_ID_KEY);
    const lsToken = localStorage.getItem(OAUTH_KEY);
    if (lsClientID && !clientID) _setClientID(lsClientID);
    if (lsToken && !oauth.token) _setOAuth({ ...oauth, token: lsToken });
  }, [_setClientID, _setOAuth, clientID, oauth]);
  return (
    <TwitchContext.Provider
      value={{
        clientID,
        _setClientID,
        oauth,
        _setOAuth,
        twitchAPI,
        _setTwitchAPI,
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

export const useTwitchCtx = () => {
  const twitch = useContext(TwitchContext);
  return twitch;
};

export const useTwitchCtxActions = () => {
  const { _setClientID, _setOAuth } = useContext(TwitchContext);

  const logout = () => {
    localStorage.removeItem(OAUTH_KEY);
    localStorage.removeItem(CLIENT_ID_KEY);
    _setClientID(null);
    _setOAuth(InitialOAuth);
  };

  return {
    logout,
  };
};
