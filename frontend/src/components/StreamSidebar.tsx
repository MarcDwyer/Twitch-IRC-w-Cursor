import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

type Props = {
  streams: Stream[] | null;
  onClick?: (stream: Stream) => void;
};

export function StreamSidebar({ streams, onClick }: Props) {
  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-700 flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Followed Channels
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {streams === null
          ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex items-center gap-3 px-4 py-2 animate-pulse"
            >
              <div className="w-9 h-9 rounded bg-zinc-700 flex-shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 w-24 bg-zinc-700 rounded" />
                <div className="h-2.5 w-16 bg-zinc-700 rounded" />
              </div>
              <div className="h-2.5 w-8 bg-zinc-700 rounded flex-shrink-0" />
            </div>
          ))
          : (
            <>
              {streams.length === 0 && (
                <p className="text-zinc-500 text-sm px-4 py-3">
                  No live channels
                </p>
              )}
              {streams.map((stream) => (
                <button
                  key={stream.id}
                  type="button"
                  onClick={() => onClick?.(stream)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={stream.thumbnail_url
                        .replace("{width}", "70")
                        .replace("{height}", "39")}
                      alt={stream.user_name}
                      className="w-9 h-9 rounded object-cover"
                    />
                    <span className="absolute -bottom-1 -left-1 bg-red-600 text-white text-xs font-bold px-0.5 rounded leading-tight">
                      LIVE
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-zinc-100 text-sm font-medium truncate">
                      {stream.user_name}
                    </p>
                    <p className="text-zinc-400 text-xs truncate">
                      {stream.game_name}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-zinc-400 text-xs">
                      {stream.viewer_count >= 1000
                        ? `${(stream.viewer_count / 1000).toFixed(1)}K`
                        : stream.viewer_count.toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
      </div>
    </aside>
  );
}
