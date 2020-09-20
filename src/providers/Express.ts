import express from 'express';
import { Application } from 'express';
import logger from './logger';

interface AppConstructor {
  forEach: (arg0: (controller: any) => void) => void;
}

class Express {
  public app: Application;
  public port: number;

  constructor(appInit: {
    port: number;
    databases: AppConstructor;
    middleWares: AppConstructor;
    controllers: AppConstructor;
  }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.connectDatabase(appInit.databases);
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
  private connectDatabase(databases: AppConstructor): void {
    databases.forEach((database) => {
      database.connect();
    });
  }
  public listen(): void {
    this.app.listen(this.port, () => {
      logger({
        type: 'Success',
        message: `Server is listening on http://localhost:${this.port}`,
      });
    });
  }
}
export default Express;
