import * as express from 'express';
import status from 'http-status';

const Response = (
  res: express.Response,
  data: Object,
  statusCode = status.OK
) => {
  return res.status(statusCode).json({
    ...data,
  });
};
export default Response;
