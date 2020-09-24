import * as express from 'express';
import status from 'http-status';
import { Response } from '@shyn123/express-rest';

export default abstract class CrudController {
  abstract model: any;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const data = await this.model.find().lean();
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).lean();
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

  create = async (req: express.Request, res: express.Response) => {
    try {
      const data = new this.model(req.body);
      await data.save();
      return Response(
        res,
        { message: 'Create completed', data },
        status.CREATED
      );
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };

  deleteById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findByIdAndDelete(id).lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${id} not found`,
          },
          status.NOT_FOUND
        );
      }
      return Response(res, { message: 'Delete completed', data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
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
        return Response(res, { message: `${id} not found` }, status.NOT_FOUND);
      }
      return Response(res, { message: 'Edit completed', data }, status.OK);
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
