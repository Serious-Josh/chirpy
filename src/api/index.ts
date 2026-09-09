import express, {Request, Response} from "express";
import {config} from "../config.js";

export const apiRouter = express.Router();
export const adminRouter = express.Router();

//api routing
apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/validate_chirp", chirpHandler);


//admin routing
adminRouter.get("/metrics", handlerMetricsHTML)
adminRouter.post("/reset", handlerMetricsReset);

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

async function chirpHandler(req: Request, res: Response){
    const reqBody = req.body;

    try{
        if(reqBody.body.length > 140){
            res.status(400).send({error: "Chirp is too long"});
        }
        else{

            const splitBody = reqBody.body.split(" ");

            splitBody.forEach((word: string, index: number) => {
                switch(word.toLowerCase()){
                    case "kerfuffle":
                    case "sharbert":
                    case "fornax":
                        splitBody[index] = "****";
                        break;
                    default:
                        break;
                }
            })

            const cleanedBody = splitBody.join(" ");

            res.header("Content-Type", "application/json");
            res.status(200).send({"cleanedBody": cleanedBody});
        }
    }
    catch(error){
        res.status(400).send({error: "Something went wrong"});
    }
}