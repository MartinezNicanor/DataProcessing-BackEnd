import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

// Create an app instance from the express framework
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors()); 

// Routes
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

// Invalid routes
app.get('*', (req: Request, res: Response) => {
    res.status(404).send('Error Page 404');
});

// Export the fully configured app instance
export default app;