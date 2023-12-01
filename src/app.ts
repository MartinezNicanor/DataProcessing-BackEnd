import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { TINYINT } from 'sequelize';
import pgPromise from 'pg-promise' ;
import { IDatabase, IMain } from 'pg-promise';
import { QueryFile, IQueryFileOptions } from 'pg-promise';

dotenv.config();

//Initialize app
const app = express(); 

// Load and initialize pg-promise
const pgp: IMain = pgPromise({});
const dbConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'netflix',
};
const db: IDatabase<any> = pgp(dbConfig);

// Example function to run a simple query
async function getCountry(countryId: number) {
    try {
        const country: string = await db.one('SELECT * FROM country WHERE country_id = $1', countryId);
        console.log(country);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.log("DB CLOSED")
        pgp.end();
    }
}

getCountry(1);
getCountry(2);

parseInt(process.env.PORT!)


// Middlewares
app.use(bodyParser.json());
app.use(cors()); //Cross origin resource sharing
app.use(morgan('dev')) // Logger

// Routes
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

//favicon.ico automatic request handler
app.get('/favicon.ico', (req : Request, res : Response) => {
    res.status(204).end();
  });

// Invalid routes
app.get('*', (req: Request, res: Response) => {
    res.status(404).send('Error Page 404');
});

// Export the fully configured app instance
export default app;