export type ValidateTokenResponse = {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
};

export async function checkTokenForValidation(
  accessToken: string,
): Promise<boolean> {
  try {
    const response = await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
