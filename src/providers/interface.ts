import { Router } from 'express';

interface Controller {
  path: string;
  router: Router;
  initializeRoutes: () => void;
}

export interface DB {
  connect: () => void;
}

export default Controller;
