import { Router } from 'express';

interface Controller {
  path: string;
  router: Router;
  initializeRoutes: () => void;
}

export default Controller;
