import * as http from 'http';
import logger from './logger';
import { Socket } from 'socket.io';
import { DBConfig } from './interface';
import express, { Application } from 'express';

interface AppConstructor {
  forEach: (arg0: (controller: any) => void) => void;
}

class Express {
  public app: Application;
  public port: number;

  constructor(appInit: {
    port: number;
    databaseConfigs: DBConfig[];
    middleWares: AppConstructor;
    controllers: AppConstructor;
  }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.connectDatabase(appInit.databaseConfigs);
    this.routes(appInit.controllers);
  }

  private routes(controllers: AppConstructor): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
  private middlewares(middleWares: AppConstructor): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }
  private connectDatabase(databaseConfigs: DBConfig[]): void {
    databaseConfigs.forEach(({ database, url }: DBConfig) => {
      database.connect(url);
    });
  }
  public listen(): http.Server {
    const server = this.app.listen(this.port, () => {
      logger({
        type: 'Success',
        message: `Server is listening on http://localhost:${this.port}`,
      });
    });
    return server;
  }

  public useSocket(io: SocketIO.Server): void {
    io.on('connection', (socket: Socket) => {
      this.app.set('socket', socket);
    });
    this.app.set('io', io);
  }
}
export default Express;
