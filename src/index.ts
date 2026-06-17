import "dotenv/config";
import express from "express";

import { handlerReadiness } from "./api/handlers/readiness.js";
import { handlerMetrics } from "./api/handlers/metrics.js";
import { handlerReset } from "./api/handlers/reset.js";
import { middlewareLogResponse, middlewareMetricsInc, } from "./api/middleware.js";
import { handlerErrors } from "./api/handlers/errors.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/handlers/users.js";
import { handlerChirps } from "./api/handlers/chirps.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/chirps", handlerChirps)

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.post("/api/users", handlerCreateUser)

// MUST be last
app.use(handlerErrors);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
