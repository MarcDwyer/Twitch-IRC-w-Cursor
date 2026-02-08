import { useState } from "react";
import { useChat } from "../../hooks/useChat.ts";

type Props = {
  ws: WebSocket;
  channel: string;
};

export function Chat({ ws, channel }: Props) {
  const [input, setInput] = useState("");
  const { messages, send } = useChat(ws, channel);
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="text-purple-400 font-semibold">
              {msg.username}
            </span>
            <span className="text-zinc-500">:</span>
            <span className="text-zinc-300">{msg.message}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
          setInput("");
        }}
        className="px-3 py-2 border-t border-zinc-700"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
        />
      </form>
    </div>
  );
}
