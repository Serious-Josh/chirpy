import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChrip } from "../schema.js";


export async function createChirp(user: NewChrip){
    const [result] = await db.insert(chirps).values(user).onConflictDoNothing().returning();
    return result;
}

export async function getAllChrips(){
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return result;
}

export async function getSingleChrip(chirpId: string){
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
}

export async function deleteChrip(chripId: string){
    await db.delete(chirps).where(eq(chirps.id, chripId));
}