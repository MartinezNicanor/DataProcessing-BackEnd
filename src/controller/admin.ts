import { Request, Response } from 'express';
import { isValidEmail, isValidPassword, validateStrings } from '../utils/validators';
import jwtTokenGenerator from '../utils/jwt.generator';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import responder from '../utils/responder';
import { User } from '../types/user';

export const postLoginAdmin = async (req: Request, res: Response) => {
    console.log("bruh");

    const email: string = req.body.email!;
    const password: string = req.body.password!;
    console.log("here");
    if (!isValidEmail(email)) {
        responder(res, 400, 'error', 'Invalid email.');
        return; 
    }

    if (!isValidPassword(password)) {
        responder(res, 400, 'error', 'Invalid password.');
    }

    // Get admin from db
    try {
        const userObject: null | User = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email} AND user_type = Admin', {
            email: email
        });

        // Check if user exists
        if (!userObject) {
            responder(res, 401, 'error', 'No admin with that email address');
            return;
        }

        // Check if password is correct
        const passwordMatch: boolean = await bcrypt.compare(password, userObject.password)

        if (!passwordMatch) {
            responder(res, 401, 'error', 'Invalid user credentials')
            return; 
        }

        // Successful Login
        const token: string = jwtTokenGenerator('24h', 'email', userObject.email, 'role', userObject.usertype);
        responder(res, 200, 'message', 'Successfull login!', 'token', token)
        return;
    } catch(err) {
        responder(res, 500, 'error', 'Internal Server Error')
        return;
    }  
};

