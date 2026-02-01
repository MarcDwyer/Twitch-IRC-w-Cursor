import { useState } from "react";
import { useCredentialsActions } from "../context/credentials.tsx";

export function ClientIDPage() {
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");
  const { setClientID } = useCredentialsActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId.trim()) {
      setError("Please enter your Twitch Client ID");
      return;
    }

    // Basic validation - Twitch Client IDs are typically 30 characters
    if (clientId.trim().length < 10) {
      setError("Invalid Client ID format");
      return;
    }

    setError("");
    setClientID(clientId);
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
          <h1 className="text-2xl font-bold text-zinc-100">Twitch Login</h1>
        </div>

        <p className="text-zinc-400 text-center mb-8 leading-relaxed">
          Enter your Twitch Client ID to continue. You'll need to create an
          application in the Twitch Developer Console to get one.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="clientId"
              className="text-sm font-semibold text-zinc-100"
            >
              Client ID
            </label>
            <input
              type="text"
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter your Twitch Client ID"
              autoComplete="off"
              className="px-4 py-3 rounded-md border-2 border-zinc-700 bg-zinc-950 text-zinc-100 text-base placeholder-zinc-500 transition-colors duration-200 focus:outline-none focus:border-purple-500"
            />
            {error && (
              <span className="text-red-400 text-sm mt-1">{error}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white py-3 px-6 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 mt-2 hover:bg-purple-700"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-zinc-700">
          <p className="text-zinc-400 text-sm mb-2">Don't have a Client ID?</p>
          <a
            href="https://dev.twitch.tv/console/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 font-medium hover:text-purple-400 hover:underline"
          >
            Generate one at Twitch Developer Console →
          </a>
        </div>
      </div>
    </div>
  );
}
