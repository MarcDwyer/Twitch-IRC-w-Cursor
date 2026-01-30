import { load } from "jsr:@std/dotenv@^0.221.0";
import { createTwitchAPI } from "./twitch_api/twitch_api.ts";
import { TwitchIRC } from "./irc/irc.ts";

try {
  const env = await load({
    envPath: ".env",
  });
  console.log(env);
  const { TWITCH_CLIENT_ID, TWITCH_OAUTH_TOKEN } = env;
  const twitchAPI = await createTwitchAPI(TWITCH_CLIENT_ID, TWITCH_OAUTH_TOKEN);
  const liveFollowedStreams = await twitchAPI.getLiveFollowedChannels();

  const streamNames = liveFollowedStreams.data.map(
    (stream) => stream.user_name,
  );

  const irc = new TwitchIRC(TWITCH_OAUTH_TOKEN, "roystang_");

  await irc.connect();

  for (const streamName of streamNames) {
    const channel = await irc.join(streamName);
    console.log(`Joined ${streamName}`);
    channel.addEventListener("MENTIONS", (data) => {
      console.log(
        `#${data.channel}: ${data.username} mentioned you: ${data.content}`,
      );
    });
    channel.send("hey everyone im gluten free");
  }
} catch (error) {
  console.error(error);
}
