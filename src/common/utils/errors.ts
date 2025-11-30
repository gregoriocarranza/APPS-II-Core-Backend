export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Resource conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}
export class InsufficientFundsError extends Error {
  constructor(message = "Insufficient funds") {
    super(message);
    this.name = "InsufficientFundsError";
  }
}
