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
import auth from '../middlewares/auth';
import {
  validateLogin,
  validateUpdateAvatar,
  validateUpdateUser,
  validateUser,
} from '../validator/validator';

const router = Router();
router.get('/:userId', findUserById);
router.get('/', getUsers);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
router.get('/users/me', findCurrentUserById);

export default router;
