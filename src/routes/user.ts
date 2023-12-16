import express, { Router, Request, Response } from "express";
import { postCreateNewProfile, patchUpdateProfile, deleteDeleteProfile, getUserProfile, postSetProfilePreferences, patchUpdateProfilePreferences, postSendInvitation} from '../controller/user';
import authenticateToken from "../middleware/authenticate";
import upload from "../config/multerConfig";

const router : Router = express.Router();

//apply authentication middleware
router.use(authenticateToken)  

router.use(upload.single('profilePicture'));

//Profile Creation
router.post('/current/profiles', (req: Request, res: Response) => postCreateNewProfile(req, res));

//Profile Retrival
router.get('/current/profiles/:profileId', (req: Request, res: Response) => getUserProfile(req, res))

//Profile Update
router.patch('/current/profiles/:profileId', (req: Request, res: Response) => patchUpdateProfile(req, res));

//Profile Delete
router.delete('/current/profiles/:profileId', (req: Request, res: Response) => deleteDeleteProfile(req, res));

//Profile preferences setting      //? Should this be a seperate post or should it be integrated into account creation
router.post('/current/profiles/:profileId/preferences', (req: Request, res: Response) => postSetProfilePreferences(req, res));

//Update the profile preferences   //? Ask Joey where the profile preferences are going to be stored
                                   //? Ask Jan if this is even necessary since getting/updating/deleting profiles are not described in the text
router.patch('/current/profiles/:profileId/preferences', (req: Request, res: Response) => patchUpdateProfilePreferences(req, res));

router.post('/current/sendInvite', (req: Request, res: Response) => postSendInvitation(req, res)); 


export = router;