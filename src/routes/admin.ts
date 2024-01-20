import express, { Router, Request, Response } from 'express';
import authenticateToken from '../middleware/authenticate';

const router : Router = express.Router();

import { getAdminProfile, postLoginAdmin } from '../controller/admin';


// import endpoints that require no token
router.post('/login', (req: Request, res : Response) => postLoginAdmin(req, res));

// import endpoints that require a token
router.use(authenticateToken)
router.get('/profile/:id', (req: Request, res : Response) => getAdminProfile(req, res));


export = router;
