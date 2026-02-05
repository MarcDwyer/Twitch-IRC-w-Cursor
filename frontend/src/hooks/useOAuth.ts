import { OAuth, useTwitchCtx } from "../context/twitchctx.tsx";
import { checkTokenForValidation } from "../lib/oauth.ts";
import { OAUTH_KEY } from "../util/storageKeys.ts";

export const useOAuth = () => {
  const { oauth, _setOAuth } = useTwitchCtx();

  const checkURLForToken = () => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    setOAuth({ token: accessToken });
  };

  const validateToken = async () => {
    console.log({ oauth });
    if (!oauth.token) {
      return;
    }
    const isValid = await checkTokenForValidation(oauth.token);

    if (isValid) {
      localStorage.setItem(OAUTH_KEY, oauth.token);
      setOAuth({ validated: isValid });
    } else {
      localStorage.removeItem(OAUTH_KEY);
      setOAuth({ validated: false, token: null });
    }
  };

  const setOAuth = (newOAuth: Partial<OAuth>) =>
    _setOAuth((prev) => ({
      ...prev,
      ...newOAuth,
    }));

  return {
    oauth,
    validateToken,
    checkURLForToken,
  };
};
