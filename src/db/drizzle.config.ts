import { defineConfig } from "drizzle-kit";
import { MigrationConfig } from "drizzle-orm/migrator";
export default defineConfig({
    schema: "src/db/schema.ts",
    out: "src/db",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://postgres:postgres@localhost:5432/chirpy",
    },
});

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    dbConnection: string,
}