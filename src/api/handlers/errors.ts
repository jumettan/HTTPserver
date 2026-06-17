import { Request, Response, NextFunction } from "express";

export function handlerErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);
    const statusCode = "statusCode" in err ? Number(err.statusCode) : 500

    res.status(statusCode).json({
        error: err.message
    })
}
class HTTPError extends Error {
    readonly statusCode: Number;
    constructor(statusCode: Number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = new.target.name
    }
}

export class Error404 extends HTTPError {
    constructor(message: string) {
        super(404, message);
    }
}
export class Error400 extends HTTPError {
    constructor(message: string) {
        super(400, message);
    }
}
export class Error401 extends HTTPError {
    constructor(message: string) {
        super(401, message);
    }
}
export class Error403 extends HTTPError {
    constructor(message: string) {
        super(403, message);
    }
}