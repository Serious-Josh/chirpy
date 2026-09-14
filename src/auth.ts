import * as argon2 from "argon2";

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