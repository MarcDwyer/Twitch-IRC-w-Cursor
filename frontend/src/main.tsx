import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CredentialsProvider } from "./context/credentials.tsx";

createRoot(document.getElementById("root")!).render(
  <CredentialsProvider>
    <App />
  </CredentialsProvider>,
);
