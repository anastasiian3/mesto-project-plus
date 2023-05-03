import { celebrate, Joi } from 'celebrate';

// eslint-disable-next-line operator-linebreak
export const RegExpr =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(RegExpr),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
});

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(1).required(),
    link: Joi.string().pattern(RegExpr).required(),
  }),
});

export const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

// eslint-disable-next-line object-curly-newline
export const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({ avatar: Joi.string().pattern(RegExpr) }),
  // eslint-disable-next-line object-curly-newline
});

// eslint-disable-next-line object-curly-newline
export const validateCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
  // eslint-disable-next-line object-curly-newline
});
