import express, { Express } from 'express';
import { adminRouter, apiRouter } from './api/index.js';
import { middlewareMetricsInc, middlewareLogResponses } from './middleware.js';
import { errorHandler } from './errorHandling.js';
import { config } from './config.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export async function main(){
    const app: Express = express();
    const port = config.api.port;

    const migrationClient = postgres(config.db.url, {max: 1});
    await migrate(drizzle(migrationClient), config.db.migConfig);

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