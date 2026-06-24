import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "crypto";

import argon2 from "argon2";
import { UserNotAuthenticatedError } from "../errors.js";

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);
    if (!hashedPassword) {
        console.log("Somethiwn went wrong. Try again")
    }
    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password) == true) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
    return false;
}

export async function makeJWT(userID: string, expiresIn: number, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);

    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as JwtPayload;

        if (!decoded.sub || typeof decoded.sub !== "string") {
            throw new UserNotAuthenticatedError("Invalid token payload");
        }

        return decoded.sub
    } catch (err) {
        throw new UserNotAuthenticatedError("Invalid or expired token");
    }

}
export async function getBearerToken(req: Request): Promise<string> {
    const header = req.get("Authorization");

    if (!header) {
        throw new UserNotAuthenticatedError("Missing Authorization header");
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        throw new UserNotAuthenticatedError("Invalid Authorization header format");
    }

    return token;
}

export function makeRefreshToken(): string {
    return randomBytes(32).toString("hex");
}