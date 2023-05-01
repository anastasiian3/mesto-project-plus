import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UNAUTHORIZED } from '../types/status';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
  res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};