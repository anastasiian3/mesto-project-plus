/* eslint-disable consistent-return */
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden';
import { IRequest } from '../types/type';
import { CREATED_SUCCESS, REQUEST_SUCCESS } from '../types/status';
import ValidationError from '../errors/validation-error';
import Cards from '../models/cards';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(REQUEST_SUCCESS).send(cards))
    .catch((err) => {
      next(err);
    });
};

export const createCard = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(CREATED_SUCCESS).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const deleteCardById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const ownerId = req.user!._id;
  Cards.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        return next(new NotFoundError('Data does not exist'));
      }
      if (String(cardToDelete.owner) !== ownerId) {
        return next(new ForbiddenError('You are not an owner'));
      }
      cardToDelete
        .remove()
        .then(() => res.status(REQUEST_SUCCESS).send(cardToDelete))
        .catch((err) => next(err));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card does not exist'));
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};

export const dislikeCard = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: [req.user?._id] } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card does not exist'));
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Data is incorrect'));
      }
      next(error);
    });
};
