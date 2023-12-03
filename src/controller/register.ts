import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword } from '../utils/email.pass.validators'

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

  const email: string = req.body.email;
  const password: string = req.body.password;

  //Validate email
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

  //Check if email is already in DB
  try {
    const data: null | string = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
      email: email
    });

    if (data) {
      res.status(409).json({
        error: "Email address has already been registered"
      });
      return;
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error"
    });
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //generate token
  const token = jwtTokenGenerator('30m', 'email', email, 'hashedpassword', hashedPassword);


  //TODO: IMPLEMENT THE FOLLOWING LOGIC LATER HERE WHEN DB WAS UPDATED WITH A VERIFICATION TABLE

  /*
      A verification table is needed here which stores the user email when they register and the generated JWT token, 
      Logic needs to be written here in order to make a db request to check if the email already has a JWT token which has not yet been exipred
  */

  //send email
  try {
    const info = await sendMail(email, 'Account verification!', 'register/verification/', token, 'Verify Your account! This link is valid for 30 min');
    console.log('Email sent: ', info.response);
  } catch (err) {
    console.log('Error sending email: ', err);
    return;
  }

  res.status(200).json({
    message: `Register succesful, verification email sent`,
  });
};

// account verification logic
export const getVerifyUser = async (req: Request, res: Response): Promise<void> => {

  //get token from url
  const token: string = req.params.token!;

  //verify token and activate account in db
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const userData = decode.data;
    const email = userData['email'];
    const hashedPassword = userData['hashedpassword'];

    //TODO implement user creation here using info stored in jwt token

    res.status(200).json({
      message: 'Account verified successfully'
    })
    return;
  }
  catch (err) {
    res.status(400).json({
      error: 'JWT malformed'
    })
    return;
  }
}