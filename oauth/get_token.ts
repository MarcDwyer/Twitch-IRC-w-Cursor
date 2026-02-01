#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-run --allow-env

import { load } from "jsr:@std/dotenv@^0.221.0";
import { generateState, openBrowser } from "../utils.ts";

const env = await load({
  envPath: "../.env",
});
const clientId = env["TWITCH_CLIENT_ID"];
const state = generateState();
const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=http://localhost:3000&scope=chat%3Aread%20chat%3Aedit%20user%3Aread%3Afollows&state=${state}`;

const callbackHtml = await Deno.readTextFile("callback.html");

const server = Deno.serve(
  {
    port: 3000,
    onListen: () => openBrowser(authUrl),
  },
  async (req) => {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/hash") {
      const body = await req.json();

      if (body.state !== state) {
        return new Response("State mismatch", { status: 403 });
      }

      if (body.access_token) {
        const token = body.access_token;
        const envContent = await Deno.readTextFile("../.env");
        const updated = envContent.includes("TWITCH_OAUTH_TOKEN")
          ? envContent.replace(
              /TWITCH_OAUTH_TOKEN=.*/g,
              `TWITCH_OAUTH_TOKEN=${token}`,
            )
          : `${envContent.trim()}\nTWITCH_OAUTH_TOKEN=${token}\n`;

        await Deno.writeTextFile("../.env", updated);

        setTimeout(() => {
          server.shutdown();
          Deno.exit(0);
        }, 1000);

        return new Response("Token saved! You can close this window.", {
          status: 200,
        });
      }
    }

    return new Response(callbackHtml, {
      headers: { "Content-Type": "text/html" },
    });
  },
);
http://localhost:5173/?error=redirect_mismatch&error_description=Parameter+redirect_uri+does+not+match+registered+URI&state=6b9388cc91bd5246cfff881f34610a51
