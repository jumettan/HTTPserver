import { Request, Response, NextFunction } from "express";

export function handlerErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);

    return res.status(500).json({
        error: "Something went wrong on our end",
    });
}
