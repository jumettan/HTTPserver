import { db } from "../../db/index.js";
import { refresh_tokens, RefreshTokens } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(token: RefreshTokens) {
    const [result] = await db.insert(refresh_tokens).values(token).returning();
    return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
    return result;
}

export async function revokeRefreshToken(token: string) {
    const [result] = await db
        .update(refresh_tokens)
        .set({ revokedAt: new Date() })
        .where(eq(refresh_tokens.token, token))
        .returning();

    return result;
}