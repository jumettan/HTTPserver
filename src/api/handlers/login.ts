import { getUserByEmail } from "../../db/db_queries/users.js";
import { respondWithError, respondWithJSON } from "../json.js";
import { Request, Response } from "express";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { config } from "../../config.js";
import { createRefreshToken } from "./refreshtoken.js";

export async function handlerLogin(req: Request, res: Response) {

    const email = req.body.email;
    const password = req.body.password.trim();
    const user = await getUserByEmail(email);

    if (!user) {
        return respondWithError(res, 401, "incorrect email or password");
    }

    const successfulLogin = await checkPasswordHash(password, user.hashedPassword)
    if (!successfulLogin) {
        return respondWithError(res, 401, "incorrect email or password")
    }

    const oneHour = 60 * 60;

    const token = await makeJWT(
        user.id,
        oneHour,
        config.jwt.secret
    );

    const refrestToken = makeRefreshToken();
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 60);

    await createRefreshToken({
        token: refrestToken,
        userId: user.id,
        expiresAt,
        revokedAt: null,
    });

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token,
        refreshToken: refrestToken,
    });

}