import * as path from 'path';
import { EventEmitter } from 'events';
import { Application, Context } from 'egg';
import { Server, Socket, createServer } from 'net';
import { router, initConfig, createContext } from './core';
import { getMiddlewares } from './core/middleware';
import { throwError } from './helper';


export class TcpServer extends EventEmitter {
  public server: Server;
  public port: number;
  private middlewares: Map<number, Function>;

  public static createServer(app: Application): TcpServer | null {
    try {
      return new TcpServer(app);
    } catch (err) {
      app.logger.error(err);
    }
    return null;
  }

  constructor(public app: Application) {
    super();
    this.loadFiles();
    initConfig(this.app);
    this.middlewares = getMiddlewares(this.app);
    this.createServer();
    this.bindEvents();
  }

  private loadFiles() {
    const ctrlDir = path.join(__dirname, './controller');
    this.app.loader.loadToApp(ctrlDir, 'socketController');
  }

  private bindEvents() {
    this.on('closed', () => {
      setTimeout(() => {
        this.createServer();
      }, 5000);
    });
  }

  private createServer() {
    const { logger } = this.app;
    this.server = createServer();

    this.server.on('listening', () => {
      logger.info('Jeni’s socket server is running...');
    });

    this.server.on('close', () => {
      logger.warn('Jeni’s socket server is closed!');
      this.emit('closed');
    });

    this.server.on('connection', (socket: Socket) => {
      socket.on('data', async (data: Buffer) => {
        const ctx: Context | null = createContext(this.app, data, socket);
        if (!ctx) {
          socket.write('Brother, we have generation gap...');
          return;
        }
        try {
          await router(ctx, this.middlewares);
        } catch (err) {
          throwError(ctx, err);
        }
      });
      socket.on('error', error => {
        logger.error(`client abortive disconnect: ${error}`)
      })
    });
    this.server.listen(this.app.socketConfig.tcpServerPort || 8820);
  }
}
