import status from 'http-status';
import { Response } from 'express';
import { default as HttpResponse } from './Response';

const Exceptions = {
  NotFound: (res: Response, input: string) => {
    return HttpResponse(
      res,
      {
        message: `${input} not found`,
      },
      status.NOT_FOUND
    );
  },

  Create: (res: Response, data: any) => {
    return HttpResponse(
      res,
      { message: 'Create completed', data },
      status.CREATED
    );
  },

  Edit: (res: Response, data: any) => {
    return HttpResponse(res, { message: 'Edit completed', data });
  },

  Delete: (res: Response, data: any) => {
    return HttpResponse(res, { message: 'Edit completed', data });
  },

  ServerError: (res: Response, error: any) => {
    return HttpResponse(
      res,
      { error: error.message },
      status.INTERNAL_SERVER_ERROR
    );
  },
};

export default Exceptions;
