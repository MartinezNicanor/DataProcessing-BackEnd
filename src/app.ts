import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

app.get('*', (req : Request, res : Response) => {
    res.status(404).send('Error Page 404');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server is running on port ${port}`));

export { app };