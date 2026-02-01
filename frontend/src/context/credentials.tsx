import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
} from "react";

import { checkTokenForValidation } from "../lib/twitch.ts";

const CLIENT_ID_KEY = "twitch_client_id";
const OAUTH_KEY = "twitch_oauth";

export type OAuth = {
  token: string | null;
  validated: boolean;
  error: string | null;
};
export type CredentialsState = {
  clientID: string | null;
  oauth: OAuth;
};

export type CredentialsContextType = {
  credentials: CredentialsState;
  setCredentials: Dispatch<SetStateAction<CredentialsState>>;
};

const InitialCredentialsState: CredentialsState = {
  clientID: localStorage.getItem(CLIENT_ID_KEY),
  oauth: {
    token: localStorage.getItem(OAUTH_KEY),
    validated: false,
    error: null,
  },
};

export const CredentialsContext = createContext<CredentialsContextType>({
  credentials: InitialCredentialsState,
  setCredentials: () => {},
});

export const CredentialsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [credentials, setCredentials] = useState<CredentialsState>(
    InitialCredentialsState,
  );

  return (
    <CredentialsContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </CredentialsContext.Provider>
  );
};

export const useCredentials = () => {
  const { credentials } = useContext(CredentialsContext);
  return credentials;
};

export const useCredentialsActions = () => {
  const { setCredentials, credentials } = useContext(CredentialsContext);

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

  // const setOAuthToken = useCallback(
  //   (token: string | null) => {
  //     if (token) {
  //       localStorage.setItem(OAUTH_KEY, token);
  //     } else {
  //       localStorage.removeItem(OAUTH_KEY);
  //     }
  //     setCredentials((prevState) => ({
  //       ...prevState,
  //       oauth: { token, validated: false },
  //     }));
  //   },
  //   [setCredentials],
  // );

  const logout = () => {
    localStorage.removeItem(OAUTH_KEY);
    localStorage.removeItem(CLIENT_ID_KEY);
    setCredentials({
      clientID: null,
      oauth: { token: null, validated: false, error: null },
    });
  };

  const setOAuth = (oauth: Partial<OAuth>) =>
    setCredentials((prev) => ({
      ...prev,
      oauth: { ...prev.oauth, ...oauth },
    }));

  return {
    setClientID,
    logout,
    setOAuth,
  };
};
export const useOAuth = () => {
  const {
    credentials: { oauth },
  } = useContext(CredentialsContext);
  return oauth;
};
export const useOAuthActions = () => {
  const {
    credentials: { oauth },
  } = useContext(CredentialsContext);
  const { setOAuth } = useCredentialsActions();

  const checkURLForToken = () => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    setOAuth({ token: accessToken });
  };
  const validateToken = async () => {
    console.log({ oauth });
    if (!oauth.token) {
      return;
    }
    const isValid = await checkTokenForValidation(oauth.token);
    console.log({ isValid });
    if (isValid) {
      localStorage.setItem(OAUTH_KEY, oauth.token);
      setOAuth({ validated: isValid });
    } else {
      localStorage.removeItem(OAUTH_KEY);
      setOAuth({ validated: false, token: null });
    }
  };

  return {
    validateToken,
    checkURLForToken,
  };
};
