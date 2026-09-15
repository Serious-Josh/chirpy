import express, {request, Request, Response} from "express";
import {config} from "../config.js";
import {BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError} from "../errorHandling.js";
import { clearUsers, createUser, getUserFromEmail } from "../db/queries/users.js";
import { createChirp, getAllChrips, getSingleChrip } from "../db/queries/chrips.js";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT, getBearerToken } from "../auth.js"

export const apiRouter = express.Router();
export const adminRouter = express.Router();

//api routing
apiRouter.get("/healthz", handlerReadiness);
apiRouter.post("/users", addUser);
apiRouter.post("/login", loginHandler);

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
    const user = await createUser({email: req.body.email,
                                password: await hashPassword(req.body.password)});
    const {password, ...noPass} = user;
    res.status(201).send(noPass);
}

async function loginHandler(req: Request, res: Response){
    const user = await getUserFromEmail(req.body.email);

    const expiresInSeconds = req.body.expiresInSeconds ?? 3600;
    const expires = expiresInSeconds > 3600 ? 3600 : expiresInSeconds;

    const token = makeJWT(user.id, expires, config.api.secretString);

    if(user == undefined){
        throw new UnauthorizedError("Incorrect email or password.");
    }

    if(await checkPasswordHash(req.body.password, user.password)){
        //login
        const {password, ...noPass} = user;
        const fullUser = {...noPass, "token": token}; 
        res.status(200).send(fullUser);
    }
    else{
        throw new UnauthorizedError("Incorrect email or password.");
    }
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
            const userID = validateJWT(getBearerToken(req).slice(7), config.api.secretString);

            if(userID == undefined){
                throw new Error("Invalid authorization information.");
            }

            const chirp = await createChirp({body: cleanedBody, userId: userID});
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