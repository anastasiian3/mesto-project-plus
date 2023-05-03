import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  createCard,
  deleteCardById,
  getCards,
  dislikeCard,
  likeCard,
} from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../validator/validator';

const cardRouter = Router();
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

export default cardRouter;
