import { Router } from 'express';
import {
  createUser,
  findCurrentUserById,
  findUserById,
  getUsers,
  login,
  updateAvatar,
  updateUser,
} from '../controllers/users';
import {
  validateLogin,
  validateUpdateAvatar,
  validateUpdateUser,
  validateUser,
} from '../validator/validator';

const router = Router();
router.get('/me', findCurrentUserById);
router.get('/:userId', findUserById);
router.get('/', getUsers);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
