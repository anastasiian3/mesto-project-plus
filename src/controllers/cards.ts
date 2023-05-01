import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden';
import { IRequest } from '../types/type';
import { CREATED_SUCCESS, REQUEST_SUCCESS } from '../types/status';
import ValidationError from '../errors/validation-error';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(REQUEST_SUCCESS).send(cards))
    .catch(next);
};

export const createCard = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(CREATED_SUCCESS).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Data is incorrect');
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
  Card.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        throw new NotFoundError('Data does not exist');
      }
      if (String(cardToDelete.owner) === ownerId) {
        cardToDelete.remove();
        return res.status(REQUEST_SUCCESS).send(cardToDelete);
      }
      throw new ForbiddenError('You are not an owner');
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card does not exist');
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};

export const dislikeCard = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card does not exist');
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        throw new ValidationError('Data is incorrect');
      }
      next(error);
    });
};
