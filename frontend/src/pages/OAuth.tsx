import { useEffect } from "react";
import { useCredentials } from "../context/credentials.tsx";
import { useOAuth } from "../hooks/useOAuth.ts";

const REDIRECT_URI = "http://localhost:5173/oauth/callback";
const SCOPES = ["chat:read", "chat:edit", "user:read:follows"];

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function OAuthPage() {
  const { clientID } = useCredentials();
  const { oauth, checkURLForToken, validateToken } = useOAuth();

  useEffect(() => {
    if (!oauth.token) {
      checkURLForToken();
    }
  }, [oauth.token]);

  useEffect(() => {
    if (oauth.token && !oauth.validated) {
      validateToken();
    }
  }, [oauth]);

  const handleGenerateToken = () => {
    const state = generateState();
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      response_type: "token",
      client_id: clientID as string,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(" "),
      state: state,
    });

    const authUrl =
      `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
    location.href = authUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-900">
      <div className="bg-zinc-800 rounded-xl p-10 max-w-md w-full shadow-lg">
        <div className="text-center mb-6">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            viewBox="0 0 256 268"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741h-63.992l-34.898 34.903v-34.903H40.717V23.263zm63.983 94.636h23.275v-69.81H104.7v69.81zm63.982 0h23.27v-69.81h-23.27v69.81z"
              fill="#9146FF"
            />
          </svg>
          <h1 className="text-2xl font-bold text-zinc-100">OAuth Token</h1>
        </div>

        <p className="text-zinc-400 text-center mb-8 leading-relaxed">
          Enter your OAuth token or generate a new one to authenticate with the
          Twitch API.
        </p>

        <button
          type="button"
          onClick={handleGenerateToken}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-purple-700"
        >
          Generate New Token
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-zinc-500 text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-700" />
        </div>

        <div className="text-center mt-6 pt-6 border-t border-zinc-700">
          <p className="text-zinc-400 text-sm mb-2">Need help with OAuth?</p>
          <a
            href="https://dev.twitch.tv/docs/authentication"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 font-medium hover:text-purple-400 hover:underline"
          >
            View Twitch Authentication Docs →
          </a>
        </div>
      </div>
    </div>
  );
}
