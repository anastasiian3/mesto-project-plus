import { DATA_NOT_FOUND } from '../types/status';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = DATA_NOT_FOUND;
  }
}

export default NotFoundError;
