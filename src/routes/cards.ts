import { Router } from 'express';
import { createCard, deleteCardById, getCards } from '../controllers/cards';
import { validateCreateCard } from '../validator/validator';

const router = Router();
router.delete('/:cardId', deleteCardById);
router.get('/', getCards);
router.post('/', validateCreateCard, createCard);

export default router;
