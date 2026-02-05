import { Dashboard } from "./pages/Dashboard.tsx";
import { useTwitchCtx } from "./context/twitchctx.tsx";
import { ClientIDPage } from "./pages/ClientID.tsx";
import { OAuthPage } from "./pages/OAuth.tsx";
import { useTwitchAPI } from "./hooks/useTwitchAPI.ts";

function App() {
  const twitch = useTwitchCtx();

  // for it's useEffect to initialize TwitchAPI once
  // a clientID and token is detected
  useTwitchAPI();

  if (!twitch.clientID) {
    return <ClientIDPage />;
  }
  if (twitch.clientID && !twitch.oauth.validated) {
    return <OAuthPage />;
  }

  return <Dashboard />;
}

export default App;
