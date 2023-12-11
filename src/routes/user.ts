import express, { Router, Request, Response } from "express";
import { postCreateNewProfile, patchUpdateProfile, deleteDeleteProfile, getUserProfile } from '../controller/user';
import authenticateToken from "../middleware/authenticate";
import upload from "../config/multerConfig";

const router : Router = express.Router();

//apply authentication middleware
//router.use(authenticateToken)  deactivated for testing

router.use(upload.single('profilePicture'));

//Profile Creation
router.post('/:accountId/profiles', (req: Request, res: Response) => postCreateNewProfile(req, res));

//Profile Retrival
router.get('/:accountId/profiles/:profileId', (req: Request, res: Response) => getUserProfile(req, res))

//Profile Update
router.patch('/:accountId/profiles/:profileId', (req: Request, res: Response) => patchUpdateProfile(req, res));

//Profile Delete
router.delete('/:accountId/profiles/:profileId', (req: Request, res: Response) => deleteDeleteProfile(req, res));



export = router;