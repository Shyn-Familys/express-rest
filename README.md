# express-rest

## Install

```
npm i @shyn123/express-rest
```

## HOW TO USE

### INIT SERVER

```
import 'module-alias/register';
require('dotenv').config();
import cors from 'cors';
import morgan from 'morgan';
import { Express, MongoDB } from '@shyn123/express-rest';

const MDW = [cors(), morgan('dev')];

const app = new Express({
  port: +process.env.PORT || 3000,
  middleWares: MDW,
  databaseConfigs: [{
    database: MongoDB,
    url: +process.env.MONGO_URL
  }],
  controllers: [
    new AuthController(),
    new KahootController(),
    new QuestionController(),
  ],
});

app.listen();
```

If you want to use socket

```
import 'module-alias/register';
require('dotenv').config();
import cors from 'cors';
import morgan from 'morgan';
import { Express, MongoDB } from '@shyn123/express-rest';

const MDW = [cors(), morgan('dev')];

const app = new Express({
  port: +process.env.PORT || 3000,
  middleWares: MDW,
  databaseConfigs: [{
    database: MongoDB,
    url: +process.env.MONGO_URL
  }],
  controllers: [
    new AuthController(),
    new KahootController(),
    new QuestionController(),
  ],
});

const server = app.listen();
app.useSocket(require('socket.io')(server))

```

### CRUD Controller

```
class KahootController extends CrudController implements Controller {
  public path = '/kahoots';
  model = KahootModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.create);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, this.update);
    this.router.get(`${this.path}/:id`, requireAuth, this.getById);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };
  private getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).populate('questions').lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${id} not found`,
          },
          status.NOT_FOUND
        );
      }
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default KahootController;
```
