#!/usr/bin/env -S deno run --allow-net

import { Channel } from "./channel.ts";

export class TwitchIRC {
  private ws: WebSocket | null = null;
  private oauthToken: string;
  private username: string;
  private pendingActions: Map<string, (value?: any) => void> = new Map();
  public channels: Map<string, Channel> = new Map();

  constructor(oauthToken: string, username: string) {
    this.oauthToken = oauthToken;
    this.username = username;
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      this.pendingActions.set("auth", resolve);

      const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      this.ws = ws;
      this.ws.onopen = () => {
        console.log("Connected to Twitch IRC");
        this.authenticate();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data, ws);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("Disconnected from Twitch IRC");
      };
    });
  }

  private authenticate(): void {
    if (!this.ws) return;

    this.ws.send(`PASS oauth:${this.oauthToken}`);
    this.ws.send(`NICK ${this.username}`);
  }

  private handleMessage(data: string, ws: WebSocket): void {
    if (data.startsWith("PING")) {
      ws.send("PONG :tmi.twitch.tv");
      return;
    }

    if (data.includes("001")) {
      console.log("Successfully authenticated");
      const resolver = this.pendingActions.get("auth");
      if (resolver) {
        resolver();
        this.pendingActions.delete("auth");
      }
    }

    if (data.includes("JOIN")) {
      const match = data.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv JOIN (#\w+)/);
      if (match) {
        const [, username, channelName] = match;

        // Check if this is our own join (initial connection)
        const resolver = this.pendingActions.get(channelName);
        if (resolver) {
          console.log(`Successfully joined ${channelName}`);
          const channel = new Channel(ws, channelName);
          this.channels.set(channelName, channel);
          resolver(channel);
          this.pendingActions.delete(channelName);
        }
      }
    }

    if (data.includes("PRIVMSG")) {
      const match = data.match(
        /:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG (#\w+) :(.+)/,
      );
      if (match) {
        const [, username, channelName, content] = match;
        const channel = this.channels.get(channelName);
        if (channel) {
          channel.dispatchEvent("PRIVMSG", {
            username,
            content,
            channel: channelName,
          });
          // Dispatch MENTIONS when the bot's username appears in the message (case-insensitive)
          if (content.toLowerCase().includes(this.username.toLowerCase())) {
            channel.dispatchEvent("MENTIONS", {
              username,
              mentionedUsername: this.username,
              content,
              channel: channelName,
            });
          }
        }
      }
    }

    if (data.includes("PART")) {
      const match = data.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv PART (#\w+)/);
      if (match) {
        const [, username, channelName] = match;
        // Part event handling can be added here if needed
      }
    }

    if (data.includes("USERNOTICE")) {
      const match = data.match(/@([^\s]+) :tmi\.twitch\.tv USERNOTICE (#\w+)/);
      if (match) {
        const [, tags, channelName] = match;
        const channel = this.channels.get(channelName);
        if (channel) {
          const tagMap: Record<string, string> = {};
          tags.split(";").forEach((tag) => {
            const [key, value] = tag.split("=");
            if (key && value) tagMap[key] = value;
          });
          channel.dispatchEvent("USERNOTICE", {
            username: tagMap["login"] || "",
            channel: channelName,
            messageType: tagMap["msg-id"] || "",
            message: tagMap["system-msg"]?.replace(/\\s/g, " "),
          });
        }
      }
    }

    if (data.includes("CLEARCHAT")) {
      const match = data.match(
        /@?([^\s]*) :tmi\.twitch\.tv CLEARCHAT (#\w+)(?: :(\w+))?/,
      );
      if (match) {
        const [, tags, channelName, username] = match;
        const channel = this.channels.get(channelName);
        if (channel) {
          const duration = tags.match(/ban-duration=(\d+)/)?.[1];
          channel.dispatchEvent("CLEARCHAT", {
            channel: channelName,
            username,
            duration: duration ? parseInt(duration) : undefined,
          });
        }
      }
    }

    if (data.includes("ROOMSTATE")) {
      const match = data.match(/@([^\s]+) :tmi\.twitch\.tv ROOMSTATE (#\w+)/);
      if (match) {
        const [, tags, channelName] = match;
        const channel = this.channels.get(channelName);
        if (channel) {
          const tagMap: Record<string, string> = {};
          tags.split(";").forEach((tag) => {
            const [key, value] = tag.split("=");
            if (key && value) tagMap[key] = value;
          });
          channel.dispatchEvent("ROOMSTATE", {
            channel: channelName,
            tags: tagMap,
          });
        }
      }
    }

    if (data.includes("NOTICE")) {
      const match = data.match(/:tmi\.twitch\.tv NOTICE (#\w+) :(.+)/);
      if (match) {
        const [, channelName, message] = match;
        const channel = this.channels.get(channelName);
        if (channel) {
          channel.dispatchEvent("NOTICE", { channel: channelName, message });
        }
      }
    }
  }

  join(channel: string): Promise<Channel> {
    channel = channel.toLowerCase();
    return new Promise((resolve) => {
      if (!this.ws) {
        return;
      }

      const channelName = channel.startsWith("#") ? channel : `#${channel}`;
      this.pendingActions.set(channelName, resolve);
      this.ws.send(`JOIN ${channelName}`);
      console.log(`Joining ${channelName}`);
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.channels.clear();
    this.pendingActions.clear();
    console.log("Disconnected from Twitch IRC");
  }
}
