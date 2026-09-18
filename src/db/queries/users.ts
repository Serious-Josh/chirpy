import { eq } from "drizzle-orm";
import {db} from "../index.js";
import {NewUser, users} from "../schema.js";

export async function createUser(user: NewUser){
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}

export async function updateUserInfo(userID: string, email: string, password: string){
    const [result] = await db.update(users).set({email: email, password: password}).where(eq(users.id, userID)).returning();
    return result;
}

export async function getUserFromEmail(email: string){
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}

export async function clearUsers(){
    await db.delete(users);
}