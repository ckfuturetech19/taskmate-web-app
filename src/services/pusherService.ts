import Pusher from 'pusher-js';

const PUSHER_KEY = '40b4a6ec6975bab55112';
const PUSHER_CLUSTER = 'ap2';
const AUTH_ENDPOINT = 'http://16.171.35.43:5000/api/pusher/auth';

class PusherService {
  private pusher: Pusher | null = null;

  initialize() {
    if (this.pusher) return this.pusher;

    this.pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: AUTH_ENDPOINT,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });

    return this.pusher;
  }

  subscribeToUser(userId: string) {
    if (!this.pusher) this.initialize();
    return this.pusher!.subscribe(`private-user-${userId}`);
  }

  subscribeToGroup(groupId: string) {
    if (!this.pusher) this.initialize();
    return this.pusher!.subscribe(`presence-group-${groupId}`);
  }

  subscribe(channelName: string) {
    if (!this.pusher) this.initialize();
    return this.pusher!.subscribe(channelName);
  }

  unsubscribe(channelName: string) {
    if (this.pusher) {
      this.pusher.unsubscribe(channelName);
    }
  }

  bind(channelName: string, eventName: string, callback: (data: any) => void) {
    const channel = this.subscribe(channelName);
    channel.bind(eventName, callback);
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
    }
  }
}

export const pusherService = new PusherService();
