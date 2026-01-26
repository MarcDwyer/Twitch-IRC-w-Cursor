import { load } from "jsr:@std/dotenv@^0.221.0";
import { createTwitchAPI } from "./twitch_api/twitch_api.ts";

const {TWITCH_CLIENT_ID, TWITCH_OAUTH_TOKEN} = await load();


try { 
    const twitchAPI = await createTwitchAPI(TWITCH_CLIENT_ID, TWITCH_OAUTH_TOKEN);
    const liveFollowedStreams = await twitchAPI.getLiveFollowedChannels(twitchAPI.userInfo.id);
    const streamNames = liveFollowedStreams.data.map((stream) => stream.user_name);
    console.log({streamNames});
}catch (error) {
    console.error(error);
}



