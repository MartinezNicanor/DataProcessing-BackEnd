import { Request, Response } from 'express';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const postLoginUser = async (req: Request, res: Response): Promise<void> => {

    const email: string = req.body.email!;
    const password: string = req.body.password!;

    // interface to access sql information, variable names should match coulumn names for clarity
    interface UserData {
        email: string;
        password: string;
        blocked: boolean;
        profile_id: number;
        first_name: string;
        last_name: string;
    }

    // Validate email
    if (!isValidEmail(email)) {
        res.status(400).json({
            error: "Invalid email address. Please make sure that the input values are valid."
        });
        return;
    }

    //Validate password
    if (!isValidPassword(password)) {
        res.status(400).json({
            error: "Invalid password. Please make sure that the input values are valid."
        });
        return;
    }


    //Fetch user object from DB
    try {
        const userObject: null | UserData = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
            email: email
        });

        //Check if user exists
        if (!userObject) {
            res.status(401).json({
                error: "There is no user account associated with this email address"
            })
            return;
        }

        //Check if user is not blocked
        if (userObject.blocked) {
            res.status(403).json({
                error: "User account is currently blocked, please reset password to activate"
            });
            return;
        }

        //Check if password is correct
        const passwordMatch: boolean = await bcrypt.compare(password, userObject.password)


        //TODO: Implement a counter to see how many times the user tried to login with wrong password
        //TODO: After 3 wrong attempts block them

        //check if the passwordMatch if false
        if (!passwordMatch) {
            res.status(401).json({
                error: "Invalid user credentials"
            });
            return;
        }

        // Generate JWT token for authentication and send it back to user
        const token: string = jwtTokenGenerator('24h', 'email', userObject.email, 'firstName', userObject.first_name, 'lastName', userObject.last_name, 'purpose', 'authentication');

        res.status(200).json({
            message: "Successfull login!",
            token: token
        })
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
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
        res.status(400).json({
            error: "Invalid email address. Please make sure that the input values are valid."
        });
        return;
    }

    //check if user has been registered with email
    try {
        const userObject: null | UserData = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
            email: email
        });

        if (!userObject) {
            res.status(401).json({
                error: "User is not registered"
            })
            return;
        }

        //generate token  and send email to user
        try {
            const token = jwtTokenGenerator('30m', 'email', email, 'purpose', 'password-reset');
            const info = await sendMail(email, 'Password Reset', 'login/password-reset/', token, 'Click this to reset password!')
            console.log('Email sent: ', info.response);
            res.status(200).json({
                message: "Password Reset link has been sent successfully"
            })
            return;
        } catch (err) {
            console.log('Error sending email: ', err);
            res.status(500).json({
                error: "Error sending email"
            })
            return;
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
        return;
    }
};

export const patchPasswordResetSubmit = async (req: Request, res: Response): Promise<void> => {

    const token : string = req.params.token!

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const userData = decodedToken.data;

        if(userData['purpose'] !== 'password-reset'){
            res.status(401).json({
                error: "Incorrect JWT token"
            });
            return;
        }

        //TODO: Implement user password update here using info from token

    } catch (err) {
        res.status(400).json({
            error: 'JWT malformed'
          });
          return;
    }
};