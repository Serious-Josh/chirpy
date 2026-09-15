import { dbConfig, DBConfig } from "./db/config.js";

process.loadEnvFile();

export type AppConfig = {
    api: APIConfig;
    db: DBConfig;
}

export type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    secretString: string;
}

export const apiConfig: APIConfig = {fileserverHits: 0, port: +envOrThrow("PORT"), platform: envOrThrow("PLATFORM"), secretString: envOrThrow("SECRET")};
export const config: AppConfig = {api: apiConfig, db: dbConfig};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if(!value){
        throw new Error(`Environmental variable ${key} is not set`);
    }
    return value;
}