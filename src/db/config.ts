import { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/db/migrations",
};

export type DBConfig = {
    url: string;
    migConfig: MigrationConfig;
}

export const dbConfig: DBConfig = {url: "postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable", migConfig: migrationConfig};