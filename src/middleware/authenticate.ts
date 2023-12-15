import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import responder from '../utils/responder';
import { db } from '../db';
import { User, Profile } from '../types/user'

dotenv.config();

// Define a custom interface extending the Express Request type and insert all the info that want to be accessed later
interface AuthenticatedRequest extends Request {
    user?: User,
    profiel?: Profile
}

//async function to aoutorize the user
async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {

  //get token
  const token = req.header('Authorization');

  //Authorization token missing
  if (!token) {
    responder(res, 401, 'error', 'Token not found');
    return;
  }

  //decode token and make sure its for right purpose
  try {
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!) as jwt.JwtPayload;

    if (decodedToken.data['purpose'] !== 'authentication') {
      responder(res, 401, 'error', 'Not Authorized');
      return;
    }

    try {
      // Fetch user data from the database
      const user = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email}', {
        email: decodedToken.data['email'] 
      });
      //assign user info to req.user from db object
      if (user) {
        req.user = user;

        //Check if user is blocked
        if (user.blocked) {
          responder(res, 401, 'error', 'User not authenticated');
          return;
        }

        //Check if user is verified
        if (!user.verified) {
          responder(res, 401, 'error', 'User not authenticated');
          return;
        }

        next();
      } else {
        responder(res, 401, 'error', 'User not found in the database');
        return;
      }
    } catch (err) {
      responder(res, 500, 'error', 'Server Error');
      return;
    }
  } catch (err) {
    responder(res, 401, 'error', 'Malformed or Invalid JWT token');
    return; 
  }
}

export default authenticateToken;
