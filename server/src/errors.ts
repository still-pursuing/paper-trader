interface ConfigProperties {
  headers: Headers,
  method: string,
  url: string,
  data: string
}

interface Headers {
  Accept: string,
  authorization: string
}

interface Request {
  _header: string
}

/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

export class ExpressError extends Error {
  status: number;
  headers: Headers;
  config: ConfigProperties;
  request: Request;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** 404 NOT FOUND error. */

export class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/** 401 UNAUTHORIZED error. */

export class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/** 400 BAD REQUEST error. */

export class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/** 403 BAD REQUEST error. */

export class ForbiddenError extends ExpressError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}