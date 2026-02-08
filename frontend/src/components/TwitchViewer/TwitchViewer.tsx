import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { BroadcastHandler } from "../../pages/Dashboard/Dashboard.tsx";
import { Chat } from "./Chat.tsx";
import { useMemo } from "react";

type Props = {
  stream: Stream;
  ws: WebSocket | null;
  part: (stream: Stream, channel: string) => void;
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
};

export function TwitchViewer({ stream, part, ws, broadcastHandlers }: Props) {
  const channel = useMemo(() => `#${stream.user_login}`, [stream]);

  const embedUrl = `https://player.twitch.tv/?channel=${stream.user_login}&parent=${location.hostname}`;

  return (
    <div className="flex flex-col h-full w-full bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title={`${stream.user_name}'s stream`}
        />
        <button
          type="button"
          onClick={() => part(stream, channel)}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded p-1 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-700">
          <span className="text-zinc-100 text-sm font-medium">
            {stream.user_name}
          </span>
          <span className="text-zinc-400 text-xs">{stream.game_name}</span>
        </div>
        {ws && (
          <Chat ws={ws} channel={channel} broadcastHandlers={broadcastHandlers} />
        )}
      </div>
    </div>
  );
}
