import { Request, Response } from "express";
import { getBearerToken } from "./auth.js";
import { getRefreshToken, revokeRefreshToken } from "./refreshtoken.js";
import { UserNotAuthenticatedError } from "../errors.js";

export async function handlerRevoke(req: Request, res: Response) {
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

    await revokeRefreshToken(refreshTokenString);
    res.status(204).send();
}