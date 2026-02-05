import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { CLIENT_ID_KEY, OAUTH_KEY } from "../util/storageKeys.ts";

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
  children: ReactNode;
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
  const { setCredentials } = useContext(CredentialsContext);

  const logout = () => {
    localStorage.removeItem(OAUTH_KEY);
    localStorage.removeItem(CLIENT_ID_KEY);
    setCredentials({
      clientID: null,
      oauth: { token: null, validated: false, error: null },
    });
  };

  return {
    logout,
  };
};
