/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ValidationError from '../errors/validation-error';
import NotFoundError from '../errors/not-found-error';
import ConfictError from '../errors/conflict-error';
import Users from '../models/users';
import { IRequest } from '../types/type';
import { CREATED_SUCCESS, REQUEST_SUCCESS } from '../types/status';

export const getUsers = (req: Request, res: Response, next: NextFunction) => Users.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const findUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('This user is not found'));
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const findCurrentUserById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  Users.findById(req.user!._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Current user is not found'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash: number | string) => Users.create({ email, password: hash, name, about, avatar }))
    .then((user) => res.status(CREATED_SUCCESS).send({ id: user._id, email: user.email }))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConfictError('The email is already used'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Data is incorrect'));
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
  Users.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User is not found'));
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Data is incorrect'));
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
  Users.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User is not found'));
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const login = (req: IRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }) });
    })
    .catch(next);
};
