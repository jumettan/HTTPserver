
import { db } from "../index.js";
import { chirps, users } from "../schema.js";

export async function resetDB() {
    const result = await db.transaction(async (tx) => {
        await tx.delete(chirps).execute();
        return tx.delete(users).execute();
    });

    return result;
}