import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
import type {MigrationConfig} from "drizzle-orm/migrator";

import * as schema from "./schema.js";
import {config} from "../config.js";

const migrationConfig: MigrationConfig = {
    migrationsFolder: ".src/db/migrations",
};

export type DBConfig = {
    url: string;
    migConfig: MigrationConfig;
}

export const dbConfig: DBConfig = {url: "postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable", migConfig: migrationConfig};


//object instantiation
const conn = postgres(config.db.url);
export const db = drizzle(conn, {schema});