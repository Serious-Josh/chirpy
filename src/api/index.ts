import express, {request, Request, Response} from "express";
import {config} from "../config.js";
import {BadRequestError, ForbiddenError, NotFoundError} from "../errorHandling.js";
import { clearUsers, createUser } from "../db/queries/users.js";
import { createChirp, getAllChrips, getSingleChrip } from "../db/queries/chrips.js";

export const apiRouter = express.Router();
export const adminRouter = express.Router();

//api routing
apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", addUser);

//chirps
apiRouter.get("/chirps", getChripsHandler);
apiRouter.get("/chirps/:chirpId", getSingleChirpHandler);
apiRouter.post("/chirps", addChirp);


//admin routing
adminRouter.get("/metrics", handlerMetricsHTML)
adminRouter.post("/reset", handlerReset);



//---------------
// Handlers
//---------------

//general handlers
export function handlerReadiness(req: Request, res: Response){
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`OK`);
}

function handlerMetricsHTML(req: Request, res: Response){
    const hits = config.api.fileserverHits;
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
    res.send(`Hits: ${config.api.fileserverHits}`);
}

async function handlerReset(req: Request, res: Response){

    if(config.api.platform != "dev"){
        throw new ForbiddenError("You do not have access to this endpoint.");
    }else{
        config.api.fileserverHits = 0;
        await clearUsers();

        res.send("OK");
    }
}


//users handlers
async function addUser(req: Request, res: Response){
    const user = await createUser({email: req.body.email});
    res.status(201).send(user);
}


//chirps handlers
async function addChirp(req: Request, res: Response){
    const reqBody = req.body;

    if(reqBody.body.length > 140){
        throw new BadRequestError("Chirp is too long. Max length is 140");
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

        try{
            const chirp = await createChirp({body: cleanedBody, userId: reqBody.userId});
            res.header("Content-Type", "application/json");
            res.status(201).send(chirp);
        }
        catch(e){
            console.log(e);
        }
    }
}

async function getChripsHandler(req: Request, res: Response){
    try{
        const chrips = await getAllChrips();
        res.status(200).send(chrips);
    }
    catch(e){
        console.log(e);
    }
}

async function getSingleChirpHandler(req: Request, res: Response){
    const chirpId = req.params.chirpId;

    if(typeof chirpId !== "string"){
        throw new BadRequestError(`Incorrect chirpId. chirpId: ${chirpId}`);
    }

    const chirp = await getSingleChrip(chirpId);

    if(chirp == undefined){
        throw new NotFoundError("Chrip not found");
    }
    
    res.status(200).send(chirp);
}