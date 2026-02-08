import { useCallback, useEffect, useState } from "react";
import { handleMessage, PrivMsgEvt } from "../util/handleMessage.ts";
import { useUserInfo } from "./useUserInfo.ts";

export function useChat(ws: WebSocket, channel: string) {
  const [messages, setMessages] = useState<PrivMsgEvt[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const userInfo = useUserInfo();

  const send = useCallback(
    (msg: string) => {
      if (!userInfo || !ws) return;

      const privMsg: PrivMsgEvt = {
        username: userInfo.display_name ?? "",
        message: msg,
        channel,
      };
      setMessages([...messages, privMsg]);
      ws.send(`PRIVMSG ${userInfo.login} :${msg}`);
    },
    [setMessages],
  );

  useEffect(() => {
    const ref = ({ data }: MessageEvent<string>) =>
      handleMessage(data, {
        PRIVMSG: (msg) => {
          if (msg.channel === channel) setMessages([...messages, msg]);
        },
        JOIN: (chanName) => {
          if (chanName === channel) setJoined(true);
        },
      });
    ws.addEventListener("message", ref);

    return function () {
      ws.removeEventListener("message", ref);
    };
  }, [ws, channel, setJoined, setMessages, messages]);

  useEffect(() => {
    if (!joined) {
      ws.send(`Join ${channel}`);
    }
  }, [joined, ws, channel]);

  return {
    channel,
    messages,
    joined,
    send,
  };
}
