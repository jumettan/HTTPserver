import type { Request, Response } from "express";

import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params = req.body as parameters;
    if (!params || typeof params.body !== "string") {
        respondWithError(res, 400, "Invalid JSON");
        return;
    }

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new Error("Chirp is too long");
    }

    const filter = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = handleFilter(params.body, filter);
    respondWithJSON(res, 200, {
        cleaned_body: cleanedBody,
    });
}

function handleFilter(body: string, filters: string[]): string {
    return body.split(" ").map((word) => {
        const lower = word.toLowerCase();
        if (filters.includes(lower)) {
            return "****";
        }
        return word;
    })
        .join(" ")
}