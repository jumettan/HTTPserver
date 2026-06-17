import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";


export async function saveChirpToDB(chirp: NewChirp) {
    const result = await db.insert(chirps).values(chirp).returning();
    return result;
}