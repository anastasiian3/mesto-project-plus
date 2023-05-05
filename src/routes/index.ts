import { NextFunction, Request, Response, Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import { DATA_NOT_FOUND } from '../types/status';
import NotFoundError from '../errors/not-found-error';

const routes = Router();

routes.use('/cards', cardRouter);
routes.use('/users', userRouter);
routes.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError('Page Not Found')));

export default routes;
