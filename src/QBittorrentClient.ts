import {QBittorrent} from '@ctrl/qbittorrent';

export class QBittorrentClient {

  private client: QBittorrent;
  private currentHost?: string;

  constructor(
    url: string,
    username: string,
    password: string,
  ) {
    this.client = new QBittorrent({
      baseUrl: url,
      username: username,
      password: password,
    });
  }

  async updateConnection(): Promise<{ hostId: string; version: string; }> {
    // login if not logged in already
    if (!await this.client.login()) {
      throw new Error('Failed to connect to client');
    }

    let apiversion = await this.client.getApiVersion();
    let version = await this.client.getAppVersion();

    // report status
    return {
      hostId: apiversion,
      version: version,
    };
  }

  async getPort() {
    // make sure we are connected
    await this.updateConnection();

    const {listen_port} = await this.client.getPreferences();

    return listen_port;
  }

  async updatePort(port: number): Promise<void> {
    // make sure we are connected
    await this.updateConnection();

    // update port
    const error = await this.client.setPreferences({
      listen_port: port,
      random_port: false, // turn of random port as well
    });

    console.log('Client port update requested.');
  }

}
