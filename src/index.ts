import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use("/metrics", handlerMetrics, express.static("./src/app"))
app.use("/reset", resetMetrics, express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/healthz", handleReadiness);

function handleReadiness(_req: Request, res: Response) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        }
    });

    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}
function handlerMetrics(req: Request, res: Response) {
    res.set("Content-Type", "text/plain");
    res.send(`Hits: ${config.fileserverHits}`);
}
function resetMetrics(req: Request, res: Response) {
    res.set(config.fileserverHits = 0);
    res.send(`Hits reset`);
}