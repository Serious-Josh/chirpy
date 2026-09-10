import express, { Express } from 'express';
import { adminRouter, apiRouter } from './api/index.js';
import { middlewareMetricsInc, middlewareLogResponses } from './middleware.js';
import { errorHandler } from './errorHandling.js';

export function main(){
    const app: Express = express();
    const port = 8080;

    //global logging middleware
    app.use(middlewareLogResponses);
    app.use(express.json());

    //static site with hit counter
    app.use("/app", middlewareMetricsInc, express.static("./src/app"));

    //additional routing
    app.use("/api", apiRouter);
    app.use("/admin", adminRouter);

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();