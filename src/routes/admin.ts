import express, { Router, Request, Response } from 'express';
import authenticateToken from '../middleware/authenticate';

const router : Router = express.Router();

import { getAdminProfile, getJuniorView, getMediorView, getSeniorView, getStatistics, getStatisticsByCountry, postLoginAdmin } from '../controller/admin';


// import endpoints that require no token
router.post('/login', (req: Request, res : Response) => postLoginAdmin(req, res));

// import endpoints that require a token
router.use(authenticateToken)

router.get('/profile/:id', (req: Request, res : Response) => getAdminProfile(req, res));

router.get('/juniorView', (req: Request, res : Response) => getJuniorView(req, res));

router.get('/juniorView', (req: Request, res : Response) => getMediorView(req, res));

router.get('/seniorView', (req: Request, res : Response) => getSeniorView(req, res));

router.get('/statistics', (req: Request, res : Response) => getStatistics(req, res));

router.get('/statistics/:country', (req: Request, res : Response) => getStatisticsByCountry(req, res));


export = router;
