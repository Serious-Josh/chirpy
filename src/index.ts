import express, { Express, NextFunction, Request, Response } from 'express';
import { config } from './config.js';

export function main(){
    const app: Express = express();
    const port = 8080;

    app.use("/app", middlewareMetricsInc);
    app.use("/app", express.static("./src/app"));
    app.use(middlewareLogResponses);

    app.get("/healthz", handlerReadiness);
    app.get("/metrics", handlerMetricsOutput);
    app.get("/reset", handlerMetricsReset);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export function handlerReadiness(req: Request, res: Response){
    res.set({
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.send(`OK`);
}

function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
    res.on("finish", () => {
        const code = res.statusCode;
        if(code != 200){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`);
        }
    });

    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction){
    res.on("finish", () => {
        config.fileserverHits += 1;
    })

    next();
}

function handlerMetricsOutput(req: Request, res: Response){
    res.send(`Hits: ${config.fileserverHits}`);
}

function handlerMetricsReset(req: Request, res: Response){
    config.fileserverHits = 0;
    res.send("OK");
}

main();