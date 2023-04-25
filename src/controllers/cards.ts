import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Card from '../models/card';
import { IRequest } from '../types/type';
import {
  CREATED_SUCCESS,
  DATA_NOT_FOUND,
  FORBIDDEN_ACTION,
  REQUEST_SUCCESS,
  SERVER_ERROR,
  VALIDATION_ERROR,
} from '../types/status';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate('user');
    return res.status(REQUEST_SUCCESS).send(cards);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
};

export const createCard = async (req: IRequest, res: Response) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user?._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    if (!name || !link) {
      const error = new Error('Necessary data is not present');
      error.name = 'DataInvalid';
      throw error;
    }
    return res.status(CREATED_SUCCESS).send(newCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'DataInvalid') {
      return res.status(VALIDATION_ERROR).send({ message: error.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
};

export const deleteCardById = (req: IRequest, res: Response) => {
  const ownerId = req.user!._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'Data does not exist' });
      }
      if (card && String(card.owner) === ownerId) {
        card.deleteOne();
        return res.status(REQUEST_SUCCESS).send({ data: card });
      }
      return res
        .status(FORBIDDEN_ACTION)
        .send({ message: 'You are not an owner' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

export const likeCard = (req: IRequest, res: Response) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'Card does not exist' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

export const deleteLikeCard = (req: IRequest, res: Response) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'Card does not exist' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};
