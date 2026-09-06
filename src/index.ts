import express, { type Express } from 'express';

export function main(){
    const app: Express = express();
    const port = 8080;

    app.use(express.static("."));

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();