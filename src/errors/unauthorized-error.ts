import { UNAUTHORIZED, VALIDATION_ERROR } from '../types/status';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

export default UnauthorizedError;
