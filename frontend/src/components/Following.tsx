import { useState } from "react";
import { useFollowing } from "../hooks/useFollowing.ts";

export function Following() {
  const [isVisible, setIsVisible] = useState(true);

  const following = useFollowing();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-100">
          Following Streams {following && `(${following.length})`}
        </h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded transition-colors"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      {isVisible && (
        <div className="max-h-144 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {following &&
              following.length > 0 &&
              following.map((stream) => (
                <a
                  key={stream.id}
                  href={`https://twitch.tv/${stream.user_login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={stream.thumbnail_url
                        .replace("{width}", "440")
                        .replace("{height}", "248")}
                      alt={stream.user_name}
                      className="w-full aspect-video object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                      LIVE
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {stream.viewer_count.toLocaleString()} viewers
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-zinc-100 font-semibold truncate">
                      {stream.user_name}
                    </h3>
                    <p className="text-zinc-400 text-sm truncate">
                      {stream.title}
                    </p>
                    <p className="text-zinc-500 text-sm truncate">
                      {stream.game_name}
                    </p>
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
