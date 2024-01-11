import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

//Initialize app
const app = express(); 

// Example function to run a simple query

parseInt(process.env.PORT!)

// Middlewares
app.use(bodyParser.json());
app.use(cors()); //Cross origin resource sharing
app.use(morgan('dev')); // Logger

// Routes
const registerRoutes = require('./routes/register')
app.use("/register", registerRoutes);

const loginRoutes = require('./routes/login')
app.use("/login", loginRoutes);

const userRoutes = require('./routes/user')
app.use("/user" , userRoutes)

const contentRoutes = require('./routes/content')
app.use("/content", contentRoutes);

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