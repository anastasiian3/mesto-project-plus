import { CONFLICT_ERROR } from '../types/status';

class ConfictError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

export default ConfictError;
