import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import routes from './routes/index';
import { errorLogger, requestLogger } from './middlewares/logger';
import { SERVER_ERROR } from './types/status';
import { IError } from './types/type';
import auth from './middlewares/auth';
import { validateLogin, validateUser } from './validator/validator';
import { createUser, login } from './controllers/users';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);

app.use(auth);

app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR ? 'Произошла ошибка на сервере' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
