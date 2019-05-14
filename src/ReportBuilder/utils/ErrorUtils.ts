import { PeekdataError } from 'peekdata-datagateway-api-sdk';

export function isPeekdataError(error: Error): error is PeekdataError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && 'message' in error && 'response' in error;
}
