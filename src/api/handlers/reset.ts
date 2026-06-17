import type { Request, Response } from "express";
import { config } from "../../config.js";
import { resetDB } from "../../db/db_queries/deleteUsers.js";
import { Error403 } from "./errors.js";

export async function handlerReset(_: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new Error403("Forbidden");
    }

    config.api.fileServerHits = 0;
    await resetDB();
    res.status(200).send();
}
