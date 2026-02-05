import { Dashboard } from "./pages/Dashboard.tsx";
import { useCredentials } from "./context/credentials.tsx";
import { ClientIDPage } from "./pages/ClientID.tsx";
import { OAuthPage } from "./pages/OAuth.tsx";

function App() {
  const credentials = useCredentials();
  if (!credentials.clientID) {
    return <ClientIDPage />;
  }
  if (credentials.clientID && !credentials.oauth.validated) {
    return <OAuthPage />;
  }

  return <Dashboard />;
}

export default App;
