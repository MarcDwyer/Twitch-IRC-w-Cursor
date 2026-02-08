export type PrivMsgEvt = {
  message: string;
  username: string;
  channel: string;
};

export type HandleMsgCallbacks = {
  PRIVMSG?: (msg: PrivMsgEvt) => void;
  JOIN?: (channelName: string) => void;
  PART?: () => void;
  "001"?: () => void;
  PING?: () => void;
};

export function getCommand(line: string): keyof HandleMsgCallbacks {
  if (line.startsWith("PING")) return "PING";
  return line.split(" ")[1] as keyof HandleMsgCallbacks;
}

export function handleMessage(
  data: string,
  cbs: HandleMsgCallbacks = {},
): void {
  const lines = data.split("\r\n").filter(Boolean);

  for (const line of lines) {
    const command = getCommand(line);
    if (!cbs[command]) {
      continue;
    }
    switch (command) {
      case "PRIVMSG": {
        const match = data.match(
          /:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG (#\w+) :(.+)/,
        );
        if (match) {
          const [, username, channel, message] = match;
          const msg: PrivMsgEvt = {
            username,
            message,
            channel,
          };
          cbs.PRIVMSG?.(msg);
        }
        break;
      }
      case "JOIN":
        {
          const match = data.match(
            /:(\w+)!\w+@\w+\.tmi\.twitch\.tv JOIN (#\w+)/,
          );
          if (match) {
            const [, , channelName] = match;

            cbs[command](channelName);
          }
        }
        break;
      default: {
        cbs[command]();
      }
    }
  }
}
