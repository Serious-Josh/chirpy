import { eq, and, isNull } from "drizzle-orm";
import {db} from "../index.js";
import {NewRefreshToken, refresh_tokens} from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken){
    const [result] = await db.insert(refresh_tokens).values(token).onConflictDoNothing().returning();
    return result;
}

export async function selectRefreshToken(token: string){
    const [result] = await db.select().from(refresh_tokens).where(and(eq(refresh_tokens.token, token), isNull(refresh_tokens.revoked_at)));
    return result;
}

export async function revokeRefreshToken(token: string){
    await db.update(refresh_tokens).set({revoked_at: new Date()}).where(eq(refresh_tokens.token, token));
}