import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

// Import controllers
import { postRegisterUser } from '../controller/register';

// API routes
router.post('/', (req: Request, res: Response) => postRegisterUser(req, res));

export = router;