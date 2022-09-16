/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

export class ExpressError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super();
        this.message = message;
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
    constructor(message = "Bad Request") {
        super(message, 403);
    }
}