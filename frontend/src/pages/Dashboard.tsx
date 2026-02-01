import BlurredText from "../components/BlurredText.tsx";
import { CopyButton } from "../components/CopyButton.tsx";
import { LogoutBtn } from "../components/LogoutBtn.tsx";
import { useCredentials, useOAuth } from "../context/credentials.tsx";

export function Dashboard() {
  const credentials = useCredentials();
  const oauth = useOAuth();
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      <header className="flex justify-between items-center px-8 py-4 bg-zinc-800 border-b border-zinc-700">
        <h1 className="text-2xl font-bold text-zinc-100">Twitch Dashboard</h1>
        <LogoutBtn />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-zinc-400 flex items-center gap-2">
              Client ID: <BlurredText text={credentials.clientID ?? ""} />
              <CopyButton text={credentials.clientID ?? ""} />
            </p>
            <p className="text-zinc-400 mt-2 flex items-center gap-2">
              OAuth Token: <BlurredText text={oauth.token ?? ""} />
              <CopyButton text={oauth.token ?? ""} />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Streams
              </h3>
              <p className="text-zinc-400 text-sm">
                View and manage your streams
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Analytics
              </h3>
              <p className="text-zinc-400 text-sm">
                Track your channel performance
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Settings
              </h3>
              <p className="text-zinc-400 text-sm">
                Configure your preferences
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
