import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../errors';

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
