import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import {db, pgp} from './db';
import authenticateToken from './middleware/authenticate';


dotenv.config();

//Initialize app
const app = express(); 

// Example function to run a simple query

parseInt(process.env.PORT!)

// Middlewares
app.use(bodyParser.json());
app.use(cors()); //Cross origin resource sharing
app.use(morgan('dev')); // Logger

//TODO: ADD REFRESH TOKEN PATH

// Routes
const registerRoutes = require('./routes/register')
app.use("/register", registerRoutes);

const loginRoutes = require('./routes/login')
app.use("/login", loginRoutes);

const accountRoutes = require('./routes/account')
app.use("/account", accountRoutes)

//Test Route
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