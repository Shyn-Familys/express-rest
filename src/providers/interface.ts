import { Router } from 'express';

interface Controller {
  path: string;
  router: Router;
  initializeRoutes: () => void;
}

export interface DB {
  connect: (url: string) => void;
}

export interface DBConfig {
  database: DB;
  url: string;
}

export default Controller;
