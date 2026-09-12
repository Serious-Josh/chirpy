import { db } from "../index.js";
import { chirps, NewChrip } from "../schema.js";


export async function createChirp(user: NewChrip){
    const [result] = await db.insert(chirps).values(user).onConflictDoNothing().returning();
    return result;
}