export type PrivMsgEvt = {
  message: string;
  username: string;
  channel: string;
  color?: string;
};

export type HandleMsgCallbacks = {
  PRIVMSG?: (msg: PrivMsgEvt) => void;
  JOIN?: (channelName: string) => void;
  PART?: () => void;
  "001"?: () => void;
  PING?: () => void;
};

function parseTags(tagStr: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const part of tagStr.split(";")) {
    const eq = part.indexOf("=");
    if (eq !== -1) {
      tags[part.slice(0, eq)] = part.slice(eq + 1);
    }
  }
  return tags;
}

export function getCommand(line: string): keyof HandleMsgCallbacks {
  if (line.startsWith("PING")) return "PING";
  // With tags: @tags :user COMMAND ...  — command is at index 2
  // Without tags: :user COMMAND ...     — command is at index 1
  const parts = line.split(" ");
  if (parts[0].startsWith("@")) return parts[2] as keyof HandleMsgCallbacks;
  return parts[1] as keyof HandleMsgCallbacks;
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
        const match = line.match(
          /(?:@(\S+) )?:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG (#\w+) :(.+)/,
        );
        if (match) {
          const [, tagStr, username, channel, message] = match;
          const tags = tagStr ? parseTags(tagStr) : {};
          const msg: PrivMsgEvt = {
            username: tags["display-name"] || username,
            message,
            channel,
            color: tags["color"] || undefined,
          };
          cbs.PRIVMSG?.(msg);
        }
        break;
      }
      case "JOIN":
        {
          const match = line.match(
            /(?:@\S+ )?:(\w+)!\w+@\w+\.tmi\.twitch\.tv JOIN (#\w+)/,
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
