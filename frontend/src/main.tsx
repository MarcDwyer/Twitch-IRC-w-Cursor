import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TwitchProvider } from "./context/twitchctx.tsx";

createRoot(document.getElementById("root")!).render(
  <TwitchProvider>
    <App />
  </TwitchProvider>,
);
