import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const initSwagger = (domain: string, folder: string) => {
  try {
    console.log(domain);
    const router = express.Router();
    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        openapi: '3.0.0',
        servers: [{ url: domain }],
        security: [{ BearerAuth: [] }],
        info: {
          title: 'Api docs',
          version: '1.0',
        },
      },
      apis: [`**/${folder}/*.yml`],
    });
    return router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.log(error);
  }
};

class Swagger {
  public router: Router;
  constructor(path: string, domain: string, folder: string = 'docs') {
    this.router = express.Router().use(path, initSwagger(domain, folder));
  }
}
export default Swagger;
