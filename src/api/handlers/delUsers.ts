import { Error400 } from "./errors.js";
import { config } from "../../config.js";
import { Request, Response } from "express";
import { resetDB } from "../../db/db_queries/deleteUsers.js";


export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new Error400("Forbidden");
    }
    await resetDB();

    return res.status(200).send();
}