import * as express from 'express';
import Response from '../providers/Response';
import Exception from '../providers/Error';

export default abstract class CrudController {
  abstract model: any;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const data = await this.model.find().lean();
      return Response(res, { data });
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).lean();
      if (!data) {
        return Exception.NotFound(res, id);
      }
      return Response(res, { data });
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };

  create = async (req: express.Request, res: express.Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return Exception.Create(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };

  deleteById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return Exception.NotFound(res, id);
      }
      return Exception.Delete(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model
        .findOneAndUpdate(
          { _id: id },
          {
            $set: { ...req.body },
          },
          { new: true }
        )
        .lean();
      if (!data) {
        return Exception.NotFound(res, id);
      }
      return Exception.Edit(res, data);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
}
