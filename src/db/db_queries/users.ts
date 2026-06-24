import { NewUser, UserResponse, users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser): Promise<UserResponse | undefined> {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();

    if (!result) {
        return undefined;
    }

    const { hashedPassword: _hashedPassword, ...safeUser } = result;

    return safeUser;
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email))

    return result;
}