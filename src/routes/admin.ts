import express, { Router, Request, Response } from 'express';

const router : Router = express.Router();

import { postLoginAdmin } from '../controller/admin';

// import endpoints
router.post('/login', (req: Request, res : Response) => postLoginAdmin(req, res));

export = router;
