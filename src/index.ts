import express, { Express, Request, response, Response } from 'express';

export function main(){
    const app: Express = express();
    const port = 8080;

    app.use("/app", express.static("./src/app"));

    app.get("/healthz", handlerReadiness);

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

main();