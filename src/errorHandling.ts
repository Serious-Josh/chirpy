import {Request, Response, NextFunction} from "express";

export class BadRequestError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(message: string){
        super(message);
    }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    console.log(`Error encountered: ${err}`);

    if(err instanceof BadRequestError){
        res.status(400).send({"error": err.message});
    }
    else{
        res.status(500).send({"error": "Something went wrong on our end"});
    }
    
}