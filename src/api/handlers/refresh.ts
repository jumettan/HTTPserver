import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { getRefreshToken } from "./refreshtoken.js";
import { config } from "../../config.js";
import { UserNotAuthenticatedError } from "../errors.js";
import { respondWithJSON } from "../json.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const refreshTokenString = await getBearerToken(req);
    const refreshToken = await getRefreshToken(refreshTokenString);

    if (!refreshToken) {
        throw new UserNotAuthenticatedError("Invalid refresh token");
    }

    if (refreshToken.revokedAt) {
        throw new UserNotAuthenticatedError("Refresh token has been revoked");
    }

    if (refreshToken.expiresAt < new Date()) {
        throw new UserNotAuthenticatedError("Refresh token has expired");
    }

    if (!refreshToken.userId) {
        throw new UserNotAuthenticatedError("Invalid refresh token payload");
    }

    const oneHour = 60 * 60;
    const token = await makeJWT(refreshToken.userId, oneHour, config.jwt.secret);

    respondWithJSON(res, 200, { token });
}