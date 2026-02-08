import { useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";
import { StreamSidebar } from "../../components/StreamSidebar.tsx";
import { useFollowing } from "../../hooks/useFollowing.ts";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { TwitchViewer } from "../../components/TwitchViewer/TwitchViewer.tsx";
import { useTwitchIRC } from "../../hooks/useTwitchIRC.ts";

export function Dashboard() {
  const [viewing, setViewing] = useState<Set<Stream>>(new Set());
  const following = useFollowing();
  const { ws } = useTwitchIRC();
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar header="Twitch Dashboard" />
      <div className="flex flex-nowrap flex-1 min-h-0 w-full">
        <StreamSidebar
          streams={following}
          onClick={(stream) => {
            if (!viewing.has(stream)) {
              setViewing(new Set(viewing).add(stream));
            }
          }}
        />
        <main className="w-full h-full bg-zinc-800 overflow-y-scroll">
          {viewing.size === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">
                Select a channel from the sidebar to join
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-full auto-rows-fr gap-4">
              {Array.from(viewing).map((stream) => (
                <div key={stream.id}>
                  <TwitchViewer
                    stream={stream}
                    ws={ws}
                    part={(stream, channelName) => {
                      const updated = new Set(viewing);
                      updated.delete(stream);
                      setViewing(updated);
                      ws?.send(`PART ${channelName}`);
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
