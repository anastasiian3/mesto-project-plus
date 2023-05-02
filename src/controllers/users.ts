import { NextFunction, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ValidationError from '../errors/validation-error';
import NotFoundError from '../errors/not-found-error';
import ConfictError from '../errors/conflict-error';
import User from '../models/user';
import { IRequest } from '../types/type';
import {
  CREATED_SUCCESS,
  REQUEST_SUCCESS,
  UNAUTHORIZED,
} from '../types/status';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const findUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User is not found');
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const findCurrentUserById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User is not found');
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash: number | string) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => res.status(CREATED_SUCCESS).send({ id: user._id, email: user.email }))
    .catch((error) => {
      if (error.code === 11000) {
        throw new ConfictError('The email is already used');
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const updateUser = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User is not found');
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const updateAvatar = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User is not found');
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const login = (req: IRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }) });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};
