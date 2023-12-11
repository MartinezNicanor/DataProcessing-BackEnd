import { Request, Response } from 'express';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import responder from '../utils/responder';

export const postLoginUser = async (req: Request, res: Response): Promise<void> => {

    const email: string = req.body.email!;
    const password: string = req.body.password!;

    // interface to access sql information, variable names should match coulumn names for clarity
    interface UserData {
        email: string;
        password: string;
        blocked: boolean;
        verified: boolean;
        profile_id: number;
        first_name: string;
        last_name: string;
        numb_of_attempts: number;
    }

    // Validate email
    if (!isValidEmail(email)) {
        responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.');
        return;
    }

    //Validate password
    if (!isValidPassword(password)) {
        responder(res, 400, 'error', 'Invalid password. Please make sure that the input values are valid.');
        return;
    }

    //Fetch user object from DB
    try {
        const userObject: null | UserData = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
            email: email
        });

        //Check if user exists
        if (!userObject) {
            responder(res, 401, 'error', 'There is no user account associated with this email address');
            return;
        }

        //Check if user account is verified or not
        if (!userObject.verified){
            responder(res, 401, 'error', 'User account has not been verified yet')
            return;
        }

        //Check if user is not blocked
        if (userObject.blocked) {
            responder(res, 401, 'error', 'User account is currently blocked, please reset password');
            return;
        }

        //TODO Block User if they try to log in more then 3 times

        //Check if password is correct
        const passwordMatch: boolean = await bcrypt.compare(password, userObject.password)

        //TODO: Implement a counter to see how many times the user tried to login with wrong password
        //TODO: After 3 wrong attempts block them

        //check if the passwordMatch if false
        if (!passwordMatch) {
            //Update user number of attempts

            //TODO: CHECK LAST Login Attempt IN DB IS MORE THAN 24H AGO, IF SO RESET THE NUMBER OF ATTEMPTS TO 0 AND SET LAST LOgin attempt TO TODAY
            //TODO: MAKE A REQUEST TO DB TO INCREASE NUMBER OF ATTEMPTS

            responder(res, 401, 'error', 'Invalid user credentials')
            return;
        }

        // Generate JWT token for authentication and send it back to user. 
        // In the authenticate.ts this email will be used to make a db connection, check if user is allowed to progress,
        // and then make a user object out of them which can be imported from types/users and used throughout the application.
        const token: string = jwtTokenGenerator('24h', 'email', userObject.email, 'purpose', 'authentication');
        responder(res, 200, 'message', 'Successfull login!', 'token', token)
        return;

    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error')
        return;
    }
};

export const postPasswordResetLink = async (req: Request, res: Response): Promise<void> => {

    const email: string = req.body.email!;

    interface UserData {
        email: string;
        password: string;
        blocked: boolean;
        profile_id: number;
        first_name: string;
        last_name: string;
    }

    //Validate email
    if (!isValidEmail(email)) {
        responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.');
        return;
    }

    //check if user has been registered with email
    try {
        const userObject: null | UserData = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
            email: email
        });

        if (!userObject) {
            responder(res, 401, 'error', 'User is not registered')
            return;
        }

        //generate token  and send email to user
        try {
            const token = jwtTokenGenerator('30m', 'email', email, 'purpose', 'password-reset');
            const info = await sendMail(email, 'Password Reset', 'login/password-reset/', token, 'Click this to reset password!')
            console.log('Email sent: ', info.response);
            responder(res, 200, 'message', 'Password Resest link has been sent successfully')
            return;
        } catch (err) {
            console.log('Error sending email: ', err);
            responder(res, 500, 'error', 'Error sending mail')
            return;
        }

    } catch (err) {
        console.log(err);
        responder(res, 500, 'error', 'Internal server error')
        return;
    }
};

export const patchPasswordResetSubmit = async (req: Request, res: Response): Promise<void> => {

    const token: string = req.params.token!

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const userData = decodedToken.data;

        if (userData['purpose'] !== 'password-reset') {
            responder(res, 401, 'error', 'Incorrect JWT token');
            return;
        }

        //TODO: Implement user password update here using info from token

    } catch (err: any) {

        if (err.name === 'TokenExpiredError') {
            responder(res, 401, 'error', 'Expired Link');
        } else {

            responder(res, 400, 'err', 'JWT malformed')
            return;
        }
    }
}