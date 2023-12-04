import express, { Router, Request, Response } from "express";

const router : Router = express.Router();

import { postLoginUser, postPasswordResetLink, patchPasswordResetSubmit } from '../controller/login';

router.post('/', (req: Request, res : Response) => postLoginUser(req, res));

router.post('/password-reset', (req: Request, res: Response) => postPasswordResetLink(req, res));

router.patch('/password-reset/:token', (req: Request, res: Response) => patchPasswordResetSubmit(req, res));

export = router;