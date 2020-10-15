import * as express from 'express';
import Response from '../providers/Response';
import Exceptions from '../providers/Exception';

export default abstract class CrudController {
  abstract model: any;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const data = await this.model.find().lean();
      return Response(res, { data });
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).lean();
      if (!data) {
        return Exceptions.NotFound(res, id);
      }
      return Response(res, { data });
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };

  create = async (req: express.Request, res: express.Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return Exceptions.Create(res, data);
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };

  deleteById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return Exceptions.NotFound(res, id);
      }
      return Exceptions.Delete(res, data);
    } catch (error) {
      return Exceptions.ServerError(res, error);
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
        return Exceptions.NotFound(res, id);
      }
      return Exceptions.Edit(res, data);
    } catch (error) {
      return Exceptions.ServerError(res, error);
    }
  };
}
