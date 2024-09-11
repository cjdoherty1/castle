export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError"
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class AccessForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AccessForbiddenError";
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError"
    }
}