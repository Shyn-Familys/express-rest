import * as express from 'express';
import status from 'http-status';
import Response from '../providers/Response';

export default abstract class CrudController {
  abstract Model: any;
  public router = express.Router();

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const data = await this.Model.find().lean();
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.Model.findById(id).lean();
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
  post = async (req: express.Request, res: express.Response) => {
    try {
      const data = new this.Model(req.body);
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
      const data = await this.Model.findByIdAndDelete(id).lean();
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
      const data = await this.Model
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
