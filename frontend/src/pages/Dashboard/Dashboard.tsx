import { useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";
import { StreamSidebar } from "../../components/StreamSidebar.tsx";
import { useFollowing } from "../../hooks/useFollowing.ts";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { TwitchViewer } from "../../components/TwitchViewer/TwitchViewer.tsx";
import { useTwitchIRC } from "../../hooks/useTwitchIRC.ts";

import "./Dashboard.css";

export function Dashboard() {
  const [viewing, setViewing] = useState<Set<Stream>>(new Set());
  const following = useFollowing();
  const [twitchIRC, connState] = useTwitchIRC();

  return (
    <div className="dashboard-container">
      <Navbar header="Twitch Dashboard" />
      <div className="viewer-container">
        <StreamSidebar
          streams={following}
          onClick={(stream) => {
            if (!viewing.has(stream)) {
              setViewing(new Set(viewing).add(stream));
            }
          }}
        />
        <main className="flex-1 p-4 overflow-y-auto min-h-0 h-full">
          {viewing.size === 0
            ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-500">
                  Select a channel from the sidebar to join
                </p>
              </div>
            )
            : (
              <div className="viewing-list">
                {Array.from(viewing).map((stream) => (
                  <div key={stream.id} className="joined-item">
                    <TwitchViewer
                      stream={stream}
                      twitchIRC={twitchIRC}
                      connectionState={connState}
                      close={(s) => {
                        const updated = new Set(viewing);
                        updated.delete(s);
                        setViewing(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
