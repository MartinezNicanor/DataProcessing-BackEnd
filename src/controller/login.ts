import { Request, Response } from 'express';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators';
import jwtTokenGenerator from '../utils/jwt.generator'
import { db } from '../db';
import * as bcrypt from 'bcryptjs';

export const postLoginUser = async (req: Request, res: Response): Promise<void> => {

    const email: string = req.body.email;
    const password: string = req.body.password;

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

        if (!passwordMatch) {
            res.status(401).json({
                error: "Invalid user credentials"
            });
            return;
        }

        // Generate JWT token for verification and send it back to user
        const token: string = jwtTokenGenerator('24h', 'email', userObject.email, 'firstName', userObject.first_name, 'lastName', userObject.last_name);

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

};