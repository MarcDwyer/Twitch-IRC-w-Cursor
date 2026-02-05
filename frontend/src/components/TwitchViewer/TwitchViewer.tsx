import { useEffect, useState } from "react";
import { IRCConnectionState } from "../../hooks/useTwitchIRC.ts";
import { TwitchIRC } from "../../lib/irc/irc.ts";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { Channel, ChatMessageEvent } from "../../lib/irc/channel.ts";
import { Chat } from "../Chat.tsx";
import { useTwitchAPI } from "../../hooks/useTwitchAPI.ts";

import "./TwitchViewer.css";

type Props = {
  stream: Stream;
  twitchIRC: TwitchIRC | null;
  connectionState: IRCConnectionState;
  close: (stream: Stream) => void;
};

export function TwitchViewer(
  { stream, twitchIRC, connectionState, close }: Props,
) {
  const [messages, setMessages] = useState<ChatMessageEvent[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const twitchAPI = useTwitchAPI();

  const embedUrl =
    `https://player.twitch.tv/?channel=${stream.user_login}&parent=${location.hostname}`;

  const addMsg = (msg: string) => {
    const msgEvt: ChatMessageEvent = {
      username: twitchAPI?.userInfo.display_name ?? "",
      content: msg,
      channel: channel?.name ?? "",
    };
    setMessages([...messages, msgEvt]);
  };

  useEffect(() => {
    if (!channel && connectionState === "authenticated" && twitchIRC) {
      twitchIRC.join(stream.user_login);
      twitchIRC.addEventListener("onjoin", ({ channel }) => {
        setChannel(channel);
      });
    }
  }, [connectionState, twitchIRC, setChannel, channel]);

  useEffect(() => {
    if (channel) {
      channel.setEventListener("PRIVMSG", (msg) => {
        setMessages([...messages, msg]);
      });
    }
  }, [channel, messages, setMessages]);

  useEffect(() => {
    return function () {
      if (channel) {
        channel.part();
      }
    };
  }, [channel]);

  return (
    <div className="twitch-viewer-container bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title={`${stream.user_name}'s stream`}
        />
        <button
          type="button"
          onClick={() => close(stream)}
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
        {channel && (
          <Chat messages={messages} channel={channel} addMsg={addMsg} />
        )}
      </div>
    </div>
  );
}
