// eslint-disable-next-line max-classes-per-file
import { ApolloError } from 'apollo-server';

export class InsufficientPermissionError extends ApolloError {
  constructor(message) {
    super(message, 'INSUFFICIENT_PERMISSIONS');
  }
}

export class NotFoundError extends ApolloError {
  constructor(message) {
    super(message, 'NOT_FOUND');
  }
}
