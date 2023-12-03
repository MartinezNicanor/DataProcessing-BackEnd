import express, { Router, Request, Response } from "express";

const router : Router = express.Router();

import { postLoginUser } from '../controller/login';

router.post('/', (req: Request, res : Response) => postLoginUser(req, res));

export = router;