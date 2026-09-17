import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken"
import {Request} from "express";
import {randomBytes} from "node:crypto";
import { UnauthorizedError } from "./errorHandling.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string>{
    try{
        const hashedPassword = await argon2.hash(password, {type: argon2.argon2id});
        return hashedPassword;
    }catch(error){
        console.error("Error hashing password:", error);
        throw error;
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try{
        const check = argon2.verify(hash, password);
        return check;
    }catch(error){
        console.error("Password verification error:", error);
        throw error;
    }
}


// ---------------
// JWT Functions
// ---------------

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    const time = Math.floor(Date.now() / 1000);
    const payload: payload = {iss: "chirpy", sub: userID, iat: time, exp: time + expiresIn};
    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string{
    try{
        const decoded = jwt.verify(tokenString, secret);
        return decoded.sub as string;
    }
    catch(err){
        throw new UnauthorizedError("Invalid JWT");
    }
}

export function getBearerToken(req: Request): string{
    const token = req.get("Authorization");

    if(token == undefined){
        throw new Error("No authorization information provided.");
    }

    return token;
}


// ---------------
// Refresh Token Functions
// ---------------

export function makeRefreshToken(){
    const token = randomBytes(32);
    return token.toString('hex');
}