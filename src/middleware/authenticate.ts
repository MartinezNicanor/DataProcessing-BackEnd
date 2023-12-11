import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import responder from '../utils/responder';
import { db } from '../db';
import {User} from '../types/user'

dotenv.config();

// Define a custom interface extending the Express Request type and insert all the info that want to be accessed later
interface AuthenticatedRequest extends Request {
    user?: User;
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
      responder(res, 401, 'error', 'Not authenticated');
      return;
    }

    try {
      // Fetch user data from the database
      const user = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', [decodedToken['email']]);

      //assign user info to req.user from db object
      if (user) {
        req.user = user;
        next();
      } else {
        responder(res, 401, 'error', 'User not found in the database');
      }
    } catch (err) {
      responder(res, 500, 'error', 'Server Error');
    }
  } catch (err) {
    responder(res, 401, 'error', 'Malformed or Invalid JWT token');
  }
}

export default authenticateToken;
