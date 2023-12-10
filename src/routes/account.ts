import express, { Router, Request, Response } from "express";

const router : Router = express.Router();

import { postCreateNewAccount, } from '../controller/account';

router.post('/create', (req: Request, res: Response) => postCreateNewAccount(req, res));

export = router;