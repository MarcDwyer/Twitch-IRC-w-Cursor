import type { UserInfo, LiveFollowedStreamsResponse } from "./twitch_api_types.ts";

export async function createTwitchAPI(
  clientId: string,
  oauthToken: string
): Promise<TwitchAPI> {
  const baseUrl = "https://api.twitch.tv/helix";

  const response = await fetch(`${baseUrl}/users`, {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${oauthToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch user info: ${response.status} ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  const userInfo: UserInfo = data.data[0];

  return new TwitchAPI(clientId, oauthToken, userInfo);
}

export class TwitchAPI {
  private clientId: string;
  private oauthToken: string;
  private baseUrl = "https://api.twitch.tv/helix";
  public userInfo: UserInfo;

  constructor(clientId: string, oauthToken: string, userInfo: UserInfo) {
    this.clientId = clientId;
    this.oauthToken = oauthToken;
    this.userInfo = userInfo;
  }

  async getLiveFollowedChannels(
    userId: string,
    first: number = 100,
    after?: string
  ): Promise<LiveFollowedStreamsResponse> {
    const params = new URLSearchParams({
      user_id: userId,
      first: first.toString(),
    });

    if (after) {
      params.append("after", after);
    }

    const response = await fetch(
      `${this.baseUrl}/streams/followed?${params.toString()}`,
      {
        headers: {
          "Client-ID": this.clientId,
          Authorization: `Bearer ${this.oauthToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch live followed streams: ${response.status} ${JSON.stringify(error)}`
      );
    }
    return await response.json() as LiveFollowedStreamsResponse;
  }
}
