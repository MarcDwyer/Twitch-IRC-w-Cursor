export interface MessageEvent {
  username: string;
  content: string;
  channel: string;
}

export interface UserNoticeEvent {
  username: string;
  channel: string;
  messageType: string;
  message?: string;
}

export interface ClearChatEvent {
  channel: string;
  username?: string;
  duration?: number;
}

export interface ClearMsgEvent {
  channel: string;
  messageId: string;
}

export interface RoomStateEvent {
  channel: string;
  tags: Record<string, string>;
}

export interface UserStateEvent {
  channel: string;
  tags: Record<string, string>;
}

export interface NoticeEvent {
  channel: string;
  message: string;
  messageId?: string;
}

export interface MentionEvent {
  username: string; // The user who sent the message
  mentionedUsername: string; // The username that was mentioned (e.g., the bot's username)
  content: string; // The full message content
  channel: string;
}

export type ChannelEventMap = {
  PRIVMSG: MessageEvent;
  USERNOTICE: UserNoticeEvent;
  CLEARCHAT: ClearChatEvent;
  CLEARMSG: ClearMsgEvent;
  ROOMSTATE: RoomStateEvent;
  USERSTATE: UserStateEvent;
  NOTICE: NoticeEvent;
  MENTIONS: MentionEvent; // Add the new event
};

export type ChannelEventType = keyof ChannelEventMap;

export class Channel {
  private ws: WebSocket;
  public name: string;
  private listeners: Map<ChannelEventType, Array<(data: any) => void>> = new Map();

  constructor(ws: WebSocket, name: string) {
    this.ws = ws;
    this.name = name;
  }

  send(message: string): void {
    this.ws.send(`PRIVMSG ${this.name} :${message}`);
  }

  part(): void {
    this.ws.send(`PART ${this.name}`);  
  }

  addEventListener<K extends ChannelEventType>(
    event: K,
    listener: (data: ChannelEventMap[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  removeEventListener<K extends ChannelEventType>(
    event: K,
    listener: (data: ChannelEventMap[K]) => void
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  dispatchEvent<K extends ChannelEventType>(event: K, data: ChannelEventMap[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }
}
