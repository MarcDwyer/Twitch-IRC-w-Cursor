import { Dashboard } from "./pages/Dashboard/Dashboard.tsx";
import { useTwitchCtx } from "./context/twitchctx.tsx";
import { ClientIDPage } from "./pages/ClientID.tsx";
import { OAuthPage } from "./pages/OAuth.tsx";
import { useTwitchAPI } from "./hooks/useTwitchAPI.ts";

function App() {
  const twitch = useTwitchCtx();
  useTwitchAPI();
  console.log({ twitch });
  if (!twitch.clientID) {
    return <ClientIDPage />;
  }
  if (twitch.clientID && !twitch.oauth.validated) {
    return <OAuthPage />;
  }

  return <Dashboard />;
}

export default App;
