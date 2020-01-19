import { Application, IBoot } from 'egg';
import { TcpServer } from './socket/server';

export default class AppBoot implements IBoot {
  constructor(private app: Application) {}

  configWillLoad() {}

  async didLoad() {}

  async willReady() {}

  async didReady() {}

  async serverDidReady() {
    TcpServer.createServer(this.app);
  }
  async beforeClose() {}
}
