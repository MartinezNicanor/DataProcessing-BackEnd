import express, { Router, Request, Response } from "express";
import { postCreateNewAccount, } from '../controller/account';
import authenticateToken from "../middleware/authenticate";

const router : Router = express.Router();

//apply authentication middleware
router.use(authenticateToken)


router.post('/create', (req: Request, res: Response) => postCreateNewAccount(req, res));

export = router;