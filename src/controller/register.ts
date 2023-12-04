import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators'
import responder from '../utils/responder';

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

  let email: string = ''
  let password: string = ''

  const contentType: string = req.headers['content-type']!;

  if(contentType === 'application/xml'){
    email = req.body.root.email[0]
    password = req.body.root.password[0]
  } else {
    email = req.body.email!;
    password = req.body.password!;
  }

  //Validate email
  if (!isValidEmail(email)) {
    console.log(email, password, isValidEmail(email))
    responder(res, 400, contentType, 'error', 'Invalid email address. Please make sure that the input values are valid.')
    return;
  }

  //Validate password
  if (!isValidPassword(password)) {
    responder(res, 400, contentType, 'error', 'Invalid password. Please make sure that the input values are valid')
    return;
  }

  //Check if email is already in DB
  try {
    const user: null | string = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
      email: email
    });

    if (user) {
      responder(res, 409, contentType, 'error', 'Email address has already been registered')
      return;
    }

  } catch (err) {
    console.log(err);
    responder(res, 500, contentType, 'error', 'Internal Server Error')
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //generate token
  const token = jwtTokenGenerator('30m', 'email', email, 'hashedpassword', hashedPassword, 'purpose', 'account-verification');


  //TODO: IMPLEMENT THE FOLLOWING LOGIC LATER HERE WHEN DB WAS UPDATED WITH A VERIFICATION TABLE

  /*
      A verification table is needed here which stores the user email when they register and the generated JWT token, 
      Logic needs to be written here in order to make a db request to check if the email already has a JWT token which has not yet been exipred
  */

  //send email
  try {
    const info = await sendMail(email, 'Account verification!', 'register/verification/', token, 'Verify Your account! This link is valid for 30 min');
    console.log('Email sent: ', info.response);
    responder(res, 200, contentType, 'message', 'Register successfull, verification email sent')
    return;
  } catch (err) {
    console.log('Error sending email: ', err);
    responder(res, 500, contentType, 'error', 'Error sending email')
    return;
  }
};

// Account verification logic
export const getVerifyUser = async (req: Request, res: Response): Promise<void> => {

  //get token from url
  const token: string = req.params.token!;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  const userData: jwt.JwtPayload = decodedToken.data;
  const contentType: string = req.headers['content-type']!
  const email: string = userData['email'];
  const hashedPassword: string = userData['hashedpassword'];

  //verify token and activate account in db
  try {
    //verify that the user did not insert an authorization token into the url or something else
    if (userData['purpose'] !== 'account-verification') {
      responder(res, 401, contentType, 'error', 'Incorrect JWT token');
      return;
    }

    //TODO implement user creation here using info stored in jwt token
    responder(res, 200, contentType, 'message', 'Account verified successfully')
    return;
  }
  catch (err) {
    responder(res, 400, contentType, 'error', 'JWT malformed')
    return;
  }
}