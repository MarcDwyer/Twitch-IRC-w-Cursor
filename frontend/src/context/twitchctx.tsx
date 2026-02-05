import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
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
  token: localStorage.getItem(OAUTH_KEY),
  validated: false,
  error: null,
};
const InitialTwitchState: TwitchContextType = {
  clientID: localStorage.getItem(CLIENT_ID_KEY),
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
