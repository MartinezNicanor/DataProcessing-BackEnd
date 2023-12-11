import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators'
import responder from '../utils/responder';

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

    const email : string = req.body.email!;
    const password :string  = req.body.password!;

  //Validate email
  if (!isValidEmail(email)) {
    console.log(email, password, isValidEmail(email))
    responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.')
    return;
  }

  //Validate password
  if (!isValidPassword(password)) {
    responder(res, 400, 'error', 'Invalid password. Please make sure that the input values are valid')
    return;
  }

  //Check if email is already in DB
  try {
    const user: null | string = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
      email: email
    });

    if (user) {
      responder(res, 401, 'error', 'Email address has already been registered')
      return;
    }

  } catch (err) {
    console.log(err);
    responder(res, 500, 'error', 'Internal Server Error')
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //TODO: CREATE USER HERE IN SQL WHICH IS CURRENTLY NOT VERIFIED

  const token = jwtTokenGenerator('30m', 'email', email, 'purpose', 'account-verification');

  //send email
  try {
    const info = await sendMail(email, 'Account Verification', 'register/verification/', token, 'Verify Your account! This link is valid for 30 min');
    console.log('Email sent: ', info.response);
    responder(res, 201, 'message', 'Register successfull, verification email sent')
    return;
  } catch (err) {
    console.log('Error sending email: ', err);
    responder(res, 500, 'error', 'Error sending email')
    return;
  }
};

// Account verification logic
export const getVerifyUser = async (req: Request, res: Response): Promise<void> => {

  //get token from url
  const token: string = req.params.token!;

  //verify token and activate account in db
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const userData: jwt.JwtPayload = decodedToken.data;
    const email: string = userData['email'];

    //verify that the user did not insert an authorization token into the url or something else
    if (userData['purpose'] !== 'account-verification') {
      responder(res, 401, 'error', 'Incorrect JWT token');
      return;
    }

    //TODO IMPLEMENT UPDATE ON USER WITH THE EMAIL FROMT THE TOKEN AND VERIFY THEM

    //If everything is okay, send good response
    responder(res, 200, 'message', 'Account verified successfully')
    return;
  }
  catch (err: any) {

    if (err.name === 'TokenExpiredError') {
      responder(res, 401, 'error', 'Expired Link');
      return;
    } else {
      responder(res, 401, 'error', 'JWT malformed')
      return;
    }
  }
}