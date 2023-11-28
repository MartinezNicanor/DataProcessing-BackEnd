import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { TINYINT } from 'sequelize';

dotenv.config();

//Initialize app
const app = express(); 


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