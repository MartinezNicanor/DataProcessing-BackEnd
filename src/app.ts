
import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//Create an app istance from express framework
const app = express();

//Middlewares
app.use(bodyParser.json());
app.use(cors()); 

//route imports
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

//Invalid routes
app.get('*', (req : Request, res : Response) => {
    res.status(404).send('Error Page 404');
});

//exporting the app isntance
export { app };