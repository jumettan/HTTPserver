import { NewUser } from "../../db/schema.js";
import { Request, Response } from "express";
import { createUser } from "../../db/db_queries/users.js";
import { Error400 } from "./errors.js";
import { respondWithJSON } from "../json.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string,
    };

    const params = req.body as parameters;

    if (!params || typeof params.email !== "string") {
        throw new Error400("Invalid JSON");
    };
    const email = params.email.trim();

    if (!email) {
        throw new Error400("Email is required");
    };
    const user = await createUser({ email, });

    if (!user) {
        throw new Error400("User already exists");
    };

    respondWithJSON(res, 201, {
        email: user.email,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    })
}