import path from 'path';
import express, { Response } from 'express';
import mongoose from 'mongoose';
import { IRequest } from './types/type';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: IRequest, res: Response, next) => {
  req.user = { _id: '64442f4253e0cd4e2d79990d' };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
