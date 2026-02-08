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
      if (status !== "disconnected") {
        return;
      }
      setStatus("pending");
      tmpWs.send(`PASS oauth:${oauth.token}`);
      tmpWs.send(`NICK ${twitchAPI?.userInfo.login}`);
      setWs(tmpWs);
    };
  }, [setWs, oauth, twitchAPI, status, setStatus]);

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

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (err) => {
      console.log("IRC:", { err });
      console.log("Disconnected from Twitch IRC");
    };
  }, [ws]);

  useEffect(() => {
    if (!ws) connect();
  }, [ws, connect]);
  console.log({ status });
  return {
    connect,
    status,
    ws,
  };
}
