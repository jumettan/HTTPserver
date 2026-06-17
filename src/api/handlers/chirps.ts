import { Request, Response } from "express";

import { respondWithJSON } from "../json.js";
import { Error400 } from "./errors.js";
import { saveChirpToDB } from "../../db/db_queries/saveChirp.js";
import { chirps } from "../../db/schema.js";

async function validateChirp(body: string) {
    const filter = ["kerfuffle", "sharbert", "fornax"];

    if (body.length > 140) {
        throw new Error400("Chirp is too long");
    }

    return body
        .split(" ")
        .map(word =>
            filter.includes(word.toLowerCase()) ? "****" : word
        )
        .join(" ");
}
export async function handlerChirps(req: Request, res: Response) {

    type Parameters = {
        body: string,
        userId: string,
    }
    const params: Parameters = req.body;
    const valid = await validateChirp(params.body);
    if (!valid) {
        throw new Error400("Invalid chirp")
    }
    params.body = valid;
    saveChirpToDB(params);

    respondWithJSON(res, 201, {
        body: params.body,
        userId: params.userId
    })
}