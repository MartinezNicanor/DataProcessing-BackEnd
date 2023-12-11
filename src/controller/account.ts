import responder from "../utils/responder";
import express, { Router, Request, Response } from "express";
import { db } from '../db'
import jwt from 'jsonwebtoken';

export const postCreateNewAccount = async (req: Request, res: Response): Promise<void> => {

    //Check if user has authorization header token
 try{
    const token: string | undefined = req.headers['authorization'];
    //If no token respond with error
    if(!token) { 
        responder(res, 401, 'error', 'User not authorized');
        return;
    }

    try {
        //Extract data from token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const tokenInfo = decodedToken.data;

        //Count the number of profiles for an account_id
        const numberOfAccounts = await db.oneOrNone('SELECT COUNT(*) FROM profile WHERE account_id = ${account_id}', {
            account_id : tokenInfo['account_id']
        })

        //Check if more can be created
        if(numberOfAccounts >= 4) {
            responder(res, 400, 'error', 'Maximum number of profiles have been created')
            return;
        }

        //TODO: PROFILE CREATION SQL QUERY HERE
        
        responder(res, 201, 'message', 'Profile created successfully')
        return;

    } catch (error) {
        console.error('JWT verification error:', error);
        responder(res, 401, 'error', 'Failed to verify JWT token');
        return;
    }

    //Count the number of profiles which have the same number of account_id

    } catch (err: any) {
        //Error if token expired or malformed
        if (err.name === 'TokenExpiredError') {
            responder(res, 401, 'error', 'Expired Link');
          } else {
            responder(res, 400, 'error', 'JWT malformed')
            return;
          }
    } 
};