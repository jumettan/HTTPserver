import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { middlewareLogResponse, middlewareMetricsInc, } from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";
import { handlerErrors } from "./api/errors.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponse);
app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.post("/api/validate_chirp", handlerChirpsValidate);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
// MUST be last
app.use(handlerErrors);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
