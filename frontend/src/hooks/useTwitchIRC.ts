import { useCallback, useEffect, useState } from "react";
import { useTwitchCtx } from "../context/twitchctx.tsx";
import { handleMessage } from "../util/handleMessage.ts";

export type IRCConnectionState = "disconnected" | "pending" | "authenticated";

export function useTwitchIRC() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<IRCConnectionState>("disconnected");
  const { oauth, twitchAPI } = useTwitchCtx();

  const connect = useCallback(() => {
    const tmpWs = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    tmpWs.onopen = () => {
      if (!oauth.token || !twitchAPI) {
        throw new Error("No token or twitchAPI not created");
      }

      setStatus("pending");
      tmpWs.send("CAP REQ :twitch.tv/tags");
      tmpWs.send(`PASS oauth:${oauth.token}`);
      tmpWs.send(`NICK ${twitchAPI.userInfo.login}`);
      setWs(tmpWs);
    };
  }, [setWs, oauth, twitchAPI, setStatus]);

  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.addEventListener("message", ({ data }: MessageEvent<string>) =>
      handleMessage(data, {
        "001": () => setStatus("authenticated"),
        PING: () => ws.send("PONG :tmi.twitch.tv"),
      }),
    );
    ws.addEventListener("error", (err) => {
      console.error("WebSocket error:", err);
    });
    ws.addEventListener("close", (err) => {
      console.log("IRC:", { err });
      console.log("Disconnected from Twitch IRC");
      setStatus("disconnected");
    });
  }, [ws]);

  useEffect(() => {
    if (status === "disconnected") connect();
  }, [connect, status]);

  return {
    connect,
    status,
    ws,
  };
}
