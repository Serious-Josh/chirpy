import express, {Request, Response} from "express";
import {config} from "../config.js";

export const apiRouter = express.Router();
export const adminRouter = express.Router();

//api routing
apiRouter.get("/healthz", handlerReadiness);


//admin routing
adminRouter.get("/metrics", handlerMetricsHTML)
adminRouter.get("/reset", handlerMetricsReset);

export function handlerReadiness(req: Request, res: Response){
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`OK`);
}

function handlerMetricsHTML(req: Request, res: Response){
    const hits = config.fileserverHits;
    const html = `<html>
                    <body>
                        <h1>Welcome, Chirpy Admin</h1>
                        <p>Chirpy has been visited ${hits} times!</p>
                    </body>
                    </html>`;
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
}

function handlerMetricsOutput(req: Request, res: Response){
    res.send(`Hits: ${config.fileserverHits}`);
}

function handlerMetricsReset(req: Request, res: Response){
    config.fileserverHits = 0;
    res.send("OK");
}