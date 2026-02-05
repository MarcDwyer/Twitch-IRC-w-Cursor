import { useFollowing } from "../../hooks/useFollowing.ts";
import { useTwitchIRC } from "../../hooks/useTwitchIRC.ts";
import { StreamSidebar } from "../../components/StreamSidebar.tsx";
import { TwitchViewer } from "../../components/TwitchViewer/TwitchViewer.tsx";
import { useState } from "react";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import "./InteractivePlayer.css";

export function InteractivePlayer() {
  const [twitchIRC, connState] = useTwitchIRC();
  const following = useFollowing();
  const [joined, setJoined] = useState<Set<Stream>>(new Set());
  console.log({ connState });
  return (
    <div className="flex h-screen bg-zinc-900 overflow-hidden">
      <StreamSidebar
        streams={following ?? []}
        onClick={(stream) => {
          if (!joined.has(stream)) {
            setJoined(new Set(joined).add(stream));
          }
        }}
      />
      <main className="flex-1 p-4 overflow-y-auto min-h-0 h-full">
        {joined.size === 0
          ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">
                Select a channel from the sidebar to join
              </p>
            </div>
          )
          : (
            <div className="joined-list">
              {Array.from(joined).map((stream) => (
                <div key={stream.id} className="joined-item">
                  <TwitchViewer
                    stream={stream}
                    twitchIRC={twitchIRC}
                    connectionState={connState}
                    close={(s) => {
                      const updated = new Set(joined);
                      updated.delete(s);
                      setJoined(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
